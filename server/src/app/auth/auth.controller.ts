import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { signupSchema, signinSchema } from "./auth.schema";
import { db } from "../../db";
import { users, otps } from "../../db/schema";
import { eq } from "drizzle-orm";
import { createUserToken } from "../utils/token";
import { emailQueue } from "../queue/email.queue";

class AuthenticationController {
  public async handleSignup(req: Request, res: Response) {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const { name, email, password } = parsed.data;

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (existingUser.length > 0) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await db.insert(users).values({
        name,
        email,
        password: hashedPassword,
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await db.delete(otps).where(eq(otps.email, email));

      await db.insert(otps).values({
        email,
        otp,
        expiresAt,
      });

      setTimeout(
        async () => {
          try {
            await db.delete(otps).where(eq(otps.email, email));
          } catch (err) {
            console.error("OTP cleanup failed:", err);
          }
        },
        10 * 60 * 1000,
      );

      await emailQueue.add("send-otp", {
        email,
        otp,
      });

      return res.status(201).json({ message: "OTP sent to email" });
    } catch (error) {
      return res.status(500).json({ error: "Signup failed" });
    }
  }

  public async handleSignin(req: Request, res: Response) {
    try {
      const parsed = signinSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: parsed.error });
      }

      const { email, password } = parsed.data;

      const userResult = await db
        .select()
        .from(users)
        .where(eq(users.email, email));

      if (userResult.length === 0) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const user = userResult[0];

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ error: "Please verify OTP first" });
      }

      const token = createUserToken({
        id: user.id,
        role: user.role,
      });

      return res
        .status(200)
        .json({ message: "Login Successful", token: token });
    } catch (error) {
      return res.status(500).json({ error: "Signin failed" });
    }
  }

  public async handleOptVerification(req: Request, res: Response) {
    try {
      const { email, otp } = req.body;

      const records = await db.select().from(otps).where(eq(otps.email, email));

      if (records.length === 0) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      const otpRecord = records[0];

      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ error: "Invalid OTP" });
      }

      if (new Date() > otpRecord.expiresAt) {
        return res.status(400).json({ error: "OTP expired" });
      }

      await db
        .update(users)
        .set({ isVerified: true })
        .where(eq(users.email, email));

      await db.delete(otps).where(eq(otps.email, email));

      return res.status(201).json({ message: "User verified successfully" });
    } catch (error) {
      return res.status(500).json({ error: "OTP verification failed" });
    }
  }

  public async handleLogout(_: Request, res: Response) {
    return res.status(200).json({ message: "Logged out successfully" });
  }

  public async handleGetCurrentUser(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.json({ user: req.user });
  }
}

export default AuthenticationController;

import nodemailer from "nodemailer";
import { env } from "../../env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(email: string, otp: string) {
  await transporter.sendMail({
    from: `"AglaShow" <${env.EMAIL_USER}>`,
    to: email,
    subject: `${otp} is your AglaShow verification code`,
    text: `Your AglaShow verification code is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
        <h2>Verify your account</h2>
        <p>Thanks for choosing <b>AglaShow</b>! Use the following OTP to complete your sign-up or login:</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #2563eb; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code is valid for 10 minutes. If you didn't request this, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #888;">&copy; ${new Date().getFullYear()} AglaShow. All rights reserved.</p>
      </div>
    `,
  });
}

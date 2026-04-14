import "dotenv/config";
import { Worker } from "bullmq";
import { sendOtpEmail } from "../services/email.service";
import { env } from "../../env";

new Worker(
  "email-queue",
  async (job) => {
    const { email, otp } = job.data;
    await sendOtpEmail(email, otp);
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
  },
)
  .on("completed", (job) => {
    console.log(`Email sent to ${job.data.email}`);
  })
  .on("failed", (job, error) => {
    console.error(`Email failed for ${job?.data.email}`, error);
  });

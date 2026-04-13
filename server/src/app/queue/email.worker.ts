import { Worker } from "bullmq";
import { sendOtpEmail } from "../services/email.service";

new Worker(
  "email-queue",
  async (job) => {
    const { email, otp } = job.data;
    await sendOtpEmail(email, otp);
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  },
)
  .on("completed", (job) => {
    console.log(`Email sent to ${job.data.email}`);
  })
  .on("failed", (job, error) => {
    console.error(`Email failed for ${job?.data.email}`, error);
  });

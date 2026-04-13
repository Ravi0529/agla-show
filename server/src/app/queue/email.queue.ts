import { Queue } from "bullmq";
import { env } from "../../env";

export const emailQueue = new Queue("email-queue", {
  connection: {
    url: env.REDIS_URL,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

import { Queue } from "bullmq";
import { env } from "../../env";

export const seatQueue = new Queue("seat-queue", {
  connection: {
    url: env.REDIS_URL,
  },
});

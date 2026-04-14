import { Worker } from "bullmq";
import SeatService from "../seat/seat.service";
import { env } from "../../env";

const seatService = new SeatService();

new Worker(
  "seat-queue",
  async (job) => {
    if (job.name === "release-expired-seats") {
      console.log("Running seat cleanup job...");
      await seatService.releaseExpiredLocks();
    }
  },
  {
    connection: {
      url: env.REDIS_URL,
    },
  },
);

import { seatQueue } from "./seat.queue";

export async function setupSeatJobs() {
  await seatQueue.add(
    "release-expired-seats",
    {},
    {
      repeat: {
        every: 60 * 1000,
      },
    },
  );
}

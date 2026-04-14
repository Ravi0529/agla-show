import { db } from "../../db";
import { seats } from "../../db/schema";
import { and, eq, inArray, lt } from "drizzle-orm";

class SeatService {
  async createSeatsForShow(showId: string, totalSeats: number) {
    const seatData = [];

    for (let i = 1; i <= totalSeats; i++) {
      seatData.push({
        showId,
        seatNumber: i.toString(),
        status: "available" as const,
      });
    }

    await db.insert(seats).values(seatData);
  }

  async lockSeats(userId: string, seatIds: string[]) {
    const now = new Date();
    const lockExpiry = new Date(now.getTime() - 5 * 60 * 1000);

    return await db.transaction(async (tx) => {
      const selectedSeats = await tx
        .select()
        .from(seats)
        .where(inArray(seats.id, seatIds))
        .for("update");

      for (const seat of selectedSeats) {
        if (seat.status === "booked") {
          throw new Error(`Seat ${seat.seatNumber} already booked`);
        }

        if (
          seat.status === "locked" &&
          seat.lockedAt &&
          seat.lockedAt > lockExpiry
        ) {
          throw new Error(`Seat ${seat.seatNumber} is locked by another user`);
        }
      }

      await tx
        .update(seats)
        .set({
          status: "locked",
          lockedBy: userId,
          lockedAt: now,
        })
        .where(inArray(seats.id, seatIds));

      return true;
    });
  }

  async confirmBooking(userId: string, seatIds: string[]) {
    return await db.transaction(async (tx) => {
      const selectedSeats = await tx
        .select()
        .from(seats)
        .where(inArray(seats.id, seatIds))
        .for("update");

      for (const seat of selectedSeats) {
        if (seat.status !== "locked" || seat.lockedBy !== userId) {
          throw new Error(`Seat ${seat.seatNumber} not locked by user`);
        }
      }

      await tx
        .update(seats)
        .set({
          status: "booked",
          bookedBy: userId,
        })
        .where(inArray(seats.id, seatIds));

      return true;
    });
  }

  async releaseExpiredLocks() {
    const expiry = new Date(Date.now() - 5 * 60 * 1000);

    await db
      .update(seats)
      .set({
        status: "available",
        lockedBy: null,
        lockedAt: null,
      })
      .where(and(eq(seats.status, "locked"), lt(seats.lockedAt, expiry)));
  }

  async getSeatsByShow(showId: string) {
    return db.select().from(seats).where(eq(seats.showId, showId));
  }
}

export default SeatService;

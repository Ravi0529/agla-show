import { db } from "../../db";
import { shows, screens } from "../../db/schema";
import { eq } from "drizzle-orm";
import SeatService from "../seat/seat.service";

const seatService = new SeatService();

class ShowService {
  async createShow(data: {
    movieId: string;
    screenId: string;
    startTime: string;
    price: number;
  }) {
    const [show] = await db
      .insert(shows)
      .values({
        movieId: data.movieId,
        screenId: data.screenId,
        startTime: new Date(data.startTime),
        price: data.price,
      })
      .returning();

    if (!show) {
      throw new Error("Failed to create show in database");
    }

    const [screen] = await db
      .select()
      .from(screens)
      .where(eq(screens.id, data.screenId));

    if (!screen) throw new Error("Screen not found");

    if (!screen.totalSeats) {
      throw new Error("Screen does not have a valid seat capacity defined");
    }

    await seatService.createSeatsForShow(show.id, screen.totalSeats);

    return show;
  }
}

export default ShowService;

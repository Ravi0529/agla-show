import { db } from "../../db";
import { theatres } from "../../db/schema";
import { eq } from "drizzle-orm";

type CreateTheatreData = {
  name: string;
  location: string;
};

class TheatreService {
  async createTheatre(data: CreateTheatreData) {
    const [theatre] = await db
      .insert(theatres)
      .values({
        name: data.name,
        location: data.location,
      })
      .returning();

    return theatre;
  }

  async getAllTheatres() {
    return db.select().from(theatres);
  }

  async getTheatreById(id: string) {
    const result = await db.select().from(theatres).where(eq(theatres.id, id));

    return result[0] || null;
  }
}

export default TheatreService;

import { db } from "../../db";
import { movies } from "../../db/schema";
import { eq } from "drizzle-orm";

type CreateMovieData = {
  title: string;
  description?: string | undefined;
  duration: number;
  language: string;
  posterUrl: string;
};

class MovieService {
  async createMovie(data: CreateMovieData) {
    const [movie] = await db
      .insert(movies)
      .values({
        title: data.title,
        description: data.description,
        duration: data.duration,
        language: data.language,
        posterUrl: data.posterUrl,
      })
      .returning();

    return movie;
  }

  async getAllMovies() {
    return db.select().from(movies);
  }

  async getMovieById(id: string) {
    const result = await db.select().from(movies).where(eq(movies.id, id));

    return result[0] || null;
  }
}

export default MovieService;

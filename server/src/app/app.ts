import express, { urlencoded } from "express";
import type { Express, Request, Response } from "express";
import { authenticationMiddleware } from "./middleware/auth.middleware";

import { authRouter } from "./auth/auth.routes";
import { movieRouter } from "./movie/movie.routes";
import { theatreRouter } from "./theatre/theatre.routes";
import { screenRouter } from "./screen/screen.routes";
import { showRouter } from "./show/show.routes";
import { bookingRouter } from "./booking/booking.routes";
import { seatRouter } from "./seat/seat.routes";

import { setupSeatJobs } from "./queue/seat.scheduler";

export function createApplication(): Express {
  const app = express();

  app.use(express.json());
  app.use(urlencoded({ extended: true, limit: "5mb" }));
  app.use(authenticationMiddleware());

  app.get("/health", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the AglaShow server!" });
  });

  setupSeatJobs();

  app.use("/api/auth", authRouter);
  app.use("/api/movie", movieRouter);
  app.use("/api/theatre", theatreRouter);
  app.use("/api/screen", screenRouter);
  app.use("/api/show", showRouter);
  app.use("/api/booking", bookingRouter);
  app.use("/api/seat", seatRouter);

  return app;
}

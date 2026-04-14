import express, { urlencoded } from "express";
import type { Express, Request, Response } from "express";
import { authenticationMiddleware } from "./middleware/auth.middleware";

import { authRouter } from "./auth/auth.routes";
import { movieRouter } from "./movie/movie.routes";
import { theatreRouter } from "./theatre/theatre.routes";

export function createApplication(): Express {
  const app = express();

  app.use(express.json());
  app.use(urlencoded({ extended: true, limit: "5mb" }));
  app.use(authenticationMiddleware());

  app.get("/health", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the AglaShow server!" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/movie", movieRouter);
  app.use("/api/theatre", theatreRouter);

  return app;
}

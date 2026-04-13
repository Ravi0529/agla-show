import express, { urlencoded } from "express";
import type { Express, Request, Response } from "express";
import { authenticationMiddleware } from "./middleware/auth.middleware";

export function createApplication(): Express {
  const app = express();

  app.use(express.json());
  app.use(urlencoded({ extended: true, limit: "5mb" }));
  app.use(authenticationMiddleware());

  app.get("/health", (_: Request, res: Response) => {
    res.json({ message: "Welcome to the AglaShow server!" });
  });

  return app;
}

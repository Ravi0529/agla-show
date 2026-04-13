import express from "express";
import type { Router } from "express";
import MovieController from "./movie.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";
import { restrictToAdmin } from "../middleware/admin.middleware";
import { upload } from "../middleware/upload.middleware";

const movieController = new MovieController();

export const movieRouter: Router = express.Router();

movieRouter.post(
  "/create-movie",
  restrictToAuthenticatedUser(),
  restrictToAdmin(),
  upload.single("poster"),
  movieController.createMovie.bind(movieController),
);

movieRouter.get(
  "/get-all-movies",
  restrictToAuthenticatedUser(),
  movieController.getAllMovies.bind(movieController),
);

movieRouter.get(
  "/:id",
  restrictToAuthenticatedUser(),
  movieController.getMovieById.bind(movieController),
);

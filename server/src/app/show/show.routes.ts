import express from "express";
import ShowController from "./show.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";
import { restrictToAdmin } from "../middleware/admin.middleware";

const showController = new ShowController();

export const showRouter = express.Router();

showRouter.post(
  "/create-show",
  restrictToAuthenticatedUser(),
  restrictToAdmin(),
  showController.createShow.bind(showController),
);

showRouter.get(
  "/movie/:movieId",
  restrictToAuthenticatedUser(),
  showController.getShowsByMovie.bind(showController),
);

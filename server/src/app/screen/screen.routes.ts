import express from "express";
import ScreenController from "./screen.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";
import { restrictToAdmin } from "../middleware/admin.middleware";

export const screenRouter = express.Router();
const screenController = new ScreenController();

screenRouter.post(
  "/create-screen",
  restrictToAuthenticatedUser(),
  restrictToAdmin(),
  screenController.createScreen.bind(screenController),
);

screenRouter.get(
  "/:theatreId",
  restrictToAuthenticatedUser(),
  screenController.getScreensByTheatre.bind(screenController),
);

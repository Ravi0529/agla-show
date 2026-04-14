import express from "express";
import ScreenController from "./screen.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";
import { restrictToAdmin } from "../middleware/admin.middleware";

export const screenRouter = express.Router();
const controller = new ScreenController();

screenRouter.post(
  "/create-screen",
  restrictToAuthenticatedUser(),
  restrictToAdmin(),
  controller.createScreen.bind(controller),
);

screenRouter.get(
  "/:theatreId",
  restrictToAuthenticatedUser(),
  controller.getScreensByTheatre.bind(controller),
);

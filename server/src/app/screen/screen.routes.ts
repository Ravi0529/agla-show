import express from "express";
import ScreenController from "./screen.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";
import { restrictToAdmin } from "../middleware/admin.middleware";

const router = express.Router();
const controller = new ScreenController();

router.post(
  "/create-screen",
  restrictToAuthenticatedUser(),
  restrictToAdmin(),
  controller.createScreen.bind(controller),
);

router.get(
  "/:theatreId",
  restrictToAuthenticatedUser(),
  controller.getScreensByTheatre.bind(controller),
);

export const screenRouter = router;

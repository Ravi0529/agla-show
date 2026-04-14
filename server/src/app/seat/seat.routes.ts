import express from "express";
import SeatController from "./seat.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";

const controller = new SeatController();

export const seatRouter = express.Router();

seatRouter.get(
  "/:showId",
  restrictToAuthenticatedUser(),
  controller.getSeatsByShow.bind(controller),
);

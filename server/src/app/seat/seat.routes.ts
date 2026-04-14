import express from "express";
import SeatController from "./seat.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";

const seatController = new SeatController();

export const seatRouter = express.Router();

seatRouter.get(
  "/:showId",
  restrictToAuthenticatedUser(),
  seatController.getSeatsByShow.bind(seatController),
);

seatRouter.post(
  "/lock",
  restrictToAuthenticatedUser(),
  seatController.lockSeats.bind(seatController)
);

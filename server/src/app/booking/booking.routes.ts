import express from "express";
import BookingController from "./booking.controller";
import { restrictToAuthenticatedUser } from "../middleware/auth.middleware";

export const bookingRouter = express.Router();
const bookingController = new BookingController();

bookingRouter.post(
  "/create",
  restrictToAuthenticatedUser(),
  bookingController.createBooking.bind(bookingController),
);

bookingRouter.post(
  "/verify-payment",
  restrictToAuthenticatedUser(),
  bookingController.verifyPayment.bind(bookingController),
);

import { api } from "../../../shared/lib/axios";

export type CreateBookingResponse = {
  message: string;
  booking: {
    id: string;
    showId: string;
    userId: string;
    totalAmount: number;
    status: "pending" | "confirmed" | string;
  };
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
  };
};

export type VerifyPaymentPayload = {
  bookingId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
};

export type VerifyPaymentResponse = {
  message: string;
};

export const createBooking = async (
  showId: string,
  seatIds: string[]
): Promise<CreateBookingResponse> => {
  const res = await api.post<CreateBookingResponse>("/booking/create", {
    showId,
    seatIds,
  });
  return res.data;
};

export const verifyPayment = async (
  data: VerifyPaymentPayload
): Promise<VerifyPaymentResponse> => {
  const res = await api.post<VerifyPaymentResponse>(
    "/booking/verify-payment",
    data
  );
  return res.data;
};

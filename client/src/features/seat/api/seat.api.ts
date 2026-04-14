import { api } from "../../../shared/lib/axios";

export const getSeats = async (showId: string) => {
  const res = await api.get(`/seat/${showId}`);
  return res.data.data;
};

export const lockSeats = async (seatIds: string[]) => {
  const res = await api.post("/seat/lock", { seatIds });
  return res.data;
};

import { api } from "../../../shared/lib/axios";

export const getShowsByMovie = async (movieId: string) => {
  const res = await api.get(`/show/movie/${movieId}`);
  return res.data.data;
};

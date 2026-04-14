import { api } from "../../../shared/lib/axios";

export const getMovies = async () => {
  const res = await api.get("/movie/get-all-movies");
  return res.data;
};

export const getMovieById = async (id: string) => {
  const res = await api.get(`/movie/${id}`);
  return res.data;
};

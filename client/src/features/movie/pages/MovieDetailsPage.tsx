import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieById } from "../api/movie.api";
import Loader from "../../../shared/components/Loader";
import Button from "../../../shared/components/Button";
import {
  CalendarDays,
  ChevronLeft,
  Clapperboard,
  Clock3,
  Languages,
  Ticket,
} from "lucide-react";

type Movie = {
  id: string;
  title: string;
  posterUrl?: string;
  description?: string;
  duration?: number;
  language?: string;
  releaseDate?: string;
};

function normalizeMovie(payload: unknown): Movie | null {
  if (!payload || typeof payload !== "object") return null;

  const maybeWrapper = payload as { movie?: unknown };
  const raw = "movie" in maybeWrapper ? maybeWrapper.movie : payload;
  if (!raw || typeof raw !== "object") return null;

  const m = raw as Partial<Movie>;
  if (typeof m.id !== "string" || typeof m.title !== "string") return null;
  return m as Movie;
}

const MovieDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (!id) return;
        const res = (await getMovieById(id)) as { data: unknown };
        setMovie(normalizeMovie(res.data));
      } catch (error) {
        console.error("Failed to fetch movie");
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) return <Loader />;

  if (!movie) {
    return (
      <div className="min-h-[60vh] bg-zinc-50">
        <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[60%] lg:py-14">
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
              <Clapperboard className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-lg font-semibold text-zinc-950">
              Movie not found
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              The movie you’re looking for may have been removed.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Back to movies
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:w-[60%] lg:py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>

          <div className="hidden items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100 sm:inline-flex">
            <Ticket className="h-4 w-4" aria-hidden="true" />
            BookMyShow-style
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="relative aspect-2/3 bg-zinc-100">
              {movie.posterUrl ? (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">
                  <Clapperboard className="h-8 w-8" aria-hidden="true" />
                </div>
              )}
            </div>
            <div className="border-t border-zinc-200 p-4">
              <div className="flex flex-wrap gap-2 text-xs">
                {typeof movie.duration === "number" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {movie.duration} mins
                  </span>
                ) : null}
                {movie.language ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                    {movie.language}
                  </span>
                ) : null}
                {movie.releaseDate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 font-semibold text-zinc-700 ring-1 ring-zinc-200">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {movie.releaseDate}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              {movie.title}
            </h1>

            {movie.description ? (
              <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base">
                {movie.description}
              </p>
            ) : (
              <p className="mt-3 text-sm text-zinc-500">
                No description available for this title.
              </p>
            )}

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-sm font-semibold text-zinc-900">
                  About the movie
                </p>
                <div className="mt-3 space-y-2 text-sm text-zinc-700">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Duration</span>
                    <span className="font-semibold text-zinc-900">
                      {typeof movie.duration === "number"
                        ? `${movie.duration} mins`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Language</span>
                    <span className="font-semibold text-zinc-900">
                      {movie.language ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-red-100 bg-red-50/40 p-4">
                <p className="text-sm font-semibold text-zinc-900">
                  Ready to book?
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Choose your showtime and seats in the next step.
                </p>
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={() => navigate(`/shows/${movie.id}`)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Ticket className="h-4 w-4" aria-hidden="true" />
                      Book Tickets
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsPage;

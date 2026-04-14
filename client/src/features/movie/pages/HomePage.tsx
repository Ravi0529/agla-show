import { useEffect, useState } from "react";
import { getMovies } from "../api/movie.api";
import Loader from "../../../shared/components/Loader";
import { Film, SearchX } from "lucide-react";

const HomePage = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await getMovies();

        setMovies(res.data || []);
      } catch (error) {
        console.error("Error fetching movies", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-8 sm:px-6 lg:w-[60%] lg:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
              <Film className="h-4 w-4" aria-hidden="true" />
              Now Showing
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
              Movies
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Browse posters and pick your next watch.
            </p>
          </div>
        </div>

        <div className="mt-6">
          {movies.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
                <SearchX className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-zinc-950">
                No movies found
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                Try again later—new shows are added regularly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {movies.map((movie) => (
                <article
                  key={movie.id}
                  className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="relative aspect-2/3 overflow-hidden bg-zinc-100">
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  </div>
                  <div className="p-3">
                    <h2 className="line-clamp-2 text-sm font-semibold text-zinc-950">
                      {movie.title}
                    </h2>
                    <p className="mt-1 text-xs text-zinc-500">
                      Tap to view showtimes
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

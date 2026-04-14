import { useEffect, useState } from "react";
import { getMovies } from "../api/movie.api";
import Loader from "../../../shared/components/Loader";
import { Film, SearchX } from "lucide-react";
import MovieCard from "../components/MovieCard";

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
            <p className="mt-3 text-md font-medium text-zinc-600">
              Browse and pick your next watch.
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
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { useEffect, useState } from "react";
import { getMovies } from "../api/movie.api";

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

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Movies</h1>

      {movies.length === 0 ? (
        <p>No movies found</p>
      ) : (
        movies.map((movie) => (
          <div key={movie.id}>
            <h2>{movie.title}</h2>
            <img src={movie.posterUrl} width={200} />
          </div>
        ))
      )}
    </div>
  );
};

export default HomePage;

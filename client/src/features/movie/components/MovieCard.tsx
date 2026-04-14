type Props = {
  movie: any;
};

export default function MovieCard({ movie }: Props) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
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
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-950">
          {movie.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          {movie.language ? movie.language : "Tap to view showtimes"}
        </p>
      </div>
    </article>
  );
}

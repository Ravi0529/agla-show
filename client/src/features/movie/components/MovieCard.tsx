export default function MovieCard({ movie }: any) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
      <img src={movie.posterUrl} className="w-full h-62.5 object-cover" />
      <div className="p-3">
        <h3 className="font-semibold">{movie.title}</h3>
        <p className="text-sm text-gray-500">{movie.language}</p>
      </div>
    </div>
  );
}

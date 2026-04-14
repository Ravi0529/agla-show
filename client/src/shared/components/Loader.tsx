export default function Loader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div
        className="h-10 w-10 animate-spin rounded-full border-[3px] border-red-200 border-t-red-600"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
}

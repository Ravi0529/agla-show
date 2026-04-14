type Props = React.InputHTMLAttributes<HTMLInputElement>;

export default function Input(props: Props) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 shadow-sm transition",
        "placeholder:text-zinc-400",
        "hover:border-zinc-300",
        "focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20",
        "disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500",
        props.className ?? "",
      ].join(" ")}
    />
  );
}

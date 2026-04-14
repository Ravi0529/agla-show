type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition",
        "hover:bg-red-700 active:bg-red-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        "disabled:cursor-not-allowed disabled:opacity-60",
        props.className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

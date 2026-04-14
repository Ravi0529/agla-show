import { useNavigate } from "react-router-dom";
import { Clapperboard, LogOut, Ticket } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto w-full px-4 py-3 sm:px-6 lg:w-[60%]">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 rounded-lg px-2 py-1 text-left hover:bg-zinc-50"
            aria-label="Go to home"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
              <Clapperboard className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block text-lg font-semibold text-zinc-950">
                AglaShow
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="hidden items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 sm:flex"
            >
              <Ticket className="h-4 w-4 text-red-600" aria-hidden="true" />
              Browse
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-red-600/20 hover:bg-red-700 active:bg-red-700"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

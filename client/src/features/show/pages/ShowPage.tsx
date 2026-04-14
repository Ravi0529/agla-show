import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getShowsByMovie } from "../api/show.api";
import Loader from "../../../shared/components/Loader";
import Button from "../../../shared/components/Button";
import {
  CalendarDays,
  ChevronLeft,
  Clock3,
  MapPin,
  Monitor,
  Ticket,
} from "lucide-react";

type Theatre = {
  id: string;
  name: string;
  location: string;
};

type Screen = {
  id: string;
  name: string;
};

type Show = {
  id: string;
  startTime: string;
  price: number;
  screen: Screen;
  theatre: Theatre;
};

function formatDateParts(isoOrDateLike: string) {
  const d = new Date(isoOrDateLike);
  if (Number.isNaN(d.getTime())) {
    return { date: "—", time: "—" };
  }
  return {
    date: d.toLocaleDateString(undefined, {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export default function ShowPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const data = await getShowsByMovie(movieId!);
        setShows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, [movieId]);

  if (loading) return <Loader />;

  if (!shows.length) {
    return (
      <div className="min-h-[60vh] bg-zinc-50">
        <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[60%] lg:py-14">
          <div className="mb-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
              <Ticket className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-lg font-semibold text-zinc-950">
              No shows available
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Try again later or check another movie.
            </p>
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
            Select your showtime
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
            Available Shows
          </h1>
          <p className="mt-1 text-sm text-zinc-600">
            Pick a theatre, time, and screen to continue.
          </p>
        </div>

        <div className="mt-6 grid gap-4">
          {shows.map((show) => {
            const { date, time } = formatDateParts(show.startTime);
            return (
              <div
                key={show.id}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold text-zinc-950">
                      {show.theatre?.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">
                        <Monitor className="h-3.5 w-3.5" aria-hidden="true" />
                        {show.screen?.name}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">
                        <CalendarDays
                          className="h-3.5 w-3.5"
                          aria-hidden="true"
                        />
                        {date}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-red-700 ring-1 ring-red-100">
                        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                        {time}
                      </span>
                      {show.theatre?.location ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {show.theatre.location}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm">
                      <span className="text-zinc-500">Amount</span>
                      <span className="font-semibold text-zinc-900">
                        ₹{show.price}
                      </span>
                    </div>
                  </div>

                  <div className="sm:w-52">
                    <Button
                      type="button"
                      onClick={() => navigate(`/seats/${show.id}`)}
                    >
                      <span className="inline-flex items-center gap-2">
                        <Ticket className="h-4 w-4" aria-hidden="true" />
                        Select Seats
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

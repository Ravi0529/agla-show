import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSeats } from "../api/seat.api";
import {
  createBooking,
  type CreateBookingResponse,
  verifyPayment,
} from "../../booking/api/booking.api";
import Loader from "../../../shared/components/Loader";
import Button from "../../../shared/components/Button";
import {
  Armchair,
  CheckCircle2,
  ChevronLeft,
  Info,
  LockKeyhole,
  Ticket,
  XCircle,
} from "lucide-react";

type SeatStatus = "available" | "booked" | "locked";

type Seat = {
  id: string;
  seatNumber: string | number;
  status: SeatStatus;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: unknown) => { open: () => void };
  }
}

async function loadRazorpayScript() {
  if (window.Razorpay) return true;

  return await new Promise<boolean>((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function compareSeatNumber(a: Seat["seatNumber"], b: Seat["seatNumber"]) {
  const as = String(a);
  const bs = String(b);

  const an = Number(as);
  const bn = Number(bs);
  const aIsNum =
    as.trim() !== "" && Number.isFinite(an) && /^\d+(\.\d+)?$/.test(as);
  const bIsNum =
    bs.trim() !== "" && Number.isFinite(bn) && /^\d+(\.\d+)?$/.test(bs);
  if (aIsNum && bIsNum) return an - bn;

  return as.localeCompare(bs, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

export default function SeatPage() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const data = await getSeats(showId!);
      setSeats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat: Seat) => {
    if (seat.status !== "available") return;

    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats((prev) => prev.filter((id) => id !== seat.id));
    } else {
      setSelectedSeats((prev) => [...prev, seat.id]);
    }
  };

  const handleBooking = async () => {
    if (!showId || selectedSeats.length === 0) return;

    try {
      setPaying(true);

      const ok = await loadRazorpayScript();
      if (!ok) {
        alert("Failed to load payment gateway. Please try again.");
        return;
      }

      const res: CreateBookingResponse = await createBooking(
        showId,
        selectedSeats
      );
      const bookingId = res.booking.id;
      const orderId = res.order.id;
      const amount = res.order.amount; // already in paise from backend

      const key =
        (import.meta as unknown as { env?: Record<string, string | undefined> })
          .env?.VITE_RAZORPAY_KEY_ID ?? "";

      const options = {
        key,
        amount,
        currency: res.order.currency ?? "INR",
        order_id: orderId,
        name: "AglaShow",
        description: "Movie ticket booking",
        handler: async (response: RazorpaySuccessResponse) => {
          await verifyPayment({
            bookingId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });

          alert("Booking successful!");
          setSelectedSeats([]);
          fetchSeats();
        },
        theme: { color: "#E11D48" },
      };

      if (!window.Razorpay) {
        alert("Payment gateway unavailable. Please refresh and try again.");
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      const message =
        typeof err === "object" && err !== null && "response" in err
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ((err as any).response?.data?.error as string | undefined)
          : undefined;
      alert(message || "Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader />;

  const selectedCount = selectedSeats.length;
  const totalSeats = seats.length;
  const orderedSeats = [...seats].sort((x, y) =>
    compareSeatNumber(x.seatNumber, y.seatNumber)
  );

  const getGridCols = (count: number) => {
    if (count <= 60) return 12;
    if (count <= 100) return 14;
    if (count <= 140) return 16;
    if (count <= 200) return 18;
    return 20;
  };
  const gridCols = getGridCols(totalSeats);

  const getMobileCols = (count: number) => {
    if (count <= 60) return 10;
    if (count <= 120) return 9;
    return 8;
  };
  const mobileCols = Math.min(gridCols, getMobileCols(totalSeats));

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:w-[60%] lg:py-8">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </button>

            <div className="hidden items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700 ring-1 ring-zinc-200 sm:inline-flex">
              <Armchair className="h-4 w-4 text-red-600" aria-hidden="true" />
              {totalSeats} seats
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                Seat Selection
              </div>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950 sm:text-3xl">
                Select your seats
              </h1>
              <p className="mt-1 text-sm text-zinc-600">
                Seats are shown above the screen. Tap to select available seats.
              </p>
            </div>

            <div className="sm:w-56">
              <Button
                type="button"
                onClick={handleBooking}
                disabled={selectedCount === 0 || paying}
              >
                <span className="inline-flex items-center gap-2">
                  <Ticket className="h-4 w-4" aria-hidden="true" />
                  {paying
                    ? "Opening payment..."
                    : `Pay & Book${selectedCount ? ` (${selectedCount})` : ""}`}
                </span>
              </Button>
              <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                <Info className="h-4 w-4" aria-hidden="true" />
                Seats lock automatically (expires in ~5 minutes)
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
              <span className="inline-flex h-3 w-3 rounded-sm bg-white ring-1 ring-zinc-300" />
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2
                  className="h-4 w-4 text-zinc-400"
                  aria-hidden="true"
                />
                Available
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
              <span className="inline-flex h-3 w-3 rounded-sm bg-zinc-200 ring-1 ring-zinc-300" />
              <span className="inline-flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                Booked
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-700">
              <span className="inline-flex h-3 w-3 rounded-sm bg-amber-200 ring-1 ring-amber-300" />
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole
                  className="h-4 w-4 text-amber-700"
                  aria-hidden="true"
                />
                Locked
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/40 px-3 py-2 text-xs font-semibold text-red-700">
              <span className="inline-flex h-3 w-3 rounded-sm bg-red-600 ring-1 ring-red-600/20" />
              <span className="inline-flex items-center gap-1.5">
                <Armchair className="h-4 w-4" aria-hidden="true" />
                Selected
              </span>
            </div>
          </div>

          <div className="mt-6">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:p-5">
              <div className="max-h-[70vh] overflow-auto lg:max-h-none lg:overflow-visible">
                <div className="min-w-full pb-6">
                  <div
                    className="grid gap-2 grid-cols-[repeat(var(--cols),minmax(0,1fr))] lg:grid-cols-[repeat(var(--cols-lg),minmax(0,1fr))]"
                    style={
                      {
                        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                        ["--cols" as any]: mobileCols,
                        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                        ["--cols-lg" as any]: gridCols,
                      } as React.CSSProperties
                    }
                  >
                    {orderedSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.id);
                      const isAvailable = seat.status === "available";
                      const isBooked = seat.status === "booked";
                      const isLocked = seat.status === "locked";

                      const base =
                        "aspect-square w-full rounded-lg text-xs font-semibold leading-none transition sm:text-xs";
                      const interactive = isAvailable
                        ? "cursor-pointer hover:-translate-y-0.5"
                        : "cursor-not-allowed opacity-75";
                      const state = isSelected
                        ? "bg-red-600 text-white shadow-sm shadow-red-600/20"
                        : isBooked
                        ? "bg-zinc-200 text-zinc-500"
                        : isLocked
                        ? "bg-amber-200 text-amber-900"
                        : "bg-white text-zinc-800 ring-1 ring-zinc-300 hover:ring-red-200";

                      return (
                        <button
                          key={seat.id}
                          onClick={() => toggleSeat(seat)}
                          className={[base, interactive, state].join(" ")}
                          aria-pressed={isSelected}
                          aria-disabled={!isAvailable}
                          title={
                            isSelected
                              ? `Selected seat ${seat.seatNumber}`
                              : isBooked
                              ? `Booked seat ${seat.seatNumber}`
                              : isLocked
                              ? `Locked seat ${seat.seatNumber}`
                              : `Available seat ${seat.seatNumber}`
                          }
                          type="button"
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-center">
                <div className="w-full max-w-md">
                  <div className="relative">
                    <div className="h-1 w-full rounded-full bg-linear-to-r from-zinc-200 via-zinc-300 to-zinc-200" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[999px] border border-zinc-200 bg-white/60 backdrop-blur" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold tracking-[0.35em] text-zinc-500">
                      SCREEN THIS WAY
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

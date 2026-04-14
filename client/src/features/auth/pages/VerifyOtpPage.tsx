import { useForm } from "react-hook-form";
import { verifyOtp } from "../api/auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { BadgeCheck, KeyRound, Mail } from "lucide-react";

export default function VerifyOtpPage() {
  const { register, handleSubmit } = useForm();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const onSubmit = async (data: any) => {
    await verifyOtp({ email, otp: data.otp });
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[60%] lg:py-14">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-red-700" />

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">
                  Verify your email
                </h2>
                <p className="mt-1 text-sm text-zinc-600">
                  Enter the OTP we sent to continue.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-600">
                  <span className="inline-flex items-center gap-2 rounded-full bg-zinc-50 px-3 py-1 ring-1 ring-zinc-200">
                    <Mail className="h-4 w-4 text-red-600" aria-hidden="true" />
                    <span className="font-medium text-zinc-900">
                      {email || "your email"}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="self-start rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50"
            >
              Change email
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-900">
                OTP
              </label>
              <div className="relative">
                <KeyRound
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  aria-hidden="true"
                />
                <div className="[&>input]:pl-10">
                  <Input {...register("otp")} placeholder="Enter 6-digit OTP" />
                </div>
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                OTPs can take a few seconds to arrive.
              </p>
            </div>

            <div className="pt-1">
              <Button type="submit">Verify</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

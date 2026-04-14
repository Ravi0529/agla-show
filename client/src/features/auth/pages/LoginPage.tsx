import { useForm } from "react-hook-form";
import { signin } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Clapperboard, Lock, Mail } from "lucide-react";

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    const res = await signin(data);
    login(res.data.token);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[60%] lg:py-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-red-700" />

            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
                    <Clapperboard className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-950">
                      Welcome back
                    </h2>
                    <p className="text-sm text-zinc-500">
                      Sign in to continue booking.
                    </p>
                  </div>
                </div>
              </div>
              <span className="hidden rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 sm:inline">
                Secure
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-900">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div className="[&>input]:pl-10">
                    <Input
                      {...register("email")}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-900">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div className="[&>input]:pl-10">
                    <Input
                      {...register("password")}
                      type="password"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Button type="submit">Login</Button>
              </div>
            </form>

            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-sm text-zinc-600">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-semibold text-red-700 hover:text-red-800"
                >
                  Create account
                </button>
              </p>
            </div>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-white to-red-50 p-8 shadow-sm lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-2xl font-semibold text-red-700">AglaShow</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  A cleaner way to book movie tickets.
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Modern UI, fast browsing, and a smooth checkout experience.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-red-100 bg-white/70 p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  Tip for best experience
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  Use a strong password and keep your session secure on shared
                  devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

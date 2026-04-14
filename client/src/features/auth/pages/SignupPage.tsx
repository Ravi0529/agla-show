import { useForm } from "react-hook-form";
import { signup } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import Input from "../../../shared/components/Input";
import Button from "../../../shared/components/Button";
import { Clapperboard, Lock, Mail, User } from "lucide-react";

export default function SignupPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    await signup(data);
    navigate("/verify-otp", { state: { email: data.email } });
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto w-full px-4 py-10 sm:px-6 lg:w-[60%] lg:py-14">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="hidden overflow-hidden rounded-2xl border border-zinc-200 bg-linear-to-br from-white via-white to-red-50 p-8 shadow-sm lg:block">
            <div className="flex h-full flex-col justify-between">
              <div>
                <p className="text-2xl font-semibold text-red-700">AglaShow</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Create your account.
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  Sign up once—verify with OTP—and start booking right away.
                </p>
              </div>

              <div className="mt-10 rounded-2xl border border-red-100 bg-white/70 p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  What happens next?
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  We’ll send an OTP to your email for verification.
                </p>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-8">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red-600 via-red-500 to-red-700" />

            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shadow-red-600/20">
                <Clapperboard className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-zinc-950">
                  Create account
                </h2>
                <p className="text-sm text-zinc-500">
                  Join to save your bookings and preferences.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-zinc-900">
                  Name
                </label>
                <div className="relative">
                  <User
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                    aria-hidden="true"
                  />
                  <div className="[&>input]:pl-10">
                    <Input {...register("name")} placeholder="Your name" />
                  </div>
                </div>
              </div>

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
                      placeholder="Create a password"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-1">
                <Button type="submit">Create Account</Button>
              </div>
            </form>

            <div className="mt-6">
              <p className="text-sm text-zinc-600">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="font-semibold text-red-700 hover:text-red-800"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

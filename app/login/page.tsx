"use client";

import { useActionState } from "react";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { loginAction } from "./actions";

const initialState = { error: undefined as string | undefined };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-brand-blue-900 px-4">
      {/* Subtle radial glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-blue-700/30 blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-brand-lime-400/8 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <BrandLogo variant="white" size="md" priority />
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_8px_48px_rgb(0_0_0/0.4)] backdrop-blur-sm">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-brand-cream-100">
              Admin sign in
            </h1>
            <p className="mt-1 text-sm text-brand-cream-100/50">
              Enter your credentials to access the dashboard
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {/* Error banner */}
            {state?.error && (
              <div className="flex items-center gap-2.5 rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <p className="text-sm text-red-300">{state.error}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-brand-cream-100/65"
              >
                Email address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream-100/35"
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@umiyatours.com"
                  className="w-full rounded-lg border border-white/12 bg-white/6 py-2.5 pl-9 pr-3.5 text-sm text-brand-cream-100 placeholder:text-brand-cream-100/25 outline-none transition-colors focus:border-brand-lime-400/60 focus:bg-white/8"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-brand-cream-100/65"
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-cream-100/35"
                />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/12 bg-white/6 py-2.5 pl-9 pr-10 text-sm text-brand-cream-100 placeholder:text-brand-cream-100/25 outline-none transition-colors focus:border-brand-lime-400/60 focus:bg-white/8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-cream-100/35 transition-colors hover:text-brand-cream-100/65"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="mt-1 flex w-full items-center justify-center rounded-lg bg-brand-lime-400 py-2.5 text-sm font-semibold text-brand-ink-900 transition-all hover:bg-brand-lime-400/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-brand-cream-100/30">
          Umiya Tours &amp; Travels · Admin Portal
        </p>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ArrowRight,
  LoaderCircle,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { ZodError } from "zod";
import { toast } from "sonner";

import useAuth from "@/src/hooks/admin/useAuth";
import { adminLoginSchema } from "@/src/validations/admin/auth.validation";

export default function AdminLogin() {
  const router = useRouter();

  const {
    login,
    isLoggingIn,
    error,
    clearError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setFieldErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    if (error) {
      clearError();
    }
  };

const handleSubmit = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (isLoggingIn) return;

  setFieldErrors({});
  clearError();

  try {
    const validatedData = adminLoginSchema.parse(formData);

    await login(validatedData);

    router.replace("/admin/dashboard");
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      const nextErrors: {
        email?: string;
        password?: string;
      } = {};

      for (const issue of err.issues) {
        const field = issue.path[0];

        if (
          (field === "email" || field === "password") &&
          !nextErrors[field]
        ) {
          nextErrors[field] = issue.message;
        }
      }

      setFieldErrors(nextErrors);
    }
  }
};

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <div className="flex min-h-screen w-full">
        {/* LEFT SIDE — BRANDING */}
        <div className="relative hidden overflow-hidden bg-[#2D1B12] lg:flex lg:w-[48%]">
          <Image
            src="/assets/images/home/home_lifestyle.jpg"
            alt="MARVE home collection"
            fill
            priority
            sizes="48vw"
            className="object-cover opacity-55"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#2D1B12]/95 via-[#2D1B12]/65 to-[#6B3E1E]/50" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Logo */}
            <div>
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={190}
                height={70}
                priority
                className="h-auto w-[145px] object-contain brightness-0 invert xl:w-[165px]"
              />
            </div>

            {/* Main Branding */}
            <div className="max-w-lg pb-10">
              <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur-sm">
                Admin Portal
              </span>

              <h1 className="text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-white xl:text-5xl">
                Manage your
                <span className="mt-1 block text-[#C98A50]">
                  MARVE store.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-white/65 xl:text-base">
                Access your admin dashboard to manage products, orders,
                customers and your MARVE store experience.
              </p>
            </div>

            {/* Bottom Text */}
            <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <p className="text-[11px] text-white/45">
                MARVE Admin Dashboard
              </p>

              <p className="text-[11px] text-white/45">
                © {new Date().getFullYear()} MARVE
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — LOGIN */}
        <div className="flex w-full items-center justify-center bg-[#F8F5F0] px-5 py-10 sm:px-8 lg:w-[52%] lg:px-12 xl:px-20">
          <div className="w-full max-w-[440px]">
            {/* Mobile Logo */}
            <div className="mb-10 flex justify-center lg:hidden">
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={180}
                height={65}
                priority
                className="h-auto w-[135px] object-contain"
              />
            </div>

            {/* Heading */}
            <div className="mb-8">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                Welcome Back
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-4xl">
                Admin Login
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#8A7D72]">
                Sign in to access your MARVE administration panel.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A0958C]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={isLoggingIn}
                    aria-invalid={Boolean(fieldErrors.email)}
                    aria-describedby={
                      fieldErrors.email ? "email-error" : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-[#29231F] outline-none transition-all placeholder:text-[#B2A79E] focus:ring-4 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-70 ${
                      fieldErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#6B3E1E]/12 focus:border-[#6B3E1E]/45"
                    }`}
                  />
                </div>

                {fieldErrors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-[#39312B]"
                  >
                    Password
                  </label>

                  <Link
                    href="/admin/forgot-password"
                    className="text-xs font-medium text-[#6B3E1E] transition-colors hover:text-[#A66A32]"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#A0958C]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={isLoggingIn}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password
                        ? "password-error"
                        : undefined
                    }
                    className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-[#29231F] outline-none transition-all placeholder:text-[#B2A79E] focus:ring-4 focus:ring-[#6B3E1E]/8 disabled:cursor-not-allowed disabled:opacity-70 ${
                      fieldErrors.password
                        ? "border-red-500 focus:border-red-500"
                        : "border-[#6B3E1E]/12 focus:border-[#6B3E1E]/45"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#8A7D72] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  >
                    {showPassword ? (
                      <EyeOff size={17} strokeWidth={1.7} />
                    ) : (
                      <Eye size={17} strokeWidth={1.7} />
                    )}
                  </button>
                </div>

                {fieldErrors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 text-xs text-red-600"
                  >
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.target.checked)
                    }
                    className="h-4 w-4 cursor-pointer rounded border-[#6B3E1E]/25 accent-[#6B3E1E]"
                  />

                  <span className="text-xs text-[#8A7D72]">
                    Remember me
                  </span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#A66A32] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoggingIn ? (
                  <>
                    <LoaderCircle size={17} className="animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={17}
                      strokeWidth={1.8}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Security Note */}
            <div className="mt-8 rounded-xl border border-[#6B3E1E]/8 bg-[#FFF9F2] px-4 py-3.5">
              <p className="text-center text-[11px] leading-5 text-[#8A7D72]">
                This area is restricted to authorized MARVE administrators.
              </p>
            </div>

            {/* Back to Store */}
            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-xs font-medium text-[#8A7D72] transition-colors hover:text-[#6B3E1E]"
              >
                ← Back to MARVE Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  X,
  Mail,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

import useAuth from "@/src/hooks/user/useAuth";
import { sendOtpSchema } from "@/src/validations/user/auth.validation";

interface LoginProps {
  onClose: () => void;
}

type LoginMethod = "PHONE" | "EMAIL";

export default function Login({ onClose }: LoginProps) {
  const [method, setMethod] = useState<LoginMethod>("PHONE");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [offers, setOffers] = useState(true);
  const [otp, setOtp] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const {
    error,
    isSendingOtp,
    isVerifyingOtp,
    sendOtp,
    verifyOtp,
    clearError,
  } = useAuth();

  const identifier =
    method === "PHONE" ? `+91${phone}` : email.trim().toLowerCase();

const isIdentifierValid =
  method === "PHONE"
    ? /^[6-9]\d{9}$/.test(phone)
    : sendOtpSchema.shape.identifier.safeParse(
        email.trim().toLowerCase()
      ).success;

      useEffect(() => {
  if (!otpStep || countdown <= 0) return;

  const timer = setTimeout(() => {
    setCountdown((prev) => Math.max(prev - 1, 0));
  }, 1000);

  return () => clearTimeout(timer);
}, [otpStep, countdown]);

const formattedCountdown = `00:${String(countdown).padStart(2, "0")}`;

  const handleMethodChange = (nextMethod: LoginMethod) => {
    setMethod(nextMethod);
    setOtp("");
    setOtpStep(false);
    setSuccessMessage("");
    clearError();
    setCountdown(0);
  };

const handleContinue = async (
  e: React.FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  clearError();
  setSuccessMessage("");

  const validation = sendOtpSchema.shape.identifier.safeParse(
    identifier
  );

  if (!validation.success) {
    toast.error(
      validation.error.issues[0]?.message ||
        "Please enter a valid email address or phone number."
    );
    return;
  }

  try {
    const response = await sendOtp({
      identifier: validation.data,
      offersOptIn: offers,
    });

    setOtp("");
    setCountdown(60);
    setOtpStep(true);

    setSuccessMessage(
      response.message || "OTP sent successfully."
    );
  } catch {
    // Error toast is handled by useAuth.
  }
};

const handleResendOtp = async () => {
  if (countdown > 0 || isResendingOtp || isSendingOtp) return;

  clearError();
  setSuccessMessage("");
  setIsResendingOtp(true);

  try {
    const response = await sendOtp({
      identifier,
      offersOptIn: offers,
    });

    // Restart timer only after the API succeeds.
    setOtp("");
    setCountdown(60);

    setSuccessMessage(
      response.message || "A new OTP has been sent successfully."
    );
  } catch {
    // Error message is handled by useAuth.
  } finally {
    setIsResendingOtp(false);
  }
};

  const handleVerifyOtp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (!/^\d{6}$/.test(otp)) return;

    try {
      await verifyOtp({
        identifier,
        otp,
      });

      setSuccessMessage("Login successful!");

      // Close the modal after successful authentication.
      onClose();
    } catch {
      // The useAuth hook provides the error message.
    }
  };

const handleBackToIdentifier = () => {
  setOtpStep(false);
  setOtp("");
  setCountdown(0);
  setSuccessMessage("");
  clearError();
};

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-[3px] sm:px-6 sm:py-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* ========================= Login Card ========================= */}

      <div className="relative flex max-h-[calc(100vh-32px)] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.28)] sm:max-h-[calc(100vh-48px)] sm:rounded-3xl lg:overflow-hidden">
        {/* Desktop Back */}

        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 z-30 hidden h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 lg:flex"
          aria-label="Close login"
        >
          <ArrowLeft size={18} strokeWidth={1.7} />
        </button>

        {/* Close */}

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 flex h-8 w-8 items-center justify-center rounded-full bg-black/5 text-[#6B3E1E] transition-colors hover:bg-black/10"
          aria-label="Close login"
        >
          <X size={17} strokeWidth={1.7} />
        </button>

        {/* ========================= LEFT SIDE ========================= */}

        <section className="relative hidden overflow-hidden bg-[#6B3E1E] px-10 py-12 text-white lg:flex lg:w-[48%] lg:flex-col lg:justify-center lg:px-12 lg:py-14">
          <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full border border-white/10" />
          <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute right-16 top-24 h-16 w-16 rounded-full border border-white/5" />

          <div className="relative z-10">
            <Link href="/" onClick={onClose} className="inline-block">
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={180}
                height={65}
                priority
                className="h-auto w-[135px] object-contain brightness-0 invert sm:w-[155px]"
              />
            </Link>

            <p className="mt-1 text-[8px] font-medium uppercase tracking-[0.38em] text-[#EAD8C5] sm:text-[9px]">
              Home & Kitchen
            </p>

            <div className="mt-9 sm:mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#EAD8C5]">
                Welcome to MARVE
              </p>

              <h1 className="mt-3 max-w-md text-3xl font-semibold leading-[1.15] tracking-[-0.03em] sm:text-4xl">
                Beautiful essentials,
                <br />
                made for everyday living.
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#F3E7DB]">
                Sign in to discover thoughtfully selected products for
                your kitchen, dining and home.
              </p>
            </div>

            <div className="mt-8 space-y-4 sm:mt-9">
              <Benefit
                icon={<Sparkles size={18} strokeWidth={1.5} />}
                title="Curated home essentials"
                description="Thoughtfully selected for modern homes."
              />

              <Benefit
                icon={<LockKeyhole size={18} strokeWidth={1.5} />}
                title="Safe & secure shopping"
                description="Your information stays private and protected."
              />

              <Benefit
                icon={<ShieldCheck size={18} strokeWidth={1.5} />}
                title="Exclusive member benefits"
                description="Get access to special offers and updates."
              />
            </div>
          </div>
        </section>

        {/* ========================= RIGHT SIDE ========================= */}

        <section className="flex min-h-[500px] flex-1 items-center bg-white px-6 py-10 sm:px-10 sm:py-12 lg:min-h-0 lg:px-14 lg:py-14">
          <div className="mx-auto w-full max-w-md">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
                My Account
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#29231F] sm:text-3xl">
                {otpStep ? "Verify your OTP" : "Login to MARVE"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
                {otpStep
                  ? `Enter the 6-digit OTP sent to ${identifier}.`
                  : "Continue with your mobile number or email address."}
              </p>
            </div>

            {!otpStep ? (
              <>
                {/* Login method selector */}

                <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-[#F8F5F0] p-1.5">
                  <button
                    type="button"
                    onClick={() => handleMethodChange("PHONE")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${
                      method === "PHONE"
                        ? "bg-white text-[#6B3E1E] shadow-sm"
                        : "text-[#8A7D72] hover:text-[#6B3E1E]"
                    }`}
                  >
                    <Smartphone size={16} />
                    Mobile Number
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMethodChange("EMAIL")}
                    className={`flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${
                      method === "EMAIL"
                        ? "bg-white text-[#6B3E1E] shadow-sm"
                        : "text-[#8A7D72] hover:text-[#6B3E1E]"
                    }`}
                  >
                    <Mail size={16} />
                    Email Address
                  </button>
                </div>

                <form onSubmit={handleContinue} className="mt-6">
                  <label
                    htmlFor={method === "PHONE" ? "phone" : "email"}
                    className="mb-2 block text-sm font-medium text-[#39312B]"
                  >
                    {method === "PHONE" ? "Mobile Number" : "Email Address"}
                  </label>

                  <div className="flex h-12 overflow-hidden rounded-lg border border-[#DED5CC] bg-white transition-all duration-200 focus-within:border-[#6B3E1E] focus-within:ring-2 focus-within:ring-[#6B3E1E]/10">
                    {method === "PHONE" ? (
                      <>
                        <div className="flex w-[68px] shrink-0 items-center justify-center border-r border-[#DED5CC] text-sm font-medium text-[#39312B]">
                          +91
                        </div>

                        <input
                          id="phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel-national"
                          maxLength={10}
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                          }
                          placeholder="Enter mobile number"
                          autoFocus
                          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#29231F] outline-none placeholder:text-[#A79C92]"
                        />
                      </>
                    ) : (
                      <>
                        <div className="flex w-12 shrink-0 items-center justify-center border-r border-[#DED5CC] text-[#8A7D72]">
                          <Mail size={17} strokeWidth={1.6} />
                        </div>

                        <input
                          id="email"
                          type="text"
                          inputMode="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          autoFocus
                          className="min-w-0 flex-1 bg-transparent px-4 text-sm text-[#29231F] outline-none placeholder:text-[#A79C92]"
                        />
                      </>
                    )}
                  </div>

                  {/* Offers */}

                  <label className="mt-5 flex cursor-pointer items-start gap-3">
                    <span className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        checked={offers}
                        onChange={(e) => setOffers(e.target.checked)}
                        className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                      />

                      <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border border-[#B9AEA4] bg-white transition-colors peer-checked:border-[#6B3E1E] peer-checked:bg-[#6B3E1E]">
                        <Check
                          size={11}
                          strokeWidth={2.5}
                          className="text-white opacity-0 transition-opacity peer-checked:opacity-100"
                        />
                      </span>
                    </span>

                    <span className="text-xs leading-5 text-[#756B63]">
                      Send me exclusive offers, new arrivals and updates
                      from MARVE.
                    </span>
                  </label>

                  {error && (
                    <p
                      role="alert"
                      className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!isIdentifierValid || isSendingOtp}
                    className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      "Sending OTP..."
                    ) : (
                      <>
                        Continue
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-7">
                <label
                  htmlFor="otp"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  6-Digit OTP
                </label>

                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                  className="h-12 w-full rounded-lg border border-[#DED5CC] bg-white px-4 text-center text-lg tracking-[0.4em] text-[#29231F] outline-none transition-all focus:border-[#6B3E1E] focus:ring-2 focus:ring-[#6B3E1E]/10"
                />
<div className="mt-3 flex items-center justify-between gap-3">
  <p className="text-xs text-[#8A7D72]">
    Didn&apos;t receive the code?
  </p>

  <div className="flex shrink-0 items-center gap-4">
    <span
      className={`text-xs font-semibold tabular-nums ${
        countdown > 0 ? "text-[#A66A32]" : "text-[#8A7D72]"
      }`}
      aria-live="off"
    >
      {formattedCountdown}
    </span>

    <button
      type="button"
      onClick={handleResendOtp}
      disabled={
        countdown > 0 ||
        isResendingOtp ||
        isSendingOtp
      }
      className="text-xs font-semibold text-[#6B3E1E] underline underline-offset-4 transition-colors hover:text-[#572F17] disabled:cursor-not-allowed disabled:text-[#B9AEA4] disabled:no-underline"
    >
      {isResendingOtp || isSendingOtp
        ? "Sending..."
        : "Resend OTP"}
    </button>
  </div>
</div>
                {successMessage && (
                  <p className="mt-3 text-xs leading-5 text-green-700">
                    {successMessage}
                  </p>
                )}

                {error && (
                  <p
                    role="alert"
                    className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs leading-5 text-red-700"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!/^\d{6}$/.test(otp) || isVerifyingOtp}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-lg bg-[#6B3E1E] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
                </button>

                <button
                  type="button"
                  onClick={handleBackToIdentifier}
                  className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-medium text-[#6B3E1E] hover:underline"
                >
                  <ArrowLeft size={15} />
                  Change mobile number or email
                </button>
              </form>
            )}

            {/* Terms */}

            <p className="mt-5 text-center text-[10px] leading-5 text-[#9A9088] sm:text-[11px]">
              By continuing, you agree to MARVE&apos;s{" "}
              <Link
                href="/privacy-policy"
                onClick={onClose}
                className="font-medium text-[#6B3E1E] hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/terms"
                onClick={onClose}
                className="font-medium text-[#6B3E1E] hover:underline"
              >
                Terms & Conditions
              </Link>
              .
            </p>

            {/* Bottom reassurance */}

            <div className="mt-7 flex items-center justify-center gap-2 border-t border-[#EEE8E2] pt-5 text-[10px] text-[#9A9088]">
              <LockKeyhole size={13} strokeWidth={1.5} />
              Secure & private login
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ========================= Benefit ========================= */

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FFF9F2] text-[#6B3E1E]">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <p className="mt-0.5 text-xs leading-5 text-[#EAD8C5]">
          {description}
        </p>
      </div>
    </div>
  );
}
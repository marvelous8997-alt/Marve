"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
  Banknote,
  LockKeyhole,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useBasket from "@/src/context/BasketContext";
import useOrder from "@/src/hooks/user/useOrder";
import RazorpayCheckout from "@/src/components/common/checkout/RazorpayCheckout";

interface CheckoutPaymentProps {
  onBack: () => void;
  onContinue: (paymentMethod: PaymentMethod) => void | Promise<void>;
  payableTotal: number;
  checkoutAddressId: number;
  customerName?: string;
  customerEmail?: string;
  customerContact?: string;
}

export type PaymentMethod = "ONLINE" | "COD";

const formatPrice = (amount: number) =>
  Number(amount ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const COD_CHARGE = 20;

export default function CheckoutPayment({
  onBack,
  onContinue,
  payableTotal,
  checkoutAddressId,
  customerName,
  customerEmail,
  customerContact,
}: CheckoutPaymentProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("ONLINE");
const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
const {
  items,
  clearBasket,
  coupon,
  payableTotal: basketPayableTotal,
} = useBasket();
const { createOrder } = useOrder();

const codCharge =
  paymentMethod === "COD" ? COD_CHARGE : 0;

const displayedTotal = payableTotal + codCharge;

const [createdOrder, setCreatedOrder] = useState<{
  id: number;
  orderNumber?: string;
  payableTotal: number;
} | null>(null);

const [orderCompleted, setOrderCompleted] = useState(false);
const [completedOrderTotal, setCompletedOrderTotal] =
  useState<number | null>(null);
const handleContinue = async () => {
  if (isProcessing) return;

  if (!checkoutAddressId) {
    toast.error("Please select a delivery address.");
    return;
  }

  if (!items.length) {
    toast.error("Your basket is empty.");
    return;
  }

  setIsProcessing(true);

  try {
const selectedGiftProductId =
  coupon?.type === "BOGO"
    ? coupon.selectedGiftProductId
    : null;

if (
  coupon?.type === "BOGO" &&
  (!selectedGiftProductId || selectedGiftProductId <= 0)
) {
  toast.error("Please select your BOGO gift before placing the order.");
  return;
}

const order = await createOrder({
  checkoutAddressId,
  paymentMethod,
  couponCode: coupon?.code ?? null,
  selectedGiftProductIds: selectedGiftProductId
    ? [Number(selectedGiftProductId)]
    : [],
  items: items
    .filter((item) => !item.isFreeGift)
    .map((item) => ({
      productId: Number(item.id),
      productVariationId: item.productVariationId ?? null,
      quantity: item.quantity,
    })),
});

if (!order) {
  return;
}

const backendTotal = Number(order.totalAmount);

if (!Number.isFinite(backendTotal) || backendTotal < 0) {
  throw new Error("The server returned an invalid order total.");
}

if (paymentMethod === "ONLINE") {
  setCreatedOrder({
    id: order.id,
    orderNumber: order.orderNumber,
    payableTotal: backendTotal,
  });

  return;
}

// COD: order creation successful hai.
await clearBasket();
setCompletedOrderTotal(Number(order.totalAmount));
setOrderCompleted(true);
toast.success("Your order has been placed successfully!");

await onContinue("COD");
  } catch (error) {
    console.error("Checkout payment error:", error);
    toast.error("Unable to place your order. Please try again.");
  } finally {
    setIsProcessing(false);
  }
};

if (orderCompleted) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F1E7DA] text-[#6B3E1E]">
          <CheckCircle2 size={34} />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-[#39312B]">
          Order Placed Successfully!
        </h2>

        {createdOrder?.orderNumber && (
          <p className="mt-2 text-sm text-[#8A7D72]">
            Order number: {createdOrder.orderNumber}
          </p>
        )}

<p className="mt-2 text-sm text-[#8A7D72]">
  {paymentMethod === "COD"
    ? `Pay ₹${formatPrice(completedOrderTotal ?? payableTotal)} when your order is delivered.`
    : `Payment received: ₹${formatPrice(completedOrderTotal ?? payableTotal)}.`}
</p>

<button
  type="button"
  onClick={() => {
    router.push("/common/profile?section=orders");
  }}
  className="mt-6 h-12 w-full rounded-lg bg-[#6B3E1E] font-semibold text-white transition hover:bg-[#572F17]"
>
  View My Orders
</button>
      </div>
    </div>
  );
}

if (createdOrder && paymentMethod === "ONLINE") {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/55 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={() => setCreatedOrder(null)}
          className="mb-5 flex items-center gap-2 text-sm text-[#6B3E1E]"
        >
          <ArrowLeft size={17} />
          Back to payment methods
        </button>

        <h2 className="mb-2 text-xl font-semibold text-[#39312B]">
          Complete Your Payment
        </h2>

        <p className="mb-5 text-sm text-[#8A7D72]">
          Order {createdOrder.orderNumber ?? `#${createdOrder.id}`}
        </p>

        <RazorpayCheckout
          orderId={createdOrder.id}
          amount={createdOrder.payableTotal}
          customerName={customerName}
          customerEmail={customerEmail}
          customerContact={customerContact}
          onSuccess={async () => {
            try {
              setCompletedOrderTotal(createdOrder.payableTotal);
              await clearBasket();
              setOrderCompleted(true);
              setCreatedOrder(null);
              toast.success("Payment verified successfully!");
              await onContinue("ONLINE");
            } catch (error) {
              console.error("Post-payment cleanup error:", error);
              toast.error(
                "Payment was verified, but the basket could not be cleared. Please check your order before retrying.",
              );
            }
          }}
          onFailure={(message) => {
            toast.error(message || "Payment failed. You can try again.");
          }}
        />
      </div>
    </div>
  );
}

  return (
    
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/55 backdrop-blur-[3px] sm:items-center sm:px-5 sm:py-6">
      <div className="relative flex max-h-[96dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:max-h-[calc(100dvh-48px)] sm:rounded-2xl lg:max-w-[760px]">

        {/* Header */}

        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#EEE5DC] px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to delivery address"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#39312B] transition hover:bg-[#F8F5F0]"
            >
              <ArrowLeft size={19} strokeWidth={1.6} />
            </button>

            <div>
              <h1 className="text-sm font-semibold text-[#39312B] sm:text-base">
                Payment
              </h1>
              <p className="text-[10px] text-[#8A7D72]">
                Secure checkout
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="hidden text-[10px] text-[#8A7D72] sm:block">
              Payable amount
            </p>
            <p className="text-sm font-semibold text-[#39312B]">
              ₹{formatPrice(displayedTotal)}
            </p>
          </div>
        </header>

        {/* Title */}

        <div className="shrink-0 border-b border-[#EEE5DC] px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-[#39312B] sm:text-lg">
            Choose Payment Method
          </h2>
          <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
            Select how you would like to pay for your MARVE order.
          </p>
        </div>

        {/* Security strip */}

        <div className="flex min-h-8 shrink-0 items-center justify-center gap-2 bg-[#A66A32] px-4 py-1.5">
          <ShieldCheck size={14} className="text-white" />
          <p className="text-center text-[10px] font-medium text-white sm:text-xs">
            Your payment details are handled securely
          </p>
        </div>

        {/* Scrollable content */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          <div className="space-y-5">

            {/* Online payment */}

            <button
              type="button"
              aria-pressed={paymentMethod === "ONLINE"}
              onClick={() => setPaymentMethod("ONLINE")}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                paymentMethod === "ONLINE"
                  ? "border-[#A66A32] bg-[#FFFAF4] ring-1 ring-[#A66A32]/20"
                  : "border-[#E6DED7] bg-white hover:border-[#D9C7B5]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  paymentMethod === "ONLINE"
                    ? "bg-[#EAD8C5] text-[#6B3E1E]"
                    : "bg-[#F8F5F0] text-[#8A7D72]"
                }`}>
                  <CreditCard size={22} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#39312B]">
                        Online Payment
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                        Pay securely online using available payment options.
                      </p>
                    </div>

                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      paymentMethod === "ONLINE"
                        ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                        : "border-[#D9C7B5]"
                    }`}>
                      {paymentMethod === "ONLINE" && (
                        <Check size={12} strokeWidth={2.5} />
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <PaymentTag icon={<Smartphone size={13} />} label="UPI" />
                    <PaymentTag icon={<CreditCard size={13} />} label="Debit / Credit Card" />
                    <PaymentTag icon={<Wallet size={13} />} label="Net Banking / Wallet" />
                  </div>
                </div>
              </div>
            </button>

            {/* COD */}

            <button
              type="button"
              aria-pressed={paymentMethod === "COD"}
              onClick={() => setPaymentMethod("COD")}
              className={`w-full rounded-xl border p-4 text-left transition-all duration-200 ${
                paymentMethod === "COD"
                  ? "border-[#A66A32] bg-[#FFFAF4] ring-1 ring-[#A66A32]/20"
                  : "border-[#E6DED7] bg-white hover:border-[#D9C7B5]"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                  paymentMethod === "COD"
                    ? "bg-[#EAD8C5] text-[#6B3E1E]"
                    : "bg-[#F8F5F0] text-[#8A7D72]"
                }`}>
                  <Banknote size={22} strokeWidth={1.7} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-[#39312B]">
                        Cash on Delivery
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                        Pay when your order is delivered to your address.
                      </p>
                    </div>

                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      paymentMethod === "COD"
                        ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                        : "border-[#D9C7B5]"
                    }`}>
                      {paymentMethod === "COD" && (
                        <Check size={12} strokeWidth={2.5} />
                      )}
                    </span>
                  </div>

{paymentMethod === "COD" && (
  <div className="mt-3 rounded-lg border border-[#E6DED7] bg-white p-3">
    <div className="flex items-start gap-2">
      <Truck
        size={16}
        className="mt-0.5 shrink-0 text-[#A66A32]"
      />

      <p className="text-[11px] leading-5 text-[#756B63]">
        Please keep the payable amount ready when your order arrives.
        COD availability will be confirmed before the order is placed.
      </p>
    </div>

    <div className="mt-3 flex items-center justify-between border-t border-[#EEE5DC] pt-3">
      <span className="text-xs text-[#8A7D72]">
        COD Charge
      </span>

      <span className="text-sm font-semibold text-[#6B3E1E]">
        ₹20.00
      </span>
    </div>
  </div>
)}
                </div>
              </div>
            </button>

            {/* Order total */}

            <section className="rounded-xl border border-[#EEE5DC] bg-[#FCFAF7] p-4">
              <div className="mb-3 flex items-center gap-2">
                <Wallet size={17} className="text-[#A66A32]" />
                <h3 className="text-sm font-semibold text-[#39312B]">
                  Order Total
                </h3>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-[#8A7D72]">
                  Total payable
                </span>
                <span className="text-lg font-semibold text-[#4B371C]">
                  ₹{formatPrice(displayedTotal)}
                </span>
              </div>

              <p className="mt-2 text-[10px] leading-5 text-[#8A7D72]">
                Final charges will be verified when your order is placed.
              </p>
            </section>

            {/* Security note */}

            <div className="flex items-start gap-2.5 rounded-lg border border-[#EEE5DC] bg-white px-3 py-3">
              <LockKeyhole
                size={17}
                strokeWidth={1.6}
                className="mt-0.5 shrink-0 text-[#A66A32]"
              />
              <p className="text-[11px] leading-5 text-[#8A7D72]">
                MARVE will only confirm an online payment after the payment
                provider verifies the transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky footer */}

        <footer className="shrink-0 border-t border-[#EEE5DC] bg-white px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] sm:px-6 sm:py-4">
          <button
            type="button"
            onClick={handleContinue}
            disabled={isProcessing}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#6B3E1E] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[#A66A32] focus:ring-offset-2"
          >
            {paymentMethod === "ONLINE" ? (
              <CreditCard size={16} strokeWidth={1.8} />
            ) : (
              <CheckCircle2 size={16} strokeWidth={1.8} />
            )}

            {paymentMethod === "ONLINE"
              ? "Continue to Pay"
              : "Continue with COD"}

            <ChevronRight size={17} strokeWidth={1.8} />
          </button>

          <p className="mt-2 text-center text-[10px] text-[#A0958C]">
            Your order total: ₹{formatPrice(displayedTotal)}
          </p>
        </footer>
      </div>
    </div>
  );
}

/* ========================= Payment Tag ========================= */

function PaymentTag({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-[#EEE5DC] bg-white px-2 py-1.5 text-[10px] font-medium text-[#756B63]">
      {icon}
      {label}
    </span>
  );
}
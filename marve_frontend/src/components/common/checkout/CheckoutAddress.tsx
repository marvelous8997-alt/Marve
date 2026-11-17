"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import useCheckoutAddress from "@/src/hooks/user/useCheckoutAddress";
import type {
  CheckoutAddress,
  CheckoutAddressType,
} from "@/src/types/user/checkout-address.types";

import CheckoutPayment from "@/src/components/common/checkout/CheckoutPayment";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  Crosshair,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  UsersRound,
  BriefcaseBusiness,
  X,
  Building2,
  Navigation,
  Plus,
  Pencil,
  Loader2,
} from "lucide-react";

interface CheckoutAddressProps {
  onClose: () => void;
  payableTotal: number;
  originalTotal: number;
  productDiscount: number;
  couponDiscount: number;
}

type AddressType = CheckoutAddressType;

const inputClassName =
  "h-[48px] w-full rounded-lg border border-[#E6DED7] bg-white px-3 text-sm text-[#39312B] outline-none transition placeholder:text-[#AAA19A] focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/10";

const labelClassName = "mb-1.5 block text-xs font-medium text-[#65574B]";

const emptyForm = {
  pincode: "",
  houseNumber: "",
  address: "",
  locality: "",
  landmark: "",
  city: "",
  state: "",
  phone: "",
  fullName: "",
  email: "",
};

export default function CheckoutAddress({
  onClose,
  payableTotal,
  originalTotal,
  productDiscount,
  couponDiscount,
}: CheckoutAddressProps) {
  const [addressType, setAddressType] = useState<AddressType>("HOME");

  const [selectedLocation, setSelectedLocation] = useState(false);

  const [form, setForm] = useState(emptyForm);

  const {
    addresses,
    isLoading,
    isSubmitting,
    error,
    fetchCheckoutAddresses,
    createCheckoutAddress,
    updateCheckoutAddress,
    clearError,
  } = useCheckoutAddress();

  const [editingAddressId, setEditingAddressId] = useState<number | null>(
    null
  );

  const [isDefault, setIsDefault] = useState(false);

  const [showPayment, setShowPayment] = useState(false);

  const [savedCheckoutAddress, setSavedCheckoutAddress] =
    useState<CheckoutAddress | null>(null);

  const [selectedAddressId, setSelectedAddressId] =
    useState<number | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(false);

  /* ========================= Fetch Addresses ========================= */

  useEffect(() => {
    fetchCheckoutAddresses();
  }, [fetchCheckoutAddresses]);

  useEffect(() => {
    if (isLoading) return;

    // First-time customer: no saved address
    if (addresses.length === 0) {
      setShowAddressForm(true);
      setSelectedAddressId(null);
      setSavedCheckoutAddress(null);
      return;
    }

    // Returning customer: show saved addresses
    setShowAddressForm(false);

    // Automatically select default address or first address
    if (selectedAddressId === null) {
      const defaultAddress =
        addresses.find((address) => address.isDefault) || addresses[0];

      setSelectedAddressId(defaultAddress.id);
      setSavedCheckoutAddress(defaultAddress);
    }
  }, [addresses, isLoading, selectedAddressId]);

  /* ========================= Form Helpers ========================= */

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /* ========================= Add Address ========================= */

  const handleAddAddress = () => {
    setEditingAddressId(null);
    setForm({ ...emptyForm });
    setAddressType("HOME");
    setIsDefault(false);
    setSelectedLocation(false);

    clearError();
    setShowAddressForm(true);
  };

  /* ========================= Edit Address ========================= */

  const handleEditAddress = (address: CheckoutAddress) => {
    setEditingAddressId(address.id);

    setForm({
      pincode: address.pincode || "",
      houseNumber: address.houseNumber || "",
      address: address.address || "",
      locality: address.locality || "",
      landmark: address.landmark || "",
      city: address.city || "",
      state: address.state || "",
      phone: address.phone || "",
      fullName: address.fullName || "",
      email: address.email || "",
    });

    setAddressType(address.addressType);
    setIsDefault(address.isDefault);
    setSelectedLocation(false);

    clearError();
    setShowAddressForm(true);
  };

  /* ========================= Select Address ========================= */

  const handleSelectAddress = (address: CheckoutAddress) => {
    setSelectedAddressId(address.id);
    setSavedCheckoutAddress(address);
  };

  /* ========================= Save Address ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    clearError();

    const payload = {
      fullName: form.fullName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      pincode: form.pincode.trim(),
      houseNumber: form.houseNumber.trim(),
      address: form.address.trim(),
      locality: form.locality.trim(),
      landmark: form.landmark.trim() || null,
      city: form.city.trim(),
      state: form.state.trim(),
      addressType,
      isDefault,
    };

    let savedAddress: CheckoutAddress | null = null;

    if (editingAddressId !== null) {
      savedAddress = await updateCheckoutAddress(
        editingAddressId,
        payload
      );
    } else {
      savedAddress = await createCheckoutAddress(payload);
    }

    if (!savedAddress) return;

    // Select the newly saved address
    setSelectedAddressId(savedAddress.id);
    setSavedCheckoutAddress(savedAddress);

    // Return to saved address list instead of opening payment
    setEditingAddressId(null);
    setShowAddressForm(false);

    // Refresh the saved address list
    await fetchCheckoutAddresses();
  };

  /* ========================= Proceed to Payment ========================= */

  const handleProceedToPayment = () => {
    const selectedAddress = addresses.find(
      (address) => address.id === selectedAddressId
    );

    const addressToUse = selectedAddress || savedCheckoutAddress;

    if (!addressToUse) return;

    setSavedCheckoutAddress(addressToUse);
    setShowPayment(true);
  };

  /* ========================= Address Type Label ========================= */

  const getAddressTypeLabel = (type: AddressType) => {
    switch (type) {
      case "HOME":
        return "Home";
      case "FRIENDS":
        return "Friends";
      case "WORK":
        return "Work";
      default:
        return "Other";
    }
  };

  const getAddressTypeIcon = (type: AddressType) => {
    switch (type) {
      case "HOME":
        return <Home size={15} />;
      case "FRIENDS":
        return <UsersRound size={15} />;
      case "WORK":
        return <BriefcaseBusiness size={15} />;
      default:
        return <MapPin size={15} />;
    }
  };

  /* ========================= Payment Screen ========================= */

  if (showPayment && savedCheckoutAddress) {
    return (
      <CheckoutPayment
        onBack={() => setShowPayment(false)}
        onContinue={(method) => {
          console.log("Selected payment method:", method);
        }}
        payableTotal={payableTotal}
        checkoutAddressId={savedCheckoutAddress.id}
        customerName={savedCheckoutAddress.fullName}
        customerEmail={savedCheckoutAddress.email ?? ""}
        customerContact={savedCheckoutAddress.phone}
      />
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/55 backdrop-blur-[3px] sm:items-center sm:px-5 sm:py-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="relative flex max-h-[96dvh] w-full max-w-[680px] flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_25px_80px_rgba(0,0,0,0.25)] sm:max-h-[calc(100dvh-48px)] sm:rounded-2xl lg:max-w-[760px]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* ========================= Header ========================= */}

        <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#EEE5DC] bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (showAddressForm && addresses.length > 0) {
                  setShowAddressForm(false);
                  setEditingAddressId(null);
                  clearError();
                } else {
                  onClose();
                }
              }}
              aria-label="Go back"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#39312B] transition hover:bg-[#F8F5F0]"
            >
              <ArrowLeft size={19} strokeWidth={1.6} />
            </button>

            <Link href="/" onClick={onClose} className="block">
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={130}
                height={48}
                priority
                className="h-auto w-[105px] object-contain sm:w-[115px]"
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right">
              <p className="hidden text-[10px] text-[#8A7D72] sm:block">
                Payable amount
              </p>
              <p className="text-xs font-semibold text-[#39312B] sm:text-sm">
                ₹
                {Number(payableTotal ?? 0).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#756B63] transition hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
            >
              <X size={19} strokeWidth={1.6} />
            </button>
          </div>
        </header>

        {/* ========================= Title ========================= */}

        <div className="shrink-0 border-b border-[#EEE5DC] px-5 py-4 sm:px-6">
          <h1 className="text-base font-semibold text-[#39312B] sm:text-lg">
            Delivery Address
          </h1>
          <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
            {showAddressForm
              ? "Add your delivery details for your MARVE order."
              : "Choose where you would like us to deliver your order."}
          </p>
        </div>

        {/* ========================= Info Strip ========================= */}

        <div className="flex min-h-8 shrink-0 items-center justify-center gap-2 bg-[#A66A32] px-4 py-1.5">
          <ShieldCheck size={13} className="text-white" />
          <p className="text-center text-[10px] font-medium text-white sm:text-xs">
            Your delivery details are handled securely
          </p>
        </div>

        {/* ========================= Scrollable Content ========================= */}

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6">
          {isLoading ? (
            <div className="flex min-h-[250px] flex-col items-center justify-center gap-3">
              <Loader2 size={28} className="animate-spin text-[#A66A32]" />
              <p className="text-sm text-[#8A7D72]">
                Loading your saved addresses...
              </p>
            </div>
          ) : !showAddressForm ? (
            /* ========================= Saved Address List ========================= */

            <div className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-[#39312B]">
                    Select Delivery Address
                  </h2>
                  <p className="mt-1 text-xs text-[#8A7D72]">
                    Choose one of your saved addresses.
                  </p>
                </div>

                <span className="rounded-full bg-[#F8F5F0] px-3 py-1 text-[11px] font-semibold text-[#6B3E1E]">
                  {addresses.length}{" "}
                  {addresses.length === 1 ? "Address" : "Addresses"}
                </span>
              </div>

              <div className="space-y-3">
                {addresses.map((address) => {
                  const isSelected = selectedAddressId === address.id;

                  return (
                    <div
                      key={address.id}
                      onClick={() => handleSelectAddress(address)}
                      className={`cursor-pointer rounded-xl border p-4 transition-all ${
                        isSelected
                          ? "border-[#A66A32] bg-[#FFFBF6] shadow-[0_0_0_1px_rgba(166,106,50,0.12)]"
                          : "border-[#E6DED7] bg-white hover:border-[#D9C7B5]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#6B3E1E] bg-[#6B3E1E] text-white"
                              : "border-[#D9C7B5] bg-white"
                          }`}
                        >
                          {isSelected && <Check size={13} />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-[#39312B]">
                              {address.fullName}
                            </h3>

                            {address.isDefault && (
                              <span className="rounded-full bg-[#F3E9DD] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#6B3E1E]">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs font-medium text-[#65574B]">
                            +91 {address.phone}
                          </p>

                          <p className="mt-2 text-xs leading-5 text-[#756B63]">
                            {address.houseNumber}, {address.address},{" "}
                            {address.locality}
                            {address.landmark
                              ? `, ${address.landmark}`
                              : ""}
                            , {address.city}, {address.state} -{" "}
                            {address.pincode}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EEE5DC] bg-white px-2.5 py-1 text-[10px] font-medium text-[#6B3E1E]">
                              {getAddressTypeIcon(address.addressType)}
                              {getAddressTypeLabel(address.addressType)}
                            </span>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEditAddress(address);
                              }}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A66A32] transition hover:text-[#6B3E1E]"
                            >
                              <Pencil size={13} />
                              Edit Address
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Different Address */}

              <button
                type="button"
                onClick={handleAddAddress}
                className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#C9B49F] bg-[#FCFAF7] px-4 text-sm font-semibold text-[#6B3E1E] transition hover:border-[#A66A32] hover:bg-[#FFF9F2]"
              >
                <Plus size={18} />
                Add Different Address
              </button>
            </div>
          ) : (
            /* ========================= Existing Address Form ========================= */

            <form
              id="checkout-address-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddressId(null);
                    clearError();
                  }}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#6B3E1E] hover:text-[#A66A32]"
                >
                  <ArrowLeft size={15} />
                  Back to Saved Addresses
                </button>
              )}

              {/* Location selector */}

              <section>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[#39312B]">
                      Choose Delivery Location
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-[#8A7D72]">
                      Search for your area or select a location on the map.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-[#F8F5F0] px-2.5 py-1 text-[10px] font-medium text-[#6B3E1E]">
                    Step 1
                  </span>
                </div>

                <div className="relative mb-3">
                  <Search
                    size={17}
                    strokeWidth={1.7}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                  />

                  <input
                    type="text"
                    placeholder="Search area, street or landmark"
                    aria-label="Search delivery location"
                    className={`${inputClassName} pl-10 pr-3`}
                  />
                </div>

                {/* Map preview */}

                <div className="relative overflow-hidden rounded-xl border border-[#E6DED7]">
                  <div
                    className="relative flex h-[190px] flex-col items-center justify-center overflow-hidden bg-[#F1EEE8] px-5 text-center sm:h-[225px]"
                    style={{
                      backgroundImage:
                        "linear-gradient(30deg, transparent 48%, rgba(255,255,255,0.85) 49%, rgba(255,255,255,0.85) 52%, transparent 53%), linear-gradient(120deg, transparent 43%, rgba(255,255,255,0.8) 44%, rgba(255,255,255,0.8) 47%, transparent 48%), linear-gradient(0deg, transparent 48%, rgba(214,205,190,0.45) 49%, rgba(214,205,190,0.45) 51%, transparent 52%)",
                      backgroundSize: "110px 100px, 140px 120px, 100% 65px",
                    }}
                  >
                    <div className="absolute left-[12%] top-[18%] h-10 w-10 rounded-full bg-[#DCE6D3]/80" />
                    <div className="absolute bottom-[16%] right-[13%] h-14 w-14 rounded-full bg-[#DCE6D3]/80" />
                    <div className="absolute right-[20%] top-[16%] h-7 w-7 rounded-full bg-[#E7D8C8]/80" />
                    <div className="absolute bottom-[20%] left-[22%] h-8 w-12 rounded-lg bg-[#E7D8C8]/70" />

                    <div className="relative z-10 flex flex-col items-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#D9C7B5] bg-white text-[#6B3E1E] shadow-md">
                        <MapPin size={25} strokeWidth={1.8} />
                      </div>

                      <p className="text-sm font-semibold text-[#4B371C]">
                        Select your delivery location
                      </p>

                      <p className="mt-1 max-w-[270px] text-[11px] leading-5 text-[#756B63]">
                        Google Maps will be connected here.
                      </p>
                    </div>

                    <span className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[9px] text-[#8A7D72]">
                      Map preview
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedLocation(true)}
                    className="flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-[#E6DED7] bg-white px-3 py-2 text-xs font-semibold text-[#6B3E1E] transition hover:bg-[#FCFAF7]"
                  >
                    <Crosshair size={15} strokeWidth={1.8} />
                    Use Current Location
                  </button>
                </div>

                {selectedLocation && (
                  <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#D9C7B5] bg-[#FCFAF7] p-3">
                    <Navigation
                      size={16}
                      className="mt-0.5 shrink-0 text-[#A66A32]"
                    />
                    <div>
                      <p className="text-xs font-semibold text-[#6B3E1E]">
                        Location selection UI
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-[#8A7D72]">
                        Current-location detection will be enabled when the
                        map integration is added.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* Address details */}

              <section>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-[#39312B]">
                      Address Details
                    </h2>
                    <p className="mt-1 text-xs text-[#8A7D72]">
                      Add the complete address for accurate delivery.
                    </p>
                  </div>

                  <Building2
                    size={19}
                    strokeWidth={1.5}
                    className="text-[#A66A32]"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="pincode">
                      Pincode *
                    </label>
                    <input
                      id="pincode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="postal-code"
                      maxLength={6}
                      required
                      value={form.pincode}
                      onChange={(event) =>
                        updateField(
                          "pincode",
                          event.target.value.replace(/\D/g, "").slice(0, 6)
                        )
                      }
                      placeholder="6-digit pincode"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="houseNumber">
                      House / Flat / Building *
                    </label>
                    <input
                      id="houseNumber"
                      autoComplete="address-line2"
                      required
                      value={form.houseNumber}
                      onChange={(event) =>
                        updateField("houseNumber", event.target.value)
                      }
                      placeholder="Flat, house or building"
                      className={inputClassName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClassName} htmlFor="address">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      autoComplete="address-line1"
                      required
                      value={form.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      placeholder="Street, road or main address"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="locality">
                      Locality / Area *
                    </label>
                    <input
                      id="locality"
                      autoComplete="address-level3"
                      required
                      value={form.locality}
                      onChange={(event) =>
                        updateField("locality", event.target.value)
                      }
                      placeholder="Area or locality"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="landmark">
                      Landmark
                      <span className="ml-1 font-normal text-[#A0958C]">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="landmark"
                      value={form.landmark}
                      onChange={(event) =>
                        updateField("landmark", event.target.value)
                      }
                      placeholder="Nearby landmark"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="city">
                      City *
                    </label>
                    <input
                      id="city"
                      autoComplete="address-level2"
                      required
                      value={form.city}
                      onChange={(event) =>
                        updateField("city", event.target.value)
                      }
                      placeholder="Enter city"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="state">
                      State *
                    </label>
                    <div className="relative">
                      <select
                        id="state"
                        autoComplete="address-level1"
                        required
                        value={form.state}
                        onChange={(event) =>
                          updateField("state", event.target.value)
                        }
                        className={`${inputClassName} appearance-none pr-10 ${
                          form.state ? "" : "text-[#AAA19A]"
                        }`}
                      >
                        <option value="" disabled>
                          Choose state
                        </option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                        <option value="Ladakh">Ladakh</option>
                        <option value="Puducherry">Puducherry</option>
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A7D72]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact details */}

              <section>
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-[#39312B]">
                    Contact Details
                  </h2>
                  <p className="mt-1 text-xs text-[#8A7D72]">
                    Who should receive this order?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClassName} htmlFor="fullName">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      autoComplete="name"
                      required
                      value={form.fullName}
                      onChange={(event) =>
                        updateField("fullName", event.target.value)
                      }
                      placeholder="Recipient's full name"
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label className={labelClassName} htmlFor="phone">
                      Phone Number *
                    </label>
                    <div className="flex h-[48px] items-center overflow-hidden rounded-lg border border-[#E6DED7] transition focus-within:border-[#A66A32] focus-within:ring-2 focus-within:ring-[#A66A32]/10">
                      <span className="flex h-full shrink-0 items-center gap-1.5 border-r border-[#E6DED7] bg-[#FCFAF7] px-3 text-xs text-[#39312B]">
                        🇮🇳 +91
                      </span>
                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={10}
                        required
                        value={form.phone}
                        onChange={(event) =>
                          updateField(
                            "phone",
                            event.target.value.replace(/\D/g, "").slice(0, 10)
                          )
                        }
                        placeholder="10-digit mobile"
                        className="h-full min-w-0 flex-1 bg-white px-3 text-sm text-[#39312B] outline-none placeholder:text-[#AAA19A]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className={labelClassName} htmlFor="email">
                      Email Address
                      <span className="ml-1 font-normal text-[#A0958C]">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField("email", event.target.value)
                      }
                      placeholder="you@example.com"
                      className={inputClassName}
                    />
                  </div>
                </div>
              </section>

              {/* Save address as */}

              <section>
                <h2 className="mb-1 text-sm font-semibold text-[#39312B]">
                  Save Address As
                </h2>
                <p className="mb-3 text-xs text-[#8A7D72]">
                  Choose a label to identify this address later.
                </p>

                <div className="flex flex-wrap gap-2">
                  <AddressTypeButton
                    label="Home"
                    active={addressType === "HOME"}
                    onClick={() => setAddressType("HOME")}
                    icon={<Home size={14} strokeWidth={1.7} />}
                  />

                  <AddressTypeButton
                    label="Friends"
                    active={addressType === "FRIENDS"}
                    onClick={() => setAddressType("FRIENDS")}
                    icon={<UsersRound size={14} strokeWidth={1.7} />}
                  />

                  <AddressTypeButton
                    label="Work"
                    active={addressType === "WORK"}
                    onClick={() => setAddressType("WORK")}
                    icon={<BriefcaseBusiness size={14} strokeWidth={1.7} />}
                  />

                  <AddressTypeButton
                    label="Other"
                    active={addressType === "OTHER"}
                    onClick={() => setAddressType("OTHER")}
                    icon={<MapPin size={14} strokeWidth={1.7} />}
                  />
                </div>

                <label className="mt-4 flex cursor-pointer items-center gap-2 text-xs text-[#65574B]">
                  <input
                    type="checkbox"
                    checked={isDefault}
                    onChange={(event) => setIsDefault(event.target.checked)}
                    className="h-4 w-4 accent-[#6B3E1E]"
                  />
                  Save as my default delivery address
                </label>
              </section>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
                >
                  {error}
                </div>
              )}

              {/* Security note */}

              <div className="flex items-start gap-2.5 rounded-lg border border-[#EEE5DC] bg-[#FCFAF7] px-3 py-3">
                <ShieldCheck
                  size={17}
                  strokeWidth={1.6}
                  className="mt-0.5 shrink-0 text-[#A66A32]"
                />

                <p className="text-[11px] leading-5 text-[#8A7D72]">
                  Your address details are intended only for delivery and
                  order communication. Please verify your address before
                  continuing.
                </p>
              </div>
            </form>
          )}
        </div>

        {/* ========================= Sticky Footer ========================= */}

        <footer className="shrink-0 border-t border-[#EEE5DC] bg-white px-3 py-3 sm:px-4">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-[#39312B]">
                Estimated Total
              </span>
              <ChevronDown size={16} className="text-[#00856A]" />
            </div>

            <div className="flex items-center gap-1.5 whitespace-nowrap">
              <span className="text-lg font-bold text-[#111111]">
                ₹
                {Number(payableTotal ?? 0).toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </span>

              {Number(originalTotal) > Number(payableTotal) &&
                Number(originalTotal) > 0 && (
                  <>
                    <span className="text-xs text-[#8A7D72] line-through">
                      ₹
                      {Number(originalTotal).toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>

                    <span className="text-xs font-semibold text-[#00856A]">
                      (
                      {Math.round(
                        ((Number(originalTotal) - Number(payableTotal)) /
                          Number(originalTotal)) *
                          100
                      )}
                      % OFF)
                    </span>
                  </>
                )}
            </div>
          </div>

          {showAddressForm ? (
            /* Save Address Button */

            <button
              type="submit"
              form="checkout-address-form"
              disabled={isSubmitting}
              className="flex h-[56px] w-full items-center justify-center gap-2 rounded-xl bg-[#6B3E1E] px-4 text-white transition hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-60 sm:px-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving Address...
                </>
              ) : (
                <>
                  <span className="text-sm font-semibold sm:text-base">
                    {editingAddressId !== null
                      ? "Update Address"
                      : "Save Address"}
                  </span>
                  <Check size={18} />
                </>
              )}
            </button>
          ) : (
            /* Proceed to Continue Button */

            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={!selectedAddressId || addresses.length === 0}
              className="flex h-[56px] w-full items-center justify-between rounded-xl bg-[#6B3E1E] px-4 text-white transition hover:bg-[#572F17] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
            >
              <span className="flex items-center gap-2 text-sm font-semibold sm:text-base">
                Proceed to Continue
                <span aria-hidden="true" className="text-xl leading-none">
                  →
                </span>
              </span>

              <span className="flex shrink-0 items-center -space-x-1.5">
                <PaymentLogo
                  src="/assets/images/payments/upi.png"
                  alt="UPI"
                />
                <PaymentLogo
                  src="/assets/images/payments/phonepay.png"
                  alt="PhonePe"
                />
                <PaymentLogo
                  src="/assets/images/payments/paytm.png"
                  alt="Paytm"
                />
                <PaymentLogo
                  src="/assets/images/payments/gpay.png"
                  alt="Google Pay"
                />
              </span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}

/* ========================= Payment Logo ========================= */

function PaymentLogo({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-[#EEE5DC] bg-white p-1 shadow-sm">
      <Image
        src={src}
        alt={alt}
        width={24}
        height={24}
        className="h-full w-full object-contain"
      />
    </span>
  );
}

/* ========================= Address Type Button ========================= */

function AddressTypeButton({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-9 items-center gap-2 rounded-full border px-3.5 text-xs font-medium transition-all duration-200 ${
        active
          ? "border-[#A66A32] bg-[#FFF9F2] text-[#6B3E1E] shadow-sm"
          : "border-[#EEE5DC] bg-white text-[#756B63] hover:border-[#D9C7B5] hover:text-[#6B3E1E]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Check,
  House,
  BriefcaseBusiness,
  MapPinned,
  Loader2,
  Users,
  RefreshCw,
} from "lucide-react";

import useCheckoutAddress from "@/src/hooks/user/useCheckoutAddress";

import type {
  CheckoutAddress,
  CheckoutAddressType,
  CreateCheckoutAddressRequest,
  UpdateCheckoutAddressRequest,
} from "@/src/types/user/checkout-address.types";

/* =========================
   Types
========================= */

type AddressFormData = {
  fullName: string;
  phone: string;
  email: string;
  pincode: string;
  houseNumber: string;
  address: string;
  locality: string;
  landmark: string;
  city: string;
  state: string;
  addressType: CheckoutAddressType;
  isDefault: boolean;
};

const emptyForm: AddressFormData = {
  fullName: "",
  phone: "",
  email: "",
  pincode: "",
  houseNumber: "",
  address: "",
  locality: "",
  landmark: "",
  city: "",
  state: "",
  addressType: "HOME",
  isDefault: false,
};

const addressTypes = [
  { value: "HOME", label: "Home", icon: House },
  { value: "FRIENDS", label: "Friends", icon: Users },
  { value: "WORK", label: "Work", icon: BriefcaseBusiness },
  { value: "OTHER", label: "Other", icon: MapPinned },
] as const;

/* =========================
   Component
========================= */

export default function MyAddresses() {
  const {
    addresses,
    isLoading,
    isSubmitting,
    isDeleting,
    isSettingDefault,
    error,
    fetchCheckoutAddresses,
    createCheckoutAddress,
    updateCheckoutAddress,
    deleteCheckoutAddress,
    setDefaultCheckoutAddress,
    refreshCheckoutAddresses,
  } = useCheckoutAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] =
    useState<CheckoutAddress | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(emptyForm);
  const [deleteAddressId, setDeleteAddressId] = useState<number | null>(null);
  const [isSavingDefault, setIsSavingDefault] = useState<number | null>(null);

  /* =========================
     Fetch Addresses
  ========================= */

  useEffect(() => {
    void fetchCheckoutAddresses(true);
  }, [fetchCheckoutAddresses]);

  /* =========================
     Open Add Form
  ========================= */

  const openAddForm = () => {
    setEditingAddress(null);

    setFormData({
      ...emptyForm,
      isDefault: addresses.length === 0,
    });

    setFormOpen(true);
  };

  /* =========================
     Open Edit Form
  ========================= */

  const openEditForm = (address: CheckoutAddress) => {
    setEditingAddress(address);

    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      email: address.email ?? "",
      pincode: address.pincode,
      houseNumber: address.houseNumber,
      address: address.address,
      locality: address.locality,
      landmark: address.landmark ?? "",
      city: address.city,
      state: address.state,
      addressType: address.addressType,
      isDefault: address.isDefault,
    });

    setFormOpen(true);
  };

  /* =========================
     Close Form
  ========================= */

  const closeForm = () => {
    if (isSubmitting) return;

    setFormOpen(false);
    setEditingAddress(null);
    setFormData({ ...emptyForm });
  };

  /* =========================
     Update Form Field
  ========================= */

  const updateField = <K extends keyof AddressFormData>(
    field: K,
    value: AddressFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =========================
     Submit Address
  ========================= */

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const cleanedData: AddressFormData = {
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      pincode: formData.pincode.trim(),
      houseNumber: formData.houseNumber.trim(),
      address: formData.address.trim(),
      locality: formData.locality.trim(),
      landmark: formData.landmark.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
    };

    if (editingAddress) {
      const payload: UpdateCheckoutAddressRequest = {
        fullName: cleanedData.fullName,
        phone: cleanedData.phone,
        email: cleanedData.email || null,
        pincode: cleanedData.pincode,
        houseNumber: cleanedData.houseNumber,
        address: cleanedData.address,
        locality: cleanedData.locality,
        landmark: cleanedData.landmark || null,
        city: cleanedData.city,
        state: cleanedData.state,
        addressType: cleanedData.addressType,
        isDefault: cleanedData.isDefault,
      };

      const result = await updateCheckoutAddress(
        editingAddress.id,
        payload
      );

      if (result) {
        closeForm();
      }

      return;
    }

    const payload: CreateCheckoutAddressRequest = {
      ...cleanedData,
      email: cleanedData.email || null,
      landmark: cleanedData.landmark || null,
    };

    const result = await createCheckoutAddress(payload);

    if (result) {
      closeForm();
    }
  };

  /* =========================
     Delete Address
  ========================= */

  const handleDelete = async (addressId: number) => {
    const result = await deleteCheckoutAddress(addressId);

    if (result) {
      setDeleteAddressId(null);
    }
  };

  /* =========================
     Set Default Address
  ========================= */

  const handleSetDefault = async (addressId: number) => {
    setIsSavingDefault(addressId);

    try {
      await setDefaultCheckoutAddress(addressId);
    } finally {
      setIsSavingDefault(null);
    }
  };

  /* =========================
     Address Icon
  ========================= */

  const getAddressIcon = (type: CheckoutAddressType) => {
    switch (type) {
      case "HOME":
        return House;

      case "FRIENDS":
        return Users;

      case "WORK":
        return BriefcaseBusiness;

      default:
        return MapPinned;
    }
  };

  /* =========================
     Address Type Label
  ========================= */

  const getAddressTypeLabel = (type: CheckoutAddressType) => {
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

  /* =========================
     Render
  ========================= */

  return (
    <section className="overflow-hidden rounded-2xl border border-[#EAE3DC] bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#EEE8E2] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A66A32]">
            Delivery information
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#39312B]">
            My Addresses
          </h2>

          <p className="mt-1 text-sm text-[#8A7D72]">
            Manage your saved shipping addresses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void refreshCheckoutAddresses()}
            disabled={isLoading}
            aria-label="Refresh addresses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#EAE3DC] px-3 py-3 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isLoading ? "animate-spin" : ""}
            />
          </button>

          {!formOpen && (
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-[#6B3E1E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#543017] sm:self-auto"
            >
              <Plus size={17} />
              Add New Address
            </button>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Loading */}
        {isLoading && addresses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14">
            <Loader2
              size={30}
              className="animate-spin text-[#A66A32]"
            />

            <p className="mt-3 text-sm text-[#8A7D72]">
              Loading your saved addresses...
            </p>
          </div>
        )}

        {/* Error */}
        {error && addresses.length === 0 && !isLoading && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-8 text-center">
            <p className="text-sm text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => void fetchCheckoutAddresses(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017]"
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* Address Form */}
        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 rounded-2xl border border-[#E5D5C5] bg-[#FDFBF8] p-4 sm:p-6"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-[#39312B]">
                  {editingAddress ? "Edit Address" : "Add New Address"}
                </h3>

                <p className="mt-1 text-xs text-[#8A7D72]">
                  Enter your complete delivery details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={isSubmitting}
                aria-label="Close address form"
                className="rounded-lg p-2 text-[#665B53] transition hover:bg-[#F1E7DC] disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            {/* Address Type */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-medium text-[#39312B]">
                Address Type
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {addressTypes.map((type) => {
                  const Icon = type.icon;
                  const selected = formData.addressType === type.value;

                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() =>
                        updateField("addressType", type.value)
                      }
                      className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm transition ${
                        selected
                          ? "border-[#A66A32] bg-[#F5EADF] font-medium text-[#6B3E1E]"
                          : "border-[#EAE3DC] bg-white text-[#665B53] hover:bg-[#F8F5F0]"
                      }`}
                    >
                      <Icon size={16} />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="address-full-name"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Full Name *
                </label>

                <input
                  id="address-full-name"
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="Enter full name"
                  autoComplete="name"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-phone"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Phone Number *
                </label>

                <input
                  id="address-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  placeholder="Enter 10-digit phone number"
                  autoComplete="tel"
                  inputMode="numeric"
                  required
                  maxLength={10}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address-email"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Email Address
                  <span className="ml-1 font-normal text-[#A0958C]">
                    (Optional)
                  </span>
                </label>

                <input
                  id="address-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  placeholder="Enter email address"
                  autoComplete="email"
                  maxLength={191}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-house-number"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  House / Flat Number *
                </label>

                <input
                  id="address-house-number"
                  value={formData.houseNumber}
                  onChange={(event) =>
                    updateField("houseNumber", event.target.value)
                  }
                  placeholder="House / Flat number"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-pincode"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  PIN Code *
                </label>

                <input
                  id="address-pincode"
                  value={formData.pincode}
                  onChange={(event) =>
                    updateField(
                      "pincode",
                      event.target.value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  placeholder="Enter 6-digit PIN code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address-line"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Complete Address *
                </label>

                <textarea
                  id="address-line"
                  value={formData.address}
                  onChange={(event) =>
                    updateField("address", event.target.value)
                  }
                  placeholder="Building, street, road, etc."
                  required
                  maxLength={255}
                  rows={2}
                  className="w-full resize-none rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-locality"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Locality / Area *
                </label>

                <input
                  id="address-locality"
                  value={formData.locality}
                  onChange={(event) =>
                    updateField("locality", event.target.value)
                  }
                  placeholder="Enter locality or area"
                  required
                  maxLength={150}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-landmark"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  Landmark
                  <span className="ml-1 font-normal text-[#A0958C]">
                    (Optional)
                  </span>
                </label>

                <input
                  id="address-landmark"
                  value={formData.landmark}
                  onChange={(event) =>
                    updateField("landmark", event.target.value)
                  }
                  placeholder="Nearby landmark"
                  maxLength={150}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-city"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  City *
                </label>

                <input
                  id="address-city"
                  value={formData.city}
                  onChange={(event) =>
                    updateField("city", event.target.value)
                  }
                  placeholder="Enter city"
                  autoComplete="address-level2"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="address-state"
                  className="mb-2 block text-sm font-medium text-[#39312B]"
                >
                  State *
                </label>

                <input
                  id="address-state"
                  value={formData.state}
                  onChange={(event) =>
                    updateField("state", event.target.value)
                  }
                  placeholder="Enter state"
                  autoComplete="address-level1"
                  required
                  maxLength={100}
                  className="w-full rounded-xl border border-[#EAE3DC] bg-white px-4 py-3 text-sm text-[#39312B] outline-none focus:border-[#A66A32] focus:ring-2 focus:ring-[#A66A32]/15"
                />
              </div>
            </div>

            {/* Default Address */}
            <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm text-[#665B53]">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(event) =>
                  updateField("isDefault", event.target.checked)
                }
                className="h-4 w-4 accent-[#6B3E1E]"
              />
              Set as default delivery address
            </label>

            {/* Form Actions */}
            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#EEE8E2] pt-5">
              <button
                type="button"
                onClick={closeForm}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl border border-[#EAE3DC] px-4 py-2.5 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0] disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#543017] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}

                {isSubmitting
                  ? "Saving..."
                  : editingAddress
                    ? "Update Address"
                    : "Save Address"}
              </button>
            </div>
          </form>
        )}

        {/* Saved Addresses */}
        {!isLoading || addresses.length > 0 ? (
          addresses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              {addresses.map((address) => {
                const Icon = getAddressIcon(address.addressType);

                return (
                  <article
                    key={address.id}
                    className={`rounded-xl border p-4 sm:p-5 ${
                      address.isDefault
                        ? "border-[#D8B99C] bg-[#FDFBF8]"
                        : "border-[#EEE8E2] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F5EADF] text-[#6B3E1E]">
                          <Icon size={19} strokeWidth={1.7} />
                        </div>

                        <div>
                          <h3 className="text-sm font-semibold text-[#39312B]">
                            {getAddressTypeLabel(address.addressType)}
                          </h3>

                          <p className="mt-0.5 text-xs text-[#8A7D72]">
                            {address.fullName}
                          </p>
                        </div>
                      </div>

                      {address.isDefault && (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#EBDCCD] px-2.5 py-1 text-[10px] font-semibold text-[#6B3E1E]">
                          <Check size={12} />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="mt-4 border-t border-[#EEE8E2] pt-4">
                      <p className="text-sm leading-6 text-[#665B53]">
                        {address.houseNumber}
                        <br />
                        {address.address}
                        <br />
                        {address.locality}
                        {address.landmark && (
                          <>
                            <br />
                            Near {address.landmark}
                          </>
                        )}
                        <br />
                        {address.city}, {address.state} - {address.pincode}
                      </p>

                      <p className="mt-3 text-xs text-[#8A7D72]">
                        Phone: {address.phone}
                      </p>

                      {address.email && (
                        <p className="mt-1 text-xs text-[#8A7D72]">
                          Email: {address.email}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#EEE8E2] pt-4">
                      {!address.isDefault && (
                        <button
                          type="button"
                          onClick={() => void handleSetDefault(address.id)}
                          disabled={
                            isSettingDefault || isSavingDefault !== null
                          }
                          className="rounded-lg px-3 py-2 text-xs font-medium text-[#6B3E1E] transition hover:bg-[#F5EADF] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isSavingDefault === address.id ? (
                            <span className="inline-flex items-center gap-1.5">
                              <Loader2 size={13} className="animate-spin" />
                              Updating...
                            </span>
                          ) : (
                            "Set as Default"
                          )}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => openEditForm(address)}
                        className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-[#EAE3DC] px-3 py-2 text-xs font-medium text-[#665B53] transition hover:bg-[#F8F5F0]"
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteAddressId(address.id)}
                        disabled={isDeleting}
                        aria-label={`Delete address for ${address.fullName}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            !formOpen && (
              <div className="rounded-xl border border-dashed border-[#DCCBBC] px-5 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F5F0] text-[#A66A32]">
                  <MapPin size={27} strokeWidth={1.5} />
                </div>

                <h3 className="mt-4 text-base font-semibold text-[#39312B]">
                  No saved addresses
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#8A7D72]">
                  Add your delivery address to make your next MARVE checkout
                  easier.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6B3E1E] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#543017]"
                >
                  <Plus size={17} />
                  Add Your First Address
                </button>
              </div>
            )
          )
        ) : null}
      </div>

      {/* Delete Confirmation */}
      {deleteAddressId !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !isDeleting && setDeleteAddressId(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-address-title"
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h3
              id="delete-address-title"
              className="mt-4 text-lg font-semibold text-[#39312B]"
            >
              Delete this address?
            </h3>

            <p className="mt-2 text-sm leading-6 text-[#8A7D72]">
              Are you sure you want to delete this saved address? This action
              cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteAddressId(null)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-[#EAE3DC] px-4 py-3 text-sm font-medium text-[#665B53] transition hover:bg-[#F8F5F0] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => void handleDelete(deleteAddressId)}
                disabled={isDeleting}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting && (
                  <Loader2 size={15} className="animate-spin" />
                )}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

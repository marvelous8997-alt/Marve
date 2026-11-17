
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";

import useAuth from "@/src/hooks/user/useAuth";
import useOffer from "@/src/hooks/user/useOffer";
import { getUser } from "@/src/utils/storage";

import ProfileSidebar from "@/src/components/common/profile/ProfileSidebar";
import ProfileWelcome from "@/src/components/common/profile/ProfileWelcome";
import ProfileSectionSelect from "@/src/components/common/profile/ProfileSectionSelect";

import MyProfile from "@/src/components/common/profile/sections/MyProfile";
import MyOrders from "@/src/components/common/profile/sections/MyOrders";
import MyAddresses from "@/src/components/common/profile/sections/MyAddresses";
import MyWishlist from "@/src/components/common/profile/sections/MyWishlist";
import MyOffers from "@/src/components/common/profile/sections/MyOffers";
import ProfileSettings from "@/src/components/common/profile/sections/ProfileSettings";

type ProfileSection =
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "offers"
  | "settings";

interface Customer {
  id?: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  offersOptIn?: boolean;
  [key: string]: unknown;
}

export default function ProfilePage() {
  const router = useRouter();

  const { user, logout, isAuthReady } = useAuth();

  // Offers hook
  const {
    offers,
    isLoading: isOffersLoading,
    error: offersError,
    fetchOffers,
  } = useOffer();

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [activeSection, setActiveSection] =
    useState<ProfileSection>("profile");

  const [offersOptIn, setOffersOptIn] = useState(false);

  /* ========================= URL SECTION ========================= */

  useEffect(() => {
    const section = new URLSearchParams(
      window.location.search
    ).get("section");

    if (
      section === "orders" ||
      section === "addresses" ||
      section === "wishlist" ||
      section === "offers" ||
      section === "settings" ||
      section === "profile"
    ) {
      setActiveSection(section);
    }
  }, []);

  /* ========================= CUSTOMER DATA ========================= */

  useEffect(() => {
    if (!isAuthReady) return;

    const savedUser = user ?? getUser();

    if (!savedUser) {
      router.replace("/");
      return;
    }

    const currentUser: Customer = {
      ...savedUser,
      firstName: savedUser.firstName ?? "",
      lastName: savedUser.lastName ?? "",
      email: savedUser.email ?? "",
      phone: savedUser.phone ?? "",
    };

    setCustomer(currentUser);
    setOffersOptIn(currentUser.offersOptIn ?? false);
  }, [isAuthReady, user, router]);

  /* ========================= LOGOUT ========================= */

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  /* ========================= LOADING STATE ========================= */

  if (!isAuthReady || !customer) {
    return (
      <>
        <Navbar />

        <main className="flex min-h-screen items-center justify-center bg-[#F8F5F0]">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E5D5C5] border-t-[#6B3E1E]" />

            <p className="mt-4 text-sm text-[#8A7D72]">
              Loading your profile...
            </p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  /* ========================= CUSTOMER NAME ========================= */

  const fullName =
    [customer.firstName, customer.lastName]
      .filter(Boolean)
      .join(" ") ||
    customer.name ||
    "MARVE Customer";

  /* ========================= MAIN COMPONENT ========================= */

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

          <ProfileWelcome fullName={fullName} />

          {/* Mobile Section Navigation */}

          <div className="mt-6 lg:hidden">
            <ProfileSectionSelect
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </div>

          <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">

            {/* Sidebar */}

            <ProfileSidebar
              fullName={fullName}
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              handleLogout={handleLogout}
            />

            {/* Active Section */}

            <div className="min-w-0">

              {activeSection === "profile" && <MyProfile />}

              {activeSection === "orders" && <MyOrders />}

              {activeSection === "addresses" && <MyAddresses />}

              {activeSection === "wishlist" && <MyWishlist />}

              {activeSection === "offers" && (
                <MyOffers
                  offers={offers}
                  isLoading={isOffersLoading}
                  error={offersError}
                  onRetry={() => void fetchOffers()}
                  offersOptIn={offersOptIn}
                  onOffersOptInChange={setOffersOptIn}
                />
              )}

              {activeSection === "settings" && (
                <ProfileSettings
                  promotionalNotifications={offersOptIn}
                  onNotificationChange={(setting, enabled) => {
                    if (setting === "promotions") {
                      setOffersOptIn(enabled);
                    }
                  }}
                  onLogout={handleLogout}
                />
              )}

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

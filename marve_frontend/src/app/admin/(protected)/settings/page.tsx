"use client";

import { useMemo, useState } from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import SettingHeader from "@/src/components/admin/setting/SettingHeader";

import SettingTabs, {
  SettingTab,
} from "@/src/components/admin/setting/SettingTabs";

import SettingSkeleton from "@/src/components/admin/setting/SettingSkeleton";

import ProfileSettings, {
  ProfileSettingsData,
} from "@/src/components/admin/setting/ProfileSettings";

import SecuritySettings, {
  SecuritySettingsData,
} from "@/src/components/admin/setting/SecuritySettings";

import NotificationSettings, {
  NotificationSettingsData,
} from "@/src/components/admin/setting/NotificationSettings";

import StoreSettings, {
  StoreSettingsData,
} from "@/src/components/admin/setting/StoreSettings";

import PreferenceSettings, {
  PreferenceSettingsData,
} from "@/src/components/admin/setting/PreferenceSettings";

/* =========================================================
   Types
========================================================= */

interface AdminSettings {
  profile: ProfileSettingsData;
  security: SecuritySettingsData;
  notifications: NotificationSettingsData;
  store: StoreSettingsData;
  preferences: PreferenceSettingsData;
}

/* =========================================================
   Demo Settings Data
========================================================= */

const INITIAL_SETTINGS: AdminSettings = {
  /* =======================================================
     Profile
  ======================================================= */

    profile: {
    firstName: "MARVE",
    lastName: "Admin",
    email: "admin@marve.com",
    phone: "+91 00000 00000",
    profileImage: "",
    profileImageFile: null,
    role: "SUPER ADMIN",
    },

  /* =======================================================
     Security
  ======================================================= */

  security: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },

  /* =======================================================
     Notifications
  ======================================================= */

  notifications: {
    newOrders: true,
    newCustomers: true,
    newInquiries: true,
    lowStockAlerts: true,
    offerUpdates: false,

    emailNotifications: true,
    browserNotifications: true,
  },

  /* =======================================================
     Store
  ======================================================= */

  store: {
    storeName: "MARVE",
    storeEmail: "support@marve.com",
    storePhone: "",
    storeDescription:
      "A modern home and kitchen store offering thoughtfully selected products for everyday living.",

    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",

    currency: "INR",
    timezone: "Asia/Kolkata",

    storeOpen: true,
    maintenanceMode: false,
  },

  /* =======================================================
     Preferences
  ======================================================= */

  preferences: {
    productsPerPage: "12",
    defaultProductView: "GRID",

    showOutOfStockProducts: true,
    showProductRatings: true,

    allowGuestCheckout: true,
    allowOrderCancellation: true,
    requireOrderConfirmation: false,

    enableWishlist: true,
    enableProductReviews: true,
    enableProductComparison: false,

    compactTableView: false,
    confirmBeforeDelete: true,
  },
};

/* =========================================================
   Page
========================================================= */

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<AdminSettings>(INITIAL_SETTINGS);

  const [activeTab, setActiveTab] =
    useState<SettingTab>("PROFILE");

  const [isLoading, setIsLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =======================================================
     Refresh
  ======================================================= */

  const handleRefresh = async () => {
    setIsLoading(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    /*
      Later API call:

      const response = await fetch(
        "/api/admin/settings",
      );

      const data = await response.json();

      setSettings(data);
    */

    setIsLoading(false);
  };

  /* =======================================================
     Tab Change
  ======================================================= */

  const handleTabChange = (
    tab: SettingTab,
  ) => {
    setActiveTab(tab);
  };

  /* =======================================================
     Profile Update
  ======================================================= */

  const handleProfileSubmit = async (
    data: ProfileSettingsData,
  ) => {
    setIsSubmitting(true);

    try {
      /*
        Later API integration:

        await fetch(
          "/api/admin/settings/profile",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      setSettings((current) => ({
        ...current,
        profile: data,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Security Update
  ======================================================= */

  const handleSecuritySubmit = async (
    data: SecuritySettingsData,
  ) => {
    setIsSubmitting(true);

    try {
      /*
        Later API integration:

        await fetch(
          "/api/admin/settings/security",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      /*
        Password fields should normally
        NOT be stored in local page state
        after successful API submission.
      */

      setSettings((current) => ({
        ...current,
        security: {
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Notification Update
  ======================================================= */

  const handleNotificationSubmit = async (
    data: NotificationSettingsData,
  ) => {
    setIsSubmitting(true);

    try {
      /*
        Later API integration:

        await fetch(
          "/api/admin/settings/notifications",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      setSettings((current) => ({
        ...current,
        notifications: data,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Store Update
  ======================================================= */

  const handleStoreSubmit = async (
    data: StoreSettingsData,
  ) => {
    setIsSubmitting(true);

    try {
      /*
        Later API integration:

        await fetch(
          "/api/admin/settings/store",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      setSettings((current) => ({
        ...current,
        store: data,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Preference Update
  ======================================================= */

  const handlePreferenceSubmit = async (
    data: PreferenceSettingsData,
  ) => {
    setIsSubmitting(true);

    try {
      /*
        Later API integration:

        await fetch(
          "/api/admin/settings/preferences",
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(data),
          },
        );
      */

      await new Promise((resolve) =>
        setTimeout(resolve, 800),
      );

      setSettings((current) => ({
        ...current,
        preferences: data,
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =======================================================
     Cancel
  ======================================================= */

  const handleCancel = () => {
    /*
      Forms are controlled by their own
      internal state.

      Later, if needed, we can reset the
      active form back to the saved API data.
    */
  };

  /* =======================================================
     Render
  ======================================================= */

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      <AdminNavbar />

      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1600px]">
          {/* =================================================
              Header
          ================================================= */}

          <SettingHeader
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* =================================================
              Main Content
          ================================================= */}

          <div className="mt-6">
            {isLoading ? (
              <SettingSkeleton />
            ) : (
              <div className="space-y-5">
                {/* ===========================================
                    Tabs
                =========================================== */}

                <SettingTabs
                  activeTab={activeTab}
                  onChange={handleTabChange}
                />

                {/* ===========================================
                    Profile Settings
                =========================================== */}

                {activeTab === "PROFILE" && (
                  <ProfileSettings
                    key="profile-settings"
                    profile={settings.profile}
                    onSubmit={handleProfileSubmit}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    />
                )}

                {/* ===========================================
                    Security Settings
                =========================================== */}

                {activeTab === "SECURITY" && (
                  <SecuritySettings
                    key="security-settings"
                    onSubmit={handleSecuritySubmit}
                    onCancel={handleCancel}
                    isSubmitting={
                      isSubmitting
                    }
                  />
                )}

                {/* ===========================================
                    Notification Settings
                =========================================== */}

                {activeTab ===
                  "NOTIFICATIONS" && (
                  <NotificationSettings
                    key="notification-settings"
                    settings={
                      settings.notifications
                    }
                    onSubmit={
                      handleNotificationSubmit
                    }
                    onCancel={handleCancel}
                    isSubmitting={
                      isSubmitting
                    }
                  />
                )}

                {/* ===========================================
                    Store Settings
                =========================================== */}

                {activeTab === "STORE" && (
                  <StoreSettings
                    key="store-settings"
                    settings={settings.store}
                    onSubmit={
                      handleStoreSubmit
                    }
                    onCancel={handleCancel}
                    isSubmitting={
                      isSubmitting
                    }
                  />
                )}

                {/* ===========================================
                    Preference Settings
                =========================================== */}

                {activeTab ===
                  "PREFERENCES" && (
                  <PreferenceSettings
                    key="preference-settings"
                    settings={
                      settings.preferences
                    }
                    onSubmit={
                      handlePreferenceSubmit
                    }
                    onCancel={handleCancel}
                    isSubmitting={
                      isSubmitting
                    }
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
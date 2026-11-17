"use client";

import { useEffect, useMemo, useState } from "react";

import AdminNavbar from "@/src/components/admin/AdminNavbar";

import BannerHeader from "@/src/components/admin/banner/BannerHeader";

import BannerTabs, {
  BannerTab,
} from "@/src/components/admin/banner/BannerTabs";

import HomeHeroBannerForm, {
  HomeHeroBannerFormData,
} from "@/src/components/admin/banner/HomeHeroBannerForm";

import HomeCouponBannerForm, {
  HomeCouponBannerFormData,
} from "@/src/components/admin/banner/HomeCouponBannerForm";

import NewArrivalsHeroBannerForm, {
  NewArrivalsHeroBannerFormData,
} from "@/src/components/admin/banner/NewArrivalsHeroBannerForm";

import BestSellersHeroBannerForm, {
  BestSellersHeroBannerFormData,
} from "@/src/components/admin/banner/BestSellersHeroBannerForm";

import HomeEssentialsHeroBannerForm, {
  HomeEssentialsHeroBannerFormData,
} from "@/src/components/admin/banner/HomeEssentialsHeroBannerForm";

import KitchenEssentialsHeroBannerForm, {
  KitchenEssentialsHeroBannerFormData,
} from "@/src/components/admin/banner/KitchenEssentialsHeroBannerForm";

import BannerSkeleton from "@/src/components/admin/banner/BannerSkeleton";
import useHomeHeroBanner from "@/src/hooks/admin/useHomeHeroBanner";
import useHomeCouponBanner from "@/src/hooks/admin/useHomeCouponBanner";
import useNewArrivalsHeroBanner from "@/src/hooks/admin/useNewArrivalsHeroBanner";
import useBestSellersHeroBanner from "@/src/hooks/admin/useBestSellersHeroBanner";
import useHomeEssentialsHeroBanner from "@/src/hooks/admin/useHomeEssentialsHeroBanner";
import useKitchenEssentialsHeroBanner from "@/src/hooks/admin/useKitchenEssentialsHeroBanner";

/* =========================================================
   Types
========================================================= */

interface HomeHeroBanner extends HomeHeroBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface HomeCouponBanner extends HomeCouponBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface NewArrivalsHeroBanner
  extends NewArrivalsHeroBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface BestSellersHeroBanner
  extends BestSellersHeroBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface HomeEssentialsHeroBanner
  extends HomeEssentialsHeroBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

interface KitchenEssentialsHeroBanner
  extends KitchenEssentialsHeroBannerFormData {
  id: number | string;
  createdAt?: string;
  updatedAt?: string;
}

type Banner =
  | HomeHeroBanner
  | HomeCouponBanner
  | NewArrivalsHeroBanner
  | BestSellersHeroBanner
  | HomeEssentialsHeroBanner
  | KitchenEssentialsHeroBanner;

/* =========================================================
   Helpers
========================================================= */

const getBannerByType = (
  banners: Banner[],
  type: BannerTab,
): Banner | null => {
  return (
    banners.find(
      (banner) => banner.type === type,
    ) ?? null
  );
};

/* =========================================================
   Page
========================================================= */

export default function BannersPage() {
  const {
  banner: homeHeroBanner,
  isLoading: isHomeHeroLoading,
  isSubmitting: isHomeHeroSubmitting,
  error: homeHeroError,
  fetchHomeHeroBanner,
  saveHomeHeroBanner,
} = useHomeHeroBanner();
const [banners, setBanners] = useState<Banner[]>([]);

const {
  banner: homeCouponBanner,
  isLoading: isHomeCouponLoading,
  isSubmitting: isHomeCouponSubmitting,
  error: homeCouponError,
  fetchHomeCouponBanner,
  saveHomeCouponBanner,
} = useHomeCouponBanner();

const {
  banner: newArrivalsHeroBanner,
  isLoading: isNewArrivalsHeroLoading,
  isSubmitting: isNewArrivalsHeroSubmitting,
  fetchNewArrivalsHeroBanner,
  saveNewArrivalsHeroBanner,
} = useNewArrivalsHeroBanner();

const {
  banner: bestSellersHeroBanner,
  isLoading: isBestSellersHeroLoading,
  isSubmitting: isBestSellersHeroSubmitting,
  fetchBestSellersHeroBanner,
  saveBestSellersHeroBanner,
} = useBestSellersHeroBanner();

const {
  banner: homeEssentialsHeroBanner,
  isLoading: isHomeEssentialsHeroLoading,
  isSubmitting: isHomeEssentialsHeroSubmitting,
  fetchHomeEssentialsHeroBanner,
  saveHomeEssentialsHeroBanner,
} = useHomeEssentialsHeroBanner();

const {
  banner: kitchenEssentialsHeroBanner,
  isLoading: isKitchenEssentialsHeroLoading,
  isSubmitting: isKitchenEssentialsHeroSubmitting,
  fetchKitchenEssentialsHeroBanner,
  saveKitchenEssentialsHeroBanner,
} = useKitchenEssentialsHeroBanner();

const [activeTab, setActiveTab] =
  useState<BannerTab>("HOME_HERO");

const [isLoading, setIsLoading] =
  useState(false);

useEffect(() => {
  void fetchHomeHeroBanner().catch(() => undefined);
  void fetchHomeCouponBanner().catch(() => undefined);
  void fetchNewArrivalsHeroBanner().catch(() => undefined);
  void fetchBestSellersHeroBanner().catch(() => undefined);
  void fetchHomeEssentialsHeroBanner().catch(() => undefined);
  void fetchKitchenEssentialsHeroBanner().catch(() => undefined);
}, [
  fetchHomeHeroBanner,
  fetchHomeCouponBanner,
  fetchNewArrivalsHeroBanner,
  fetchBestSellersHeroBanner,
  fetchHomeEssentialsHeroBanner,
  fetchKitchenEssentialsHeroBanner,
]);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* =======================================================
     Active Banner
  ======================================================= */

  const activeBanner = useMemo(() => {
    return getBannerByType(
      banners,
      activeTab,
    );
  }, [banners, activeTab]);

  /* =======================================================
     Counts
  ======================================================= */

  const bannerCounts = useMemo(() => {
    return {
      homeHero: banners.filter(
        (banner) =>
          banner.type === "HOME_HERO",
      ).length,

      homeCoupon: banners.filter(
        (banner) =>
          banner.type === "HOME_COUPON",
      ).length,

      newArrivalsHero:
  banners.filter(
    (banner) => banner.type === "NEW_ARRIVALS_HERO",
  ).length +
  (newArrivalsHeroBanner ? 1 : 0),

      bestSellersHero: banners.filter(
        (banner) =>
          banner.type ===
          "BEST_SELLERS_HERO",
      ).length,

      homeEssentialsHero: banners.filter(
        (banner) =>
          banner.type ===
          "HOME_ESSENTIALS_HERO",
      ).length,

kitchenEssentialsHero:
  banners.filter(
    (banner) => banner.type === "KITCHEN_ESSENTIALS_HERO",
  ).length + (kitchenEssentialsHeroBanner ? 1 : 0),
    };
}, [
  banners,
  newArrivalsHeroBanner,
  kitchenEssentialsHeroBanner,
]);

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
        "/api/admin/banners",
      );

      const data = await response.json();

      setBanners(data);
    */

    setIsLoading(false);
  };

  /* =======================================================
     Tab Change
  ======================================================= */

  const handleTabChange = (
    tab: BannerTab,
  ) => {
    setActiveTab(tab);
  };

  /* =======================================================
     Update Hero Banner
  ======================================================= */

const handleUpdateHeroBanner = async (
  data: HomeHeroBannerFormData,
) => {
  await saveHomeHeroBanner({
    type: "HOME_HERO",
    eyebrow: data.eyebrow,
    heading: data.heading,
    highlighted_heading: data.highlightedHeading,
    description: data.description,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    bottom_label: data.bottomLabel,
    status: data.status,
    image: data.imageFile ?? undefined,
  });
};

  /* =======================================================
     Update Coupon Banner
  ======================================================= */

const handleUpdateCouponBanner = async (
  data: HomeCouponBannerFormData,
) => {
  await saveHomeCouponBanner({
    type: "HOME_COUPON",
    eyebrow: data.eyebrow,
    heading: data.heading,
    highlighted_heading: data.highlightedHeading,
    description: data.description,
    button_text: data.buttonText,
    button_link: data.buttonLink,
    offer_text: data.offerText,
    discount_value: Number(data.discountValue),
    discount_type: data.discountType,
    coupon_code: data.couponCode,
    terms_text: data.termsText,
    status: data.status,
    image: data.imageFile ?? undefined,
  });
};

  /* =======================================================
     Update New Arrivals Hero Banner
  ======================================================= */

  const handleUpdateNewArrivalsHeroBanner = async (
  data: NewArrivalsHeroBannerFormData,
) => {
  await saveNewArrivalsHeroBanner({
    type: "NEW_ARRIVALS_HERO",
    eyebrow: data.eyebrow.trim(),
    heading: data.heading.trim(),
    highlighted_heading: data.highlightedHeading.trim(),
    description: data.description.trim(),
    button_text: data.buttonText.trim(),
    button_link: data.buttonLink.trim(),
    floating_label: data.floatingLabel.trim(),
    floating_title: data.floatingTitle.trim(),
    floating_description: data.floatingDescription.trim(),
    bottom_label: data.bottomLabel.trim(),
    status: data.status,
    image: data.imageFile ?? undefined,
  });
};

  /* =======================================================
     Update Best Sellers Hero Banner
  ======================================================= */

const handleUpdateBestSellersHeroBanner = async (
  data: BestSellersHeroBannerFormData,
) => {
  await saveBestSellersHeroBanner({
    type: "BEST_SELLERS_HERO",
    eyebrow: data.eyebrow.trim(),
    heading: data.heading.trim(),
    highlighted_heading: data.highlightedHeading.trim(),
    description: data.description.trim(),
    rating_text: data.ratingText.trim(),
    button_text: data.buttonText.trim(),
    button_link: data.buttonLink.trim(),
    floating_label: data.floatingLabel.trim(),
    floating_title: data.floatingTitle.trim(),
    floating_description: data.floatingDescription.trim(),
    bottom_label: data.bottomLabel.trim(),
    status: data.status,
    image: data.imageFile ?? undefined,
  });
};
  /* =======================================================
     Update Home Essentials Hero Banner
  ======================================================= */

const handleUpdateHomeEssentialsHeroBanner = async (
  data: HomeEssentialsHeroBannerFormData,
) => {
  await saveHomeEssentialsHeroBanner({
    type: "HOME_ESSENTIALS_HERO",
    eyebrow: data.eyebrow.trim(),
    heading: data.heading.trim(),
    highlighted_heading: data.highlightedHeading.trim(),
    description: data.description.trim(),
    button_text: data.buttonText.trim(),
    button_link: data.buttonLink.trim(),
    floating_label: data.floatingLabel.trim(),
    floating_title: data.floatingTitle.trim(),
    floating_description: data.floatingDescription.trim(),
    bottom_label: data.bottomLabel.trim(),
    status: data.status,
    image: data.imageFile ?? undefined,
  });
};

  /* =======================================================
     Update Kitchen Essentials Hero Banner
  ======================================================= */

const handleUpdateKitchenEssentialsHeroBanner = async (
  data: KitchenEssentialsHeroBannerFormData,
) => {
  await saveKitchenEssentialsHeroBanner({
    type: "KITCHEN_ESSENTIALS_HERO",
    eyebrow: data.eyebrow.trim(),
    heading: data.heading.trim(),
    highlighted_heading: data.highlightedHeading.trim(),
    description: data.description.trim(),
    button_text: data.buttonText.trim(),
    button_link: data.buttonLink.trim(),
    floating_label: data.floatingLabel.trim(),
    floating_title: data.floatingTitle.trim(),
    floating_description: data.floatingDescription.trim(),
    floating_bottom_label: data.floatingBottomLabel.trim(),
    bottom_label: data.bottomLabel.trim(),
    status: data.status,
    image: data.imageFile ?? undefined,
  });
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

          <BannerHeader
            totalBanners={banners.length}
            onRefresh={handleRefresh}
            isLoading={isLoading}
          />

          {/* =================================================
              Main Content
          ================================================= */}

          <div className="mt-6">
            {isLoading ? (
              <BannerSkeleton />
            ) : (
              <div className="space-y-5">
                {/* ===========================================
                    Tabs
                =========================================== */}

                <BannerTabs
                  activeTab={activeTab}
                  counts={bannerCounts}
                  onChange={handleTabChange}
                />

                {/* ===========================================
                    Home Hero Banner
                =========================================== */}

                  {activeTab === "HOME_HERO" && (
                    isHomeHeroLoading ? (
                      <BannerSkeleton />
                    ) : (
                      <HomeHeroBannerForm
                        key={homeHeroBanner?.uuid ?? "home-hero-banner"}
                        banner={homeHeroBanner}
                        onSubmit={handleUpdateHeroBanner}
                        isSubmitting={isHomeHeroSubmitting}
                      />
                    )
                  )}

                {/* ===========================================
                    Home Coupon Banner
                =========================================== */}

{activeTab === "HOME_COUPON" && (
  isHomeCouponLoading ? (
    <BannerSkeleton />
  ) : homeCouponBanner ? (
    <HomeCouponBannerForm
      key={homeCouponBanner.uuid}
      banner={{
        ...homeCouponBanner,
        highlightedHeading:
          homeCouponBanner.highlighted_heading,
        buttonText: homeCouponBanner.button_text,
        buttonLink: homeCouponBanner.button_link,
        offerText: homeCouponBanner.offer_text,
        discountValue: homeCouponBanner.discount_value,
        discountType: homeCouponBanner.discount_type,
        couponCode: homeCouponBanner.coupon_code,
        termsText: homeCouponBanner.terms_text,
        image: homeCouponBanner.image ?? "",
        imageFile: null,
      }}
      onSubmit={handleUpdateCouponBanner}
      isSubmitting={isHomeCouponSubmitting}
    />
  ) : (
    <div className="rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-white px-6 py-14 text-center">
      <p className="text-sm font-medium text-[#665B53]">
        No Home Coupon Banner found.
      </p>
    </div>
  )
)}

{/* ===========================================
    New Arrivals Hero Banner
=========================================== */}

{activeTab === "NEW_ARRIVALS_HERO" && (
  isNewArrivalsHeroLoading ? (
    <BannerSkeleton />
  ) : (
    <NewArrivalsHeroBannerForm
      key={newArrivalsHeroBanner?.uuid ?? "new-arrivals-hero-banner"}
      banner={
        newArrivalsHeroBanner
          ? {
              id: newArrivalsHeroBanner.id,
              uuid: newArrivalsHeroBanner.uuid,
              type: newArrivalsHeroBanner.type,
              image: newArrivalsHeroBanner.image ?? "",
              imageFile: null,
              eyebrow: newArrivalsHeroBanner.eyebrow,
              heading: newArrivalsHeroBanner.heading,
              highlightedHeading:
                newArrivalsHeroBanner.highlighted_heading,
              description: newArrivalsHeroBanner.description,
              buttonText: newArrivalsHeroBanner.button_text,
              buttonLink: newArrivalsHeroBanner.button_link,
              floatingLabel: newArrivalsHeroBanner.floating_label,
              floatingTitle: newArrivalsHeroBanner.floating_title,
              floatingDescription:
                newArrivalsHeroBanner.floating_description,
              bottomLabel: newArrivalsHeroBanner.bottom_label,
              status: newArrivalsHeroBanner.status,
            }
          : null
      }
      onSubmit={handleUpdateNewArrivalsHeroBanner}
      isSubmitting={isNewArrivalsHeroSubmitting}
    />
  )
)}
{/* ===========================================
    Best Sellers Hero Banner
=========================================== */}

{activeTab === "BEST_SELLERS_HERO" && (
  isBestSellersHeroLoading ? (
    <BannerSkeleton />
  ) : bestSellersHeroBanner ? (
    <BestSellersHeroBannerForm
      key={bestSellersHeroBanner.uuid}
      onCancel={() => {
        // Optional: cancel action
      }}
    />
  ) : (
    <div className="rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-white px-6 py-14 text-center">
      <p className="text-sm font-medium text-[#665B53]">
        No Best Sellers Hero Banner found.
      </p>
    </div>
  )
)}

{/* ===========================================
    Home Essentials Hero Banner
=========================================== */}

{activeTab === "HOME_ESSENTIALS_HERO" && (
  isHomeEssentialsHeroLoading ? (
    <BannerSkeleton />
  ) : homeEssentialsHeroBanner ? (
    <HomeEssentialsHeroBannerForm
      key={homeEssentialsHeroBanner.uuid ?? "home-essentials-hero-banner"}
      banner={{
        type: homeEssentialsHeroBanner.type,
        image: homeEssentialsHeroBanner.image ?? "",
        imageFile: null,
        eyebrow: homeEssentialsHeroBanner.eyebrow,
        heading: homeEssentialsHeroBanner.heading,
        highlightedHeading:
          homeEssentialsHeroBanner.highlighted_heading,
        description: homeEssentialsHeroBanner.description,
        buttonText: homeEssentialsHeroBanner.button_text,
        buttonLink: homeEssentialsHeroBanner.button_link,
        floatingLabel: homeEssentialsHeroBanner.floating_label,
        floatingTitle: homeEssentialsHeroBanner.floating_title,
        floatingDescription:
          homeEssentialsHeroBanner.floating_description,
        bottomLabel: homeEssentialsHeroBanner.bottom_label,
        status: homeEssentialsHeroBanner.status,
      }}
      onSubmit={handleUpdateHomeEssentialsHeroBanner}
      isSubmitting={isHomeEssentialsHeroSubmitting}
    />
  ) : (
    <div className="rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-white px-6 py-14 text-center">
      <p className="text-sm font-medium text-[#665B53]">
        No Home Essentials Hero Banner found.
      </p>
    </div>
  )
)}

                {/* ===========================================
                    Kitchen Essentials Hero Banner
                =========================================== */}

{activeTab === "KITCHEN_ESSENTIALS_HERO" && (
  isKitchenEssentialsHeroLoading ? (
    <BannerSkeleton />
  ) : kitchenEssentialsHeroBanner ? (
    <KitchenEssentialsHeroBannerForm
      key={kitchenEssentialsHeroBanner.uuid}
      onCancel={() => {
        // Optional: cancel action
      }}
    />
  ) : (
    <div className="rounded-2xl border border-dashed border-[#6B3E1E]/15 bg-white px-6 py-14 text-center">
      <p className="text-sm font-medium text-[#665B53]">
        No Kitchen Essentials Hero Banner found.
      </p>
    </div>
  )
)}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
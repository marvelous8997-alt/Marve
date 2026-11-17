"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/src/hooks/user/useAuth";
import {
  Archive,
  ChevronDown,
  Clock3,
  Coffee,
  CookingPot,
  Heart,
  House,
  Menu,
  ShoppingBasket,
  Sparkles,
  Truck,
  UserRound,
  Utensils,
  X,
  FolderTree
} from "lucide-react";
import useCategory from "@/src/hooks/user/useCategory";
import type { UserCategory } from "@/src/types/user/category.types";
import useFavourite from "@/src/hooks/user/useFavourite";
import AnnouncementBar from "@/src/components/common/AnnouncementBar";
import SearchBar from "@/src/components/common/SearchBar";
import Login from "@/src/components/common/login/login";
import Favourite from "@/src/components/common/favourite/Favourite";
import Basket from "@/src/components/common/basket/Basket";
import useBasket from "@/src/context/BasketContext";

/* ========================= Types ========================= */

interface MegaMenuItem {
  label: string;
  href: string;
  icon?: React.ElementType;
}

interface NavItem {
  label: string;
  href: string;
  image?: string;
  children?: MegaMenuItem[];
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Archive,
  Coffee,
  CookingPot,
  FolderTree,
  House,
  Sparkles,
  Utensils,
};

function getCategoryIcon(iconName: string | null): React.ElementType {
  if (iconName && CATEGORY_ICON_MAP[iconName]) {
    return CATEGORY_ICON_MAP[iconName];
  }

  return FolderTree;
}

/* ========================= Navigation ========================= */

const NAV_ITEMS: NavItem[] = [
  {
    label: "Shop",
    href: "/common/products",
    image: "/assets/images/home/home_lifestyle.jpg",
    children: [
      { label: "All Products", href: "/common/products" },
      { label: "New Arrivals", href: "/common/new-arrivals" },
      { label: "Bestsellers", href: "/common/bestsellers" },
      { label: "Home Essentials", href: "/common/home-essentials" },
      { label: "Kitchen Essentials", href: "/common/kitchen-essentials" },
    ],
  },

{
  label: "Kitchen",
  href: "/common/category?category=kitchen",
  image: "/assets/images/home/home_lifestyle.jpg",
},
  {
    label: "Sale",
    href: "/common/sale",
  },

  {
    label: "Contact Us",
    href: "/common/contact-us",
  },

  {
    label: "More",
    href: "#",
    image: "/assets/images/home/home_lifestyle.jpg",
    children: [
      { label: "About Us", href: "/common/about" },
      { label: "Offers", href: "/common/offers" },
      { label: "Store Locator", href: "/common/store-locator" },
      { label: "Track Order", href: "/common/track-order" },
      { label: "Gift", href: "/common/gift" },
      { label: "Blog", href: "/common/blog" },
      { label: "Testimonials", href: "/common/testimonials" },
      { label: "Return & Exchange", href: "/common/return-exchange" },
    ],
  },
];

/* ========================= Component ========================= */

export default function Navbar() {
  const { totalItems } = useBasket();
  const {
  favourites,
  fetchFavourites,
} = useFavourite();

const favouriteCount = favourites.length;

  const {
    categories: backendCategories,
  } = useCategory();

  const activeCategories = (backendCategories ?? []).filter(
    (category: UserCategory) => category.status === "ACTIVE",
  );

  const navItems: NavItem[] = NAV_ITEMS.map((item) => {
    if (item.label !== "Kitchen") {
      return item;
    }

    return {
      ...item,
      children: activeCategories.map((category) => ({
        label: category.name,
        href: `/common/category?category=${encodeURIComponent(category.slug)}`,
        icon: getCategoryIcon(category.icon),
      })),
    };
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileItem, setOpenMobileItem] = useState<string | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isFavouriteOpen, setIsFavouriteOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const toggleMobileItem = (label: string) => {
    setOpenMobileItem((current) => (current === label ? null : label));
  };
  const router = useRouter();
  const pathname = usePathname();

  const { user, isAuthReady } = useAuth();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;

    setIsLoggedIn(Boolean(user));
  }, [user, isAuthReady]);

  useEffect(() => {
  if (!isAuthReady) return;

  if (isLoggedIn) {
    void fetchFavourites();
  }
}, [isAuthReady, isLoggedIn, fetchFavourites]);

useEffect(() => {
  const handleFavouritesChanged = () => {
    if (isAuthReady && isLoggedIn) {
      void fetchFavourites();
    }
  };

  window.addEventListener(
    "marve-favourites-changed",
    handleFavouritesChanged
  );

  return () => {
    window.removeEventListener(
      "marve-favourites-changed",
      handleFavouritesChanged
    );
  };
}, [isAuthReady, isLoggedIn, fetchFavourites]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white">
      {/* 1. Announcement */}
      <AnnouncementBar />

      {/* 2. Search Bar */}
      <SearchBar />

      {/* 3. Main Navbar */}
      <div className="relative border-b border-[#EEE5DC] bg-white">
        <div className="relative mx-auto flex h-[68px] max-w-7xl items-center justify-between px-3 sm:h-[76px] sm:px-6 lg:px-8">
          {/* Desktop Navigation */}
          <nav className="hidden h-full items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <div key={item.label} className="group h-full">
                <Link
                  href={item.href}
                  className="flex h-full items-center gap-1 whitespace-nowrap text-sm font-medium text-[#39312B] transition-colors duration-200 hover:text-[#A66A32]"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      strokeWidth={1.7}
                      className="transition-transform duration-200 group-hover:rotate-180"
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                {item.children && item.image && (
                  <div className="invisible absolute left-0 right-0 top-full z-50 w-full translate-y-2 border-b border-[#EEE5DC] bg-white opacity-0 shadow-[0_12px_35px_rgba(60,40,20,0.10)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="mx-auto grid w-full max-w-[1528px] grid-cols-[220px_minmax(0,1fr)] gap-0 px-4 py-7 sm:px-6 lg:px-8">
                      <Link href={item.href} className="relative block h-[220px] overflow-hidden bg-[#F8F5F0]">
                        <Image
                          src={item.image}
                          alt={`${item.label} collection`}
                          fill
                          sizes="220px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </Link>

                      <div className="grid min-w-0 grid-cols-2 md:grid-cols-3">
                        {item.children.map((child, index) => {
                          const Icon = child.icon;

                          return (
                            <Link
                              key={`${item.label}-${child.href}`}
                              href={child.href}
                              className={`group/category flex min-h-[58px] items-start gap-3 px-7 py-2 text-sm text-[#6D6870] transition-colors duration-200 hover:text-[#6B3E1E] ${
                                index > 0 ? "border-l border-[#EEE9E3]" : ""
                              }`}
                            >
                              {Icon && (
                                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F8F5F0] text-[#8A7D72] transition-all duration-200 group-hover/category:bg-[#F1E2D1] group-hover/category:text-[#6B3E1E]">
                                  <Icon
                                    size={16}
                                    strokeWidth={1.4}
                                    className="transition-transform duration-200 group-hover/category:scale-110"
                                  />
                                </span>
                              )}

                              <span className="leading-6">
                                {child.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 shrink-0 items-center justify-start text-[#39312B] lg:hidden"
          >
            <Menu size={22} strokeWidth={1.7} />
          </button>

          {/* Center Logo */}
          <Link
            href="/"
            aria-label="MARVE Home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <Image
              src="/assets/images/marve_logo.png"
              alt="MARVE"
              width={180}
              height={65}
              priority
              className="h-auto w-[98px] object-contain sm:w-[150px] lg:w-[175px]"
            />
          </Link>

          {/* Right Actions */}
          <div className="ml-auto flex items-center gap-0 sm:gap-2">
            {/* Account */}
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);

                if (isLoggedIn) {
                  if (pathname !== "/common/profile") {
                    router.push("/common/profile");
                  }
                } else {
                  setIsLoginOpen(true);
                }
              }}
              aria-label="My Account"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#39312B] transition-colors duration-200 hover:bg-[#F8F5F0] hover:text-[#A66A32] sm:h-10 sm:w-10"
            >
              <UserRound size={19} strokeWidth={1.6} />
            </button>

            {/* Favourite */}

            <button
              type="button"
              onClick={() => setIsFavouriteOpen(true)}
              aria-label={`Favourite${favouriteCount > 0 ? `, ${favouriteCount} products` : ""}`}
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-[#39312B] transition-colors duration-200 hover:bg-[#F8F5F0] hover:text-[#A66A32] sm:flex"
            >
              <Heart size={20} strokeWidth={1.6} />

              {favouriteCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A66A32] px-1 text-[8px] font-semibold leading-none text-white sm:right-0.5 sm:top-0.5 sm:h-[17px] sm:min-w-[17px] sm:text-[9px]">
                  {favouriteCount > 99 ? "99+" : favouriteCount}
                </span>
              )}
            </button>
            {/* Track Order */}
            <Link
              href="/common/track-order"
              aria-label="Track Order"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#39312B] transition-colors duration-200 hover:bg-[#F8F5F0] hover:text-[#A66A32] sm:h-10 sm:w-10"
            >
              <span className="relative flex h-[21px] w-[23px] items-center justify-end">
                <Truck
                  size={19}
                  strokeWidth={1.55}
                  className="text-current"
                />

                <span className="absolute -left-[3px] -top-[5px] flex h-[11px] w-[11px] items-center justify-center rounded-full bg-white">
                  <Clock3
                    size={10}
                    strokeWidth={1.7}
                    className="text-current"
                  />
                </span>
              </span>
            </Link>
            {/* Basket */}
            <button
              type="button"
              onClick={() => setIsBasketOpen(true)}
              aria-label="Basket"
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#39312B] transition-colors duration-200 hover:bg-[#F8F5F0] hover:text-[#A66A32] sm:h-10 sm:w-10"
            >
              <ShoppingBasket
                size={20}
                strokeWidth={1.6}
              />

             <span className="absolute right-0 top-0 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#A66A32] px-1 text-[8px] font-semibold leading-none text-white sm:right-0.5 sm:top-0.5 sm:h-[17px] sm:min-w-[17px] sm:text-[9px]">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside
            className="h-full w-[min(86vw,360px)] overflow-y-auto bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-[76px] items-center justify-between border-b border-[#EEE5DC] px-5">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Image
                  src="/assets/images/marve_logo.png"
                  alt="MARVE"
                  width={140}
                  height={50}
                  className="h-auto w-[120px] object-contain"
                />
              </Link>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#39312B] hover:bg-[#F8F5F0]"
              >
                <X size={22} strokeWidth={1.7} />
              </button>
            </div>

            <nav className="px-5 py-5">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <div key={item.label} className="border-b border-[#F3EEE8]">
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex-1 py-4 text-base font-medium text-[#39312B]"
                      >
                        {item.label}
                      </Link>

                      {item.children && (
                        <button
                          type="button"
                          onClick={() => toggleMobileItem(item.label)}
                          aria-label={`Toggle ${item.label} submenu`}
                          className="flex h-10 w-10 items-center justify-center text-[#756B63]"
                        >
                          <ChevronDown
                            size={18}
                            strokeWidth={1.6}
                            className={`transition-transform duration-200 ${openMobileItem === item.label ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}
                    </div>

                    {item.children && openMobileItem === item.label && (
                      <div className="mb-3 ml-3 space-y-1 border-l border-[#E8D5C0] pl-4">
                        {item.children.map((child) => (
                          <Link
                            key={`${item.label}-${child.href}`}
                            href={child.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center py-2.5 text-sm text-[#756B63] transition-colors hover:text-[#6B3E1E]"
                          >
                            <span>{child.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-1 border-t border-[#EEE5DC] pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);

                    if (isLoggedIn) {
                      if (pathname !== "/common/profile") {
                        router.push("/common/profile");
                      }
                    } else {
                      setIsLoginOpen(true);
                    }
                  }}
                  className="flex w-full items-center gap-3 py-3 text-sm font-medium text-[#39312B]"
                >
                  <UserRound size={19} strokeWidth={1.6} />
                  My Account
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsFavouriteOpen(true);
                  }}
                  className="flex w-full items-center gap-3 py-3 text-sm font-medium text-[#39312B]"
                >
                  <Heart size={19} strokeWidth={1.6} />
                  Favourite
                </button>

                <Link
                    href="/common/track-order"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center gap-3 py-3 text-sm font-medium text-[#39312B]"
                  >
                    <span className="relative flex h-5 w-5 items-center justify-end">
                      <Truck
                        size={19}
                        strokeWidth={1.6}
                      />

                      <span className="absolute -left-[2px] -top-[4px] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-white">
                        <Clock3
                          size={9}
                          strokeWidth={1.8}
                        />
                      </span>
                    </span>

                    Track Order
                  </Link>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsBasketOpen(true);
                  }}
                  className="flex w-full items-center gap-3 py-3 text-sm font-medium text-[#39312B]"
                >
                  <ShoppingBasket
                    size={19}
                    strokeWidth={1.6}
                  />
                  Basket
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}
        {/* Login Modal */}

        {isLoginOpen && (
          <Login
            onClose={() => setIsLoginOpen(false)}
          />
        )}

        {/* Favourite */}

        {isFavouriteOpen && (
          <Favourite
            onClose={() => setIsFavouriteOpen(false)}
          />
        )}

        {/* Basket */}

        {isBasketOpen && (
          <Basket
            onClose={() => setIsBasketOpen(false)}
          />
        )}
    </header>
  );
}
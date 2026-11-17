"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FolderTree,
  Heart,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleQuestion,
  MessageSquareQuote,
  Package,
  RefreshCcw,
  Settings,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
  UserRound,
  UsersRound,
  Warehouse,
  X,
} from "lucide-react";
import useAuth from "@/src/hooks/admin/useAuth";
import NotificationDropdown from "@/src/components/admin/notifications/NotificationDropdown";
/* ========================= Types ========================= */

interface AdminNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

/* ========================= Navigation ========================= */

const NAV_SECTIONS: AdminNavSection[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        label: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
    ],
  },

  {
    label: "Store",
    items: [
      {
        label: "Categories",
        href: "/admin/categories",
        icon: FolderTree,
      },
      {
        label: "SubCategories",
        href: "/admin/subcategories",
        icon: FolderTree,
      },
      {
        label: "Products",
        href: "/admin/products",
        icon: Package,
      },
      {
        label: "Orders",
        href: "/admin/orders",
        icon: ShoppingCart,
      },
    ],
  },

  {
    label: "Customers",
    items: [
      {
        label: "Customers",
        href: "/admin/customers",
        icon: UsersRound,
      },
      {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: MessageSquareQuote,
      },
    ],
  },
];

/* ========================= More Navigation ========================= */
/*
  Modules after Offers are kept inside More so the desktop
  navbar remains compact on laptop screens.
*/

const MORE_NAV_ITEMS: AdminNavItem[] = [
  /* ========================= Catalog ========================= */

  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
  },

  /* ========================= Customer ========================= */

  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
  },

  /* ========================= Marketing ========================= */

  {
    label: "Offers",
    href: "/admin/offers",
    icon: Tag,
  },

  {
    label: "Banners",
    href: "/admin/banners",
    icon: Images,
  },

  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageCircleQuestion,
  },

  {
    label: "Favourites",
    href: "/admin/favourites",
    icon: Heart,
  },

  /* ========================= Operations ========================= */

  {
    label: "Payments",
    href: "/admin/payments",
    icon: CreditCard,
  },

  {
    label: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
  },

  {
    label: "Returns & Refunds",
    href: "/admin/returns",
    icon: RefreshCcw,
  },

  /* ========================= Reports ========================= */

  {
    label: "Reports",
    href: "/admin/reports",
    icon: ClipboardList,
  },

  /* ========================= System ========================= */

  {
    label: "Store Preview",
    href: "/",
    icon: Store,
  },

  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

/* ========================= Component ========================= */

export default function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [
    isNotificationOpen,
    setIsNotificationOpen,
  ] = useState(false);

  const { logout } = useAuth();

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileMenuOpen(false);
    setMoreOpen(false);
    setIsNotificationOpen(false);

    try {
      await logout();
    } finally {
      router.replace("/admin/login");
    }
  };


    /* ========================= Active State ========================= */

  const isActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === href;
    }

    return (
      pathname === href ||
      pathname.startsWith(`${href}/`)
    );
  };

  const isMoreActive = MORE_NAV_ITEMS.some((item) =>
    isActive(item.href),
  );

  /* ========================= Helpers ========================= */

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const closeMoreMenu = () => {
    setMoreOpen(false);
  };

  return (
    <>
      {/* =========================================================
          DESKTOP / MAIN NAVBAR
      ========================================================= */}

      <header className="sticky top-0 z-40 border-b border-[#6B3E1E]/10 bg-[#FFF9F2]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] max-w-[1600px] items-center gap-4 px-4 sm:h-[76px] sm:px-6 lg:px-8">
          {/* ========================= Logo ========================= */}

          <Link
            href="/admin/dashboard"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/assets/images/marve_logo.png"
              alt="MARVE"
              width={180}
              height={65}
              priority
              className="h-auto w-[105px] object-contain sm:w-[125px] lg:w-[135px]"
            />
          </Link>

          {/* ========================= Desktop Navigation ========================= */}

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
            {NAV_SECTIONS.flatMap(
              (section) => section.items,
            ).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#6B3E1E] text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)]"
                      : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={active ? 1.9 : 1.65}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* ========================= More ========================= */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMoreOpen((current) => !current)
                }
                className={`group flex h-10 items-center gap-2 rounded-xl px-3 text-[13px] font-medium transition-all duration-200 ${
                  isMoreActive
                    ? "bg-[#6B3E1E] text-white shadow-[0_5px_16px_rgba(107,62,30,0.14)]"
                    : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                }`}
                aria-expanded={moreOpen}
                aria-haspopup="menu"
              >
                <Menu
                  size={16}
                  strokeWidth={
                    isMoreActive ? 1.9 : 1.65
                  }
                />

                <span>More</span>

                <ChevronDown
                  size={14}
                  strokeWidth={1.7}
                  className={`transition-transform duration-200 ${
                    moreOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* ========================= More Dropdown ========================= */}

              {moreOpen && (
                <>
                  {/* Invisible click-away layer */}

                  <button
                    type="button"
                    aria-label="Close More menu"
                    onClick={closeMoreMenu}
                    className="fixed inset-0 z-[-1] cursor-default"
                  />

                  <div className="absolute right-0 top-[48px] z-50 w-[210px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_14px_35px_rgba(41,35,31,0.12)]">
                    <div className="px-2.5 pb-1.5 pt-2">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A0958C]">
                        More Management
                      </p>
                    </div>

                    {MORE_NAV_ITEMS.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(
                        item.href,
                      );

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMoreMenu}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            active
                              ? "bg-[#6B3E1E] text-white"
                              : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                          }`}
                        >
                          <Icon
                            size={16}
                            strokeWidth={
                              active ? 1.9 : 1.7
                            }
                          />

                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* ========================= Right Actions ========================= */}

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Notifications */}

            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() =>
                  setIsNotificationOpen(
                    (previous) => !previous,
                  )
                }
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white text-[#665B53] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
              >
                <Bell
                  size={18}
                  strokeWidth={1.7}
                />

                <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#C98A50]" />
              </button>

              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() =>
                  setIsNotificationOpen(false)
                }
              />
            </div>

            {/* ========================= Profile ========================= */}

            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((current) => !current)
                }
                className="group flex h-10 items-center gap-2 rounded-xl px-1.5 transition-colors hover:bg-[#F8F5F0] sm:px-2"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E] text-white shadow-sm">
                  <UserRound
                    size={16}
                    strokeWidth={1.7}
                  />
                </div>

                <div className="hidden text-left sm:block">
                  <p className="max-w-[100px] truncate text-xs font-semibold text-[#29231F]">
                    MARVE Admin
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#8A7D72]">
                    Administrator
                  </p>
                </div>

                <ChevronDown
                  size={15}
                  strokeWidth={1.7}
                  className={`hidden text-[#8A7D72] transition-transform duration-200 sm:block ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}

              {profileOpen && (
                <div className="absolute right-0 top-[48px] w-[190px] overflow-hidden rounded-xl border border-[#6B3E1E]/10 bg-white p-1.5 shadow-[0_10px_30px_rgba(41,35,31,0.10)]">
                  <Link
                    href="/admin/settings"
                    onClick={() =>
                      setProfileOpen(false)
                    }
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#665B53] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  >
                    <Settings
                      size={16}
                      strokeWidth={1.7}
                    />

                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-[#665B53] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                  >
                    <LogOut size={16} strokeWidth={1.7} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* ========================= Mobile Menu ========================= */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (current) => !current,
                )
              }
              aria-label={
                mobileMenuOpen
                  ? "Close menu"
                  : "Open menu"
              }
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6B3E1E]/10 bg-white text-[#665B53] transition-colors hover:bg-[#F8F5F0] hover:text-[#6B3E1E] xl:hidden"
            >
              {mobileMenuOpen ? (
                <X
                  size={19}
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  size={19}
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>
        </div>

        {/* =========================================================
            MOBILE NAVIGATION
        ========================================================= */}

        {mobileMenuOpen && (
          <>
            {/* Mobile Overlay */}

            <button
              type="button"
              aria-label="Close navigation"
              onClick={closeMobileMenu}
              className="fixed inset-0 top-[72px] z-[-1] bg-[#29231F]/20 backdrop-blur-[2px] sm:top-[76px]"
            />

            <div className="border-t border-[#6B3E1E]/10 bg-[#FFF9F2] xl:hidden">
              <div className="max-h-[calc(100vh-72px)] overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-76px)] sm:px-6">
                <nav className="space-y-5">
                  {NAV_SECTIONS.map(
                    (section) => (
                      <div key={section.label}>
                        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A0958C]">
                          {section.label}
                        </p>

                        <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                          {section.items.map(
                            (item) => {
                              const Icon =
                                item.icon;

                              const active =
                                isActive(
                                  item.href,
                                );

                              return (
                                <Link
                                  key={
                                    item.href
                                  }
                                  href={
                                    item.href
                                  }
                                  onClick={
                                    closeMobileMenu
                                  }
                                  className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                                    active
                                      ? "bg-[#6B3E1E] text-white"
                                      : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                                  }`}
                                >
                                  <Icon
                                    size={17}
                                    strokeWidth={
                                      active
                                        ? 1.9
                                        : 1.65
                                    }
                                    className="shrink-0"
                                  />

                                  <span>
                                    {
                                      item.label
                                    }
                                  </span>
                                </Link>
                              );
                            },
                          )}
                        </div>
                      </div>
                    ),
                  )}

                  {/* ========================= Bottom Links ========================= */}

                <div className="border-t border-[#6B3E1E]/10 pt-4">
                  <div>
                    <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A0958C]">
                      More
                    </p>
                    <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {MORE_NAV_ITEMS.map(
                        (item) => {
                          const Icon =
                            item.icon;

                          const active =
                            isActive(
                              item.href,
                            );

                          return (
                            <Link
                              key={
                                item.href
                              }
                              href={
                                item.href
                              }
                              onClick={
                                closeMobileMenu
                              }
                              className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                                active
                                  ? "bg-[#F8F5F0] text-[#6B3E1E]"
                                  : "text-[#665B53] hover:bg-[#F8F5F0] hover:text-[#6B3E1E]"
                              }`}
                            >
                              <Icon
                                size={17}
                                strokeWidth={
                                  1.65
                                }
                              />

                              <span>
                                {
                                  item.label
                                }
                              </span>
                            </Link>
                          );
                        },
                      )}
                    </div>
                  </div>
                  </div>
                </nav>

                {/* ========================= Mobile Admin Profile ========================= */}

                <div className="mt-5 rounded-xl border border-[#6B3E1E]/10 bg-[#F8F5F0] p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6B3E1E] text-white">
                      <UserRound
                        size={17}
                        strokeWidth={1.7}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-[#29231F]">
                        MARVE Admin
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-[#8A7D72]">
                        Administrator
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label="Logout"
                      onClick={handleLogout}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#8A7D72] transition-colors hover:bg-white hover:text-[#6B3E1E]"
                    >
                      <LogOut size={16} strokeWidth={1.7} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
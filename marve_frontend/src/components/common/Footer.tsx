"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

/* ========================= Footer Links ========================= */

const SHOP_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Bestsellers", href: "/products?sort=bestsellers" },
  { label: "Home Essentials", href: "/categories/home-essentials" },
  { label: "Kitchen Essentials", href: "/categories/kitchen-essentials" },
];

const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "FAQs", href: "/faqs" },
  { label: "Shipping & Delivery", href: "/shipping" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Track Your Order", href: "/track-order" },
];

const COMPANY_LINKS = [
  { label: "About MARVE", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Cookie Policy", href: "/cookie-policy" },
];

/* ========================= Component ========================= */

export default function Footer() {
  return (
    <footer className="w-full bg-[#2D1B12] text-[#F5E8D8]">
      {/* ========================= Main Footer ========================= */}

      <div className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 lg:px-12 lg:pb-14 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-10">
          {/* ========================= Brand Column ========================= */}

          <div className="max-w-sm">
            <Link href="/" className="inline-block">
              <Image
                src="/assets/images/marve_logo.png"
                alt="MARVE"
                width={170}
                height={60}
                className="h-auto w-[140px] object-contain brightness-0 invert sm:w-[160px]"
              />
            </Link>

            <p className="mt-6 text-sm leading-7 text-[#CDB9A7]">
              Thoughtfully chosen essentials for a beautiful, comfortable and
              functional home. Discover everyday products made to elevate your
              space.
            </p>

            {/* Contact Info */}
            <div className="mt-6 space-y-3">
              <a
                href="mailto:support@marve.com"
                className="flex items-center gap-3 text-sm text-[#CDB9A7] transition-colors hover:text-white"
              >
                <Mail size={16} strokeWidth={1.5} />
                support@marve.com
              </a>

              <a
                href="tel:+919999999999"
                className="flex items-center gap-3 text-sm text-[#CDB9A7] transition-colors hover:text-white"
              >
                <Phone size={16} strokeWidth={1.5} />
                +91 99999 99999
              </a>

              <div className="flex items-start gap-3 text-sm leading-6 text-[#CDB9A7]">
                <MapPin
                  size={16}
                  strokeWidth={1.5}
                  className="mt-1 flex-shrink-0"
                />
                <span>India</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#725342] text-[#D8C4B2] transition-all hover:border-[#C98A50] hover:bg-[#C98A50] hover:text-white"
              >
                <FaInstagram size={17} strokeWidth={1.5} />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#725342] text-[#D8C4B2] transition-all hover:border-[#C98A50] hover:bg-[#C98A50] hover:text-white"
              >
                <FaFacebookF size={17} strokeWidth={1.5} />
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#725342] text-[#D8C4B2] transition-all hover:border-[#C98A50] hover:bg-[#C98A50] hover:text-white"
              >
                <FaTwitter size={17} strokeWidth={1.5} />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#725342] text-[#D8C4B2] transition-all hover:border-[#C98A50] hover:bg-[#C98A50] hover:text-white"
              >
                <FaYoutube size={17} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* ========================= Shop ========================= */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Shop
            </h3>

            <ul className="mt-6 space-y-3.5">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#CDB9A7] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================= Help & Support ========================= */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Help & Support
            </h3>

            <ul className="mt-6 space-y-3.5">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#CDB9A7] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ========================= Company ========================= */}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">
              Company
            </h3>

            <ul className="mt-6 space-y-3.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#CDB9A7] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ========================= Divider ========================= */}

        <div className="my-10 h-px bg-[#543B2D]" />

        {/* ========================= Bottom Footer ========================= */}

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[#A9917E] sm:text-sm">
            © {new Date().getFullYear()} MARVE. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#A9917E]">Secure payments</span>

            <div className="flex items-center gap-2">
              <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-[#1A1A1A]">
                VISA
              </span>

              <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-[#1A1A1A]">
                MC
              </span>

              <span className="rounded bg-white px-2 py-1 text-[10px] font-bold text-[#1A1A1A]">
                UPI
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
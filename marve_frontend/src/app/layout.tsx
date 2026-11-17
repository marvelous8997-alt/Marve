
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import BasketProviderWrapper from "@/src/components/providers/BasketProviderWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marve | Home & Kitchen",
  description:
    "Discover premium home and kitchen essentials at Marve.",
  icons: {
    icon: "/assets/images/marve_logo.png",
    shortcut: "/assets/images/marve_logo.png",
    apple: "/assets/images/marve_logo.png",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BasketProviderWrapper>
          {children}
        </BasketProviderWrapper>

        <Toaster
          position="top-right"
          richColors
          closeButton
        />
      </body>
    </html>
  );
}


"use client";

import { BasketProvider } from "@/src/context/BasketContext";

interface BasketProviderWrapperProps {
  children: React.ReactNode;
}

export default function BasketProviderWrapper({
  children,
}: BasketProviderWrapperProps) {
  return (
    <BasketProvider>
      {children}
    </BasketProvider>
  );
}

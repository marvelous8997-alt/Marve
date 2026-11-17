"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

import ProtectedRoute from "@/src/components/admin/auth/ProtectedRoute";

export default function AdminRouteGuard({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Allow the login page without authentication.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <ProtectedRoute allowedRoles={["SUPER_ADMIN", "ADMIN"]}>
      {children}
    </ProtectedRoute>
  );
}
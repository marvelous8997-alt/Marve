import type { ReactNode } from "react";
import AdminRouteGuard from "@/src/components/admin/auth/AdminRouteGuard";

export default function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminRouteGuard>{children}</AdminRouteGuard>;
}

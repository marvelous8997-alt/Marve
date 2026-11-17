"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import useAuth from "@/src/hooks/admin/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("SUPER_ADMIN" | "ADMIN")[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const {
    isAuthReady,
    isAuthenticated,
    admin,
  } = useAuth();

  useEffect(() => {
    if (!isAuthReady) return;

    // Redirect if admin is not authenticated.
    if (!isAuthenticated || !admin) {
      router.replace("/admin/login");
      return;
    }

    // Redirect if admin role is not permitted.
    if (
      allowedRoles &&
      !allowedRoles.includes(admin.role)
    ) {
      router.replace("/403");
    }
  }, [
    isAuthReady,
    isAuthenticated,
    admin,
    allowedRoles,
    router,
  ]);

  // Wait until authentication restoration completes.
  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF9F2]">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            className="animate-spin text-[#6B3E1E]"
            size={38}
          />

          <p className="text-xs font-medium uppercase tracking-[3px] text-[#8A7D72]">
            Authenticating...
          </p>
        </div>
      </div>
    );
  }

  // Do not render protected content for unauthenticated admins.
  if (!isAuthenticated || !admin) {
    return null;
  }

  // Do not render content while an unauthorized role redirects.
  if (
    allowedRoles &&
    !allowedRoles.includes(admin.role)
  ) {
    return null;
  }

  return <>{children}</>;
}

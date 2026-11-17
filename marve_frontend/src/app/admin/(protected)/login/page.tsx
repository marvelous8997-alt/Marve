import type { Metadata } from "next";
import AdminLogin from "@/src/components/admin/login/AdminLogin";

export const metadata: Metadata = {
  title: "Admin Login | MARVE",
  description: "Sign in to the MARVE administration panel.",
};

export default function AdminLoginPage() {
  return <AdminLogin />;
}
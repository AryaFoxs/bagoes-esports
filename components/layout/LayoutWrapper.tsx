"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin", "/dashboard"];

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = authRoutes.some((route) => pathname?.startsWith(route));
  const isAdminPage = adminRoutes.some((route) => pathname?.startsWith(route));

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

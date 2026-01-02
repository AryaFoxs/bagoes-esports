"use client";

import { useState } from "react";
import { UserSidebar } from "@/components/dashboard/UserSidebar";
import { UserHeader } from "@/components/dashboard/UserHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <UserSidebar />

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:pl-64 transition-all duration-300">
        <UserHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

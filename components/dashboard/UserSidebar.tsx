"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  User,
  Calendar,
  Trophy,
  MessageSquare,
  Heart,
  Bell,
  CreditCard,
  BarChart3,
  HeadphonesIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profil Saya",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Event Saya",
    href: "/dashboard/events",
    icon: Calendar,
  },
  {
    title: "Tim Saya",
    href: "/dashboard/teams",
    icon: Trophy,
  },
  {
    title: "Komunitas",
    href: "/dashboard/community",
    icon: MessageSquare,
  },
  {
    title: "Favorit",
    href: "/dashboard/favorites",
    icon: Heart,
  },
  {
    title: "Notifikasi",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    title: "Transaksi",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Statistik",
    href: "/dashboard/statistics",
    icon: BarChart3,
  },
  {
    title: "Bantuan",
    href: "/dashboard/support",
    icon: HeadphonesIcon,
  },
  {
    title: "Pengaturan",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    router.push("/");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg overflow-hidden">
            <Image
              src="/logo.png"
              alt="Bagoes Esports Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg">
              <span className="gradient-text">Bagoes</span>
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
        {menuItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.href)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full disabled:opacity-50",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{isLoggingOut ? "Keluar..." : "Keluar"}</span>}
        </button>
      </div>
    </aside>
  );
}

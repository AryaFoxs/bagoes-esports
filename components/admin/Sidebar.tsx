"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  FileText,
  MessageSquare,
  Newspaper,
  Settings,
  Shield,
  BarChart3,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Pengguna",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Event & Turnamen",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Tim Esports",
    href: "/admin/teams",
    icon: Trophy,
  },
  {
    title: "Konten",
    href: "/admin/content",
    icon: FileText,
    submenu: [
      { title: "Artikel", href: "/admin/content/articles" },
      { title: "Halaman", href: "/admin/content/pages" },
      { title: "Media", href: "/admin/content/media" },
    ],
  },
  {
    title: "Komunitas",
    href: "/admin/community",
    icon: MessageSquare,
  },
  {
    title: "Berita",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    title: "Statistik",
    href: "/admin/statistics",
    icon: BarChart3,
  },
  {
    title: "Keamanan",
    href: "/admin/security",
    icon: Shield,
    submenu: [
      { title: "Laporan", href: "/admin/security/reports" },
      { title: "Verifikasi", href: "/admin/security/verification" },
    ],
  },
  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
    submenu: [
      { title: "Umum", href: "/admin/settings" },
      { title: "Sosial Media", href: "/admin/settings/social" },
      { title: "Notifikasi", href: "/admin/settings/notifications" },
    ],
  },
  {
    title: "Pemeliharaan",
    href: "/admin/maintenance",
    icon: Database,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
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
        <Link href="/admin" className="flex items-center gap-2">
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
              <span className="gradient-text">Admin</span>
            </span>
          )}
        </Link>
        <button
          onClick={toggleCollapsed}
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
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.title}</span>
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 transition-transform",
                          openSubmenus.includes(item.title) && "rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>
                {!collapsed && openSubmenus.includes(item.title) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className={cn(
                          "block px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === sub.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
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
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

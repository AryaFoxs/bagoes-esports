"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  Trophy,
  Users,
  Swords,
  UserCircle,
  Newspaper,
  HelpCircle,
  HeadphonesIcon,
  Home,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/event", label: "Event", icon: Trophy },
  { href: "/komunitas", label: "Komunitas", icon: Users },
  { href: "/turnamen", label: "Turnamen", icon: Swords },
  { href: "/tim", label: "Tim", icon: UserCircle },
  { href: "/blog", label: "Blog", icon: Newspaper },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/support", label: "Support", icon: HeadphonesIcon },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setShowUserMenu(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <Image
                src="/logo.png"
                alt="Bagoes Esports Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-xl tracking-tight uppercase">
                <span className="gradient-text">Bagoes</span>
                <span className="text-foreground"> Esports</span>
              </span>
              <span className="text-xs font-normal text-muted-foreground uppercase" style={{ letterSpacing: '0.3em' }}>Organizer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-primary rounded-full transition-all duration-300",
                      isActive ? "w-1/2" : "w-0 group-hover:w-1/4"
                    )}
                  />
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons & Mobile Toggle */}
          <div className="flex items-center gap-3">
            {!loading && (
              <>
                {user ? (
                  /* User Profile Dropdown */
                  <div className="relative hidden sm:block">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        {profile?.avatar_url ? (
                          <Image
                            src={profile.avatar_url}
                            alt="Avatar"
                            width={32}
                            height={32}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium hidden md:block">
                        {profile?.username || 'User'}
                      </span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
                        <div className="p-2">
                          <Link
                            href={profile?.role === 'admin' || profile?.role === 'superadmin' ? '/admin' : '/dashboard'}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/dashboard/profile"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User className="w-4 h-4" />
                            Profil Saya
                          </Link>
                          <Link
                            href="/dashboard/settings"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings className="w-4 h-4" />
                            Pengaturan
                          </Link>
                          <hr className="my-2 border-border" />
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Keluar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Login/Daftar Buttons */
                  <div className="hidden sm:flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="gradient" size="sm" asChild>
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300",
            isOpen ? "max-h-[500px] pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1 pt-4 border-t border-border">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
            {/* Mobile Auth Buttons */}
            {!loading && (
              <>
                {user ? (
                  <div className="flex flex-col gap-2 mt-4 px-4">
                    <Link
                      href={profile?.role === 'admin' || profile?.role === 'superadmin' ? '/admin' : '/dashboard'}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-5 h-5" />
                      Keluar
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-4 px-4">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button variant="gradient" size="sm" className="flex-1" asChild>
                      <Link href="/register">Daftar</Link>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

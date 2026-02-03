"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  Trophy,
  Calendar,
  MessageSquare,
  Gift,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface UserHeaderProps {
  onMenuClick?: () => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  link?: string | null;
}

interface UserStats {
  level: number;
  xp: number;
  rank: string;
}

export function UserHeader({ onMenuClick }: UserHeaderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { signOut, profile, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const userStats = useMemo(() => ({
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    rank: profile?.rank || "Bronze",
  }), [profile]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      
      setLoadingNotifications(true);
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) {
        setNotifications(data);
      }
      setLoadingNotifications(false);
    };
    
    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel("notifications-header")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user?.id}`,
        },
        (payload: { new: Notification }) => {
          setNotifications((prev) => [payload.new as Notification, ...prev].slice(0, 5));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    router.push("/");
  };

  const markAsRead = async (notifId: string) => {
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
    
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, is_read: true } : n))
    );
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "event":
        return Calendar;
      case "team":
        return Trophy;
      case "reward":
        return Gift;
      case "alert":
        return AlertCircle;
      case "success":
        return CheckCircle;
      default:
        return MessageSquare;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const displayName = profile?.full_name || profile?.username || "Player";
  const avatarUrl = profile?.avatar_url;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold hidden md:block">
          Selamat datang, <span className="text-primary">{displayName.split(" ")[0]}</span>!
        </h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-card border border-border rounded-xl shadow-lg z-50">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Notifikasi</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      Tandai semua dibaca
                    </button>
                  )}
                  <Badge variant="secondary">{unreadCount} baru</Badge>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {loadingNotifications ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada notifikasi</p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const Icon = getNotifIcon(notif.type);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markAsRead(notif.id);
                          if (notif.link) router.push(notif.link);
                        }}
                        className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer ${
                          !notif.is_read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{notif.title}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {notif.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {getTimeAgo(notif.created_at)}
                            </p>
                          </div>
                          {!notif.is_read && (
                            <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full" asChild>
                  <Link href="/dashboard/notifications">Lihat Semua</Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={displayName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground">Level {userStats.level}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-xl shadow-lg z-50">
              {/* User Info Summary */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{displayName}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Lv.{userStats.level}</Badge>
                      <Badge variant="secondary" className="text-xs">{userStats.rank}</Badge>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">XP</span>
                    <span>{userStats.xp} / {userStats.level * 1000}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(userStats.xp / (userStats.level * 1000)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-2">
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
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4" />
                  {isLoggingOut ? "Keluar..." : "Keluar"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

interface UserHeaderProps {
  onMenuClick?: () => void;
}

export function UserHeader({ onMenuClick }: UserHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 1,
      type: "event",
      title: "Event dimulai besok!",
      message: "Valorant Championship akan dimulai besok pukul 14:00",
      time: "5 menit lalu",
      unread: true,
    },
    {
      id: 2,
      type: "team",
      title: "Undangan tim baru",
      message: "Phoenix Rising mengundang Anda bergabung",
      time: "1 jam lalu",
      unread: true,
    },
    {
      id: 3,
      type: "forum",
      title: "Balasan baru",
      message: "Ada 3 balasan baru di topik Anda",
      time: "2 jam lalu",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotifIcon = (type: string) => {
    switch (type) {
      case "event":
        return Calendar;
      case "team":
        return Trophy;
      default:
        return MessageSquare;
    }
  };

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
          Selamat datang, <span className="text-primary">Player</span>!
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
                <Badge variant="secondary">{unreadCount} baru</Badge>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = getNotifIcon(notif.type);
                  return (
                    <div
                      key={notif.id}
                      className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer ${
                        notif.unread ? "bg-primary/5" : ""
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
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">PlayerOne</p>
              <p className="text-xs text-muted-foreground">Level 25</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-xl shadow-lg z-50">
              <div className="p-2">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profil Saya
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Pengaturan
                </Link>
                <hr className="my-2 border-border" />
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

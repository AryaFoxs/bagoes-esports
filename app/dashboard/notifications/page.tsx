"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Trophy,
  MessageSquare,
  CreditCard,
  CheckCheck,
  Settings,
} from "lucide-react";
import Link from "next/link";

const notifications = [
  {
    id: "1",
    type: "event",
    title: "Event dimulai besok!",
    message: "Valorant Championship akan dimulai besok pukul 14:00 WIB.",
    time: "5 menit lalu",
    read: false,
  },
  {
    id: "2",
    type: "team",
    title: "Undangan tim baru",
    message: "Tim Phoenix Rising mengundang Anda bergabung.",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: "3",
    type: "forum",
    title: "Balasan baru",
    message: "Ada 3 balasan baru di topik 'Tips Bermain Valorant'.",
    time: "2 jam lalu",
    read: false,
  },
  {
    id: "4",
    type: "transaction",
    title: "Pembayaran berhasil",
    message: "Pembayaran Rp 100.000 untuk event MLBB Cup berhasil.",
    time: "1 hari lalu",
    read: true,
  },
  {
    id: "5",
    type: "event",
    title: "Pendaftaran dikonfirmasi",
    message: "Pendaftaran Anda untuk PUBG Mobile Cup telah dikonfirmasi.",
    time: "2 hari lalu",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "event":
      return Calendar;
    case "team":
      return Trophy;
    case "forum":
      return MessageSquare;
    case "transaction":
      return CreditCard;
    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Notifikasi</h1>
            <p className="text-muted-foreground">
              Anda memiliki {unreadCount} notifikasi belum dibaca
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CheckCheck className="w-4 h-4" />
            Tandai Semua Dibaca
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/settings">
              <Settings className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          onClick={() => setFilter("all")}
        >
          Semua
        </Button>
        <Button
          variant={filter === "unread" ? "default" : "ghost"}
          onClick={() => setFilter("unread")}
        >
          Belum Dibaca
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notif) => {
          const Icon = getIcon(notif.type);
          return (
            <Card
              key={notif.id}
              className={notif.read ? "" : "border-primary/50 bg-primary/5"}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.read ? "bg-muted" : "bg-primary/20"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        notif.read ? "text-muted-foreground" : "text-primary"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{notif.title}</p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {notif.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{notif.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

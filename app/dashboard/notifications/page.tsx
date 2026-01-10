"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Bell,
  Calendar,
  Trophy,
  MessageSquare,
  CreditCard,
  CheckCheck,
  Settings,
  Loader2,
  RefreshCw,
  Users,
  Heart,
  Shield,
  Star,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  event: { icon: Calendar, color: "text-primary" },
  team: { icon: Trophy, color: "text-accent" },
  team_invite: { icon: Users, color: "text-accent" },
  forum: { icon: MessageSquare, color: "text-secondary" },
  reply: { icon: MessageSquare, color: "text-secondary" },
  transaction: { icon: CreditCard, color: "text-green-500" },
  payment: { icon: CreditCard, color: "text-green-500" },
  registration: { icon: Calendar, color: "text-primary" },
  favorite: { icon: Heart, color: "text-pink-500" },
  security: { icon: Shield, color: "text-warning" },
  achievement: { icon: Star, color: "text-yellow-500" },
  default: { icon: Bell, color: "text-muted-foreground" },
};

export default function NotificationsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchNotifications = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (!error && data) {
      setNotifications(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [supabase, user]);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    return true;
  });

  const handleMarkAsRead = async (notifId: string) => {
    if (!supabase) return;
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notifId);
    
    setNotifications(notifications.map(n => 
      n.id === notifId ? { ...n, is_read: true } : n
    ));
  };

  const handleMarkAllAsRead = async () => {
    if (!supabase || !user) return;
    
    setIsProcessing(true);
    
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    
    setIsProcessing(false);
  };

  const handleDeleteNotification = async (notifId: string) => {
    if (!supabase) return;
    
    await supabase
      .from("notifications")
      .delete()
      .eq("id", notifId);
    
    setNotifications(notifications.filter(n => n.id !== notifId));
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return `${Math.floor(diffDays / 7)} minggu lalu`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start justify-between gap-4">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={handleMarkAllAsRead}
            disabled={isProcessing || unreadCount === 0}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCheck className="w-4 h-4" />
            )}
            Tandai Semua Dibaca
          </Button>
          <Button variant="ghost" size="sm" onClick={fetchNotifications}>
            <RefreshCw className="w-4 h-4" />
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
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">
              {filter === "unread" ? "Semua sudah dibaca!" : "Belum ada notifikasi"}
            </h3>
            <p className="text-muted-foreground">
              {filter === "unread" 
                ? "Tidak ada notifikasi yang belum dibaca"
                : "Notifikasi akan muncul di sini"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const config = typeConfig[notif.type] || typeConfig.default;
            const Icon = config.icon;
            
            return (
              <Card
                key={notif.id}
                className={`cursor-pointer transition-colors hover:bg-muted/30 ${
                  notif.is_read ? "" : "border-primary/50 bg-primary/5"
                }`}
                onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        notif.is_read ? "bg-muted" : "bg-primary/20"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          notif.is_read ? "text-muted-foreground" : config.color
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{notif.title}</p>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRelativeTime(notif.created_at)}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      {notif.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={notif.link}>
                            Lihat
                          </Link>
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notif.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

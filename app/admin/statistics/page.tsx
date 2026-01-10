"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  TrendingDown,
  Loader2,
  RefreshCw,
  FileText,
  MessageSquare,
  Shield,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  totalTeams: number;
  totalArticles: number;
  totalForumPosts: number;
  totalChallenges: number;
  activeEvents: number;
}

interface EventStat {
  id: string;
  title: string;
  registration_count: number;
  registration_fee: number;
  prize_pool: number;
  status: string;
}

export default function StatisticsPage() {
  const supabase = useMemo(() => createClient(), []);
  
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalEvents: 0,
    totalRegistrations: 0,
    totalTeams: 0,
    totalArticles: 0,
    totalForumPosts: 0,
    totalChallenges: 0,
    activeEvents: 0,
  });
  const [eventStats, setEventStats] = useState<EventStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    // Fetch all counts in parallel
    const [
      { count: usersCount },
      { count: eventsCount },
      { count: registrationsCount },
      { count: teamsCount },
      { count: articlesCount },
      { count: forumCount },
      { count: challengesCount },
      { count: activeEventsCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }),
      supabase.from("event_registrations").select("*", { count: "exact", head: true }),
      supabase.from("teams").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("forum_posts").select("*", { count: "exact", head: true }),
      supabase.from("challenges").select("*", { count: "exact", head: true }),
      supabase.from("events").select("*", { count: "exact", head: true }).in("status", ["live", "upcoming"]),
    ]);
    
    setStats({
      totalUsers: usersCount || 0,
      totalEvents: eventsCount || 0,
      totalRegistrations: registrationsCount || 0,
      totalTeams: teamsCount || 0,
      totalArticles: articlesCount || 0,
      totalForumPosts: forumCount || 0,
      totalChallenges: challengesCount || 0,
      activeEvents: activeEventsCount || 0,
    });

    // Fetch event statistics with registration counts
    const { data: events } = await supabase
      .from("events")
      .select("id, title, registration_fee, prize_pool, status")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (events) {
      const eventsWithCounts = await Promise.all(
        events.map(async (event: { id: string; title: string; registration_fee: number; prize_pool: number; status: string }) => {
          const { count } = await supabase
            .from("event_registrations")
            .select("*", { count: "exact", head: true })
            .eq("event_id", event.id)
            .neq("status", "cancelled");
          
          return {
            ...event,
            registration_count: count || 0,
          };
        })
      );
      setEventStats(eventsWithCounts);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, [supabase]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const totalRevenue = eventStats.reduce((sum, e) => sum + (e.registration_count * e.registration_fee), 0);
  const totalParticipants = eventStats.reduce((sum, e) => sum + e.registration_count, 0);
  const totalPrizePool = eventStats.reduce((sum, e) => sum + e.prize_pool, 0);

  const statsCards = [
    { 
      key: "users",
      label: "Total Pengguna", 
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    { 
      key: "events",
      label: "Total Event", 
      value: stats.totalEvents.toLocaleString(),
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    { 
      key: "registrations",
      label: "Total Pendaftaran", 
      value: stats.totalRegistrations.toLocaleString(),
      icon: Trophy,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    { 
      key: "teams",
      label: "Total Tim", 
      value: stats.totalTeams.toLocaleString(),
      icon: Shield,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const secondaryStats = [
    { label: "Artikel", value: stats.totalArticles, icon: FileText },
    { label: "Postingan Forum", value: stats.totalForumPosts, icon: MessageSquare },
    { label: "Tantangan", value: stats.totalChallenges, icon: Trophy },
    { label: "Event Aktif", value: stats.activeEvents, icon: Calendar },
  ];

  return (
    <div>
      <PageHeader
        title="Statistik & Laporan"
        description="Analitik dan performa website"
        icon={BarChart3}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Statistik" },
        ]}
        actions={
          <Button variant="outline" className="gap-2" onClick={fetchStats}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Primary Stats Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsCards.map((stat) => (
              <Card key={stat.key}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Secondary Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {secondaryStats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Overview Cards */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Ringkasan</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                      <p className="text-2xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-accent" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Peserta Event</p>
                      <p className="text-2xl font-bold text-primary">{totalParticipants.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Prize Pool</p>
                      <p className="text-2xl font-bold text-secondary">{formatCurrency(totalPrizePool)}</p>
                    </div>
                    <Trophy className="w-8 h-8 text-secondary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Statistik Konten</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Event</p>
                        <p className="text-xs text-muted-foreground">Total event yang dibuat</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">{stats.totalEvents}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">Tim</p>
                        <p className="text-xs text-muted-foreground">Tim terdaftar</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">{stats.totalTeams}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Artikel</p>
                        <p className="text-xs text-muted-foreground">Artikel & berita</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">{stats.totalArticles}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-medium">Forum</p>
                        <p className="text-xs text-muted-foreground">Postingan forum</p>
                      </div>
                    </div>
                    <span className="text-xl font-bold">{stats.totalForumPosts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Statistics Table */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Statistik Event</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 text-left text-sm font-semibold">Event</th>
                      <th className="py-3 text-center text-sm font-semibold">Status</th>
                      <th className="py-3 text-center text-sm font-semibold">Peserta</th>
                      <th className="py-3 text-right text-sm font-semibold">Biaya</th>
                      <th className="py-3 text-right text-sm font-semibold">Pendapatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventStats.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-muted-foreground">
                          Belum ada data event
                        </td>
                      </tr>
                    ) : (
                      eventStats.map((event) => (
                        <tr key={event.id} className="border-b border-border">
                          <td className="py-3 font-medium">{event.title}</td>
                          <td className="py-3 text-center">
                            <Badge className={
                              event.status === "live" ? "bg-destructive/20 text-destructive" :
                              event.status === "upcoming" ? "bg-primary/20 text-primary" :
                              event.status === "completed" ? "bg-accent/20 text-accent" :
                              "bg-muted text-muted-foreground"
                            }>
                              {event.status === "live" ? "Live" :
                               event.status === "upcoming" ? "Akan Datang" :
                               event.status === "completed" ? "Selesai" : event.status}
                            </Badge>
                          </td>
                          <td className="py-3 text-center">{event.registration_count}</td>
                          <td className="py-3 text-right text-muted-foreground">
                            {event.registration_fee > 0 ? formatCurrency(event.registration_fee) : "Gratis"}
                          </td>
                          <td className="py-3 text-right text-accent font-medium">
                            {formatCurrency(event.registration_count * event.registration_fee)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {eventStats.length > 0 && (
                    <tfoot>
                      <tr className="font-bold">
                        <td className="py-3">Total</td>
                        <td className="py-3"></td>
                        <td className="py-3 text-center">{totalParticipants}</td>
                        <td className="py-3"></td>
                        <td className="py-3 text-right text-accent">{formatCurrency(totalRevenue)}</td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

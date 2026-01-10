"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Calendar,
  Search,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Loader2,
  RefreshCw,
  MapPin,
  Users,
} from "lucide-react";

interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  team_id: string | null;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  result: string | null;
  created_at: string;
  event?: {
    id: string;
    title: string;
    game: string;
    start_date: string;
    end_date: string;
    location: string;
    status: string;
    banner_url: string | null;
  };
  team?: {
    id: string;
    name: string;
    logo_url: string | null;
  };
}

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  confirmed: {
    label: "Terkonfirmasi",
    class: "bg-accent/20 text-accent",
    icon: CheckCircle,
  },
  pending: {
    label: "Menunggu",
    class: "bg-warning/20 text-warning",
    icon: Clock,
  },
  completed: {
    label: "Selesai",
    class: "bg-muted text-muted-foreground",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Dibatalkan",
    class: "bg-destructive/20 text-destructive",
    icon: XCircle,
  },
};

export default function MyEventsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const fetchRegistrations = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("event_registrations")
      .select(`
        *,
        event:events (
          id,
          title,
          game,
          start_date,
          end_date,
          location,
          status,
          banner_url
        ),
        team:teams (
          id,
          name,
          logo_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      setRegistrations(data);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchRegistrations();
    }
  }, [supabase, user]);

  const filteredEvents = registrations.filter((reg) => {
    const matchStatus = statusFilter === "all" || reg.status === statusFilter;
    const matchSearch = !search || 
      reg.event?.title?.toLowerCase().includes(search.toLowerCase()) ||
      reg.event?.game?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const upcomingCount = registrations.filter(
    (r) => r.status === "confirmed" || r.status === "pending"
  ).length;
  const completedCount = registrations.filter((r) => r.status === "completed").length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Event Saya</h1>
              <p className="text-muted-foreground">
                Kelola pendaftaran dan riwayat event
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchRegistrations}>
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{registrations.length}</p>
              <p className="text-xs text-muted-foreground">Total Event</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingCount}</p>
              <p className="text-xs text-muted-foreground">Mendatang</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Cari event..." 
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="confirmed">Terkonfirmasi</option>
              <option value="pending">Menunggu</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
            <Button variant="gradient" asChild>
              <Link href="/event">Cari Event Baru</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Belum ada event</h3>
          <p className="text-muted-foreground mb-4">
            {search || statusFilter !== "all" 
              ? "Coba ubah filter pencarian"
              : "Anda belum mendaftar event apapun"}
          </p>
          <Button variant="gradient" asChild>
            <Link href="/event">Jelajahi Event</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((registration) => {
            const config = statusConfig[registration.status] || statusConfig.pending;
            const StatusIcon = config.icon;
            const event = registration.event;
            
            return (
              <Card key={registration.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center overflow-hidden">
                        {event?.banner_url ? (
                          <img src={event.banner_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Trophy className="w-7 h-7 text-primary" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{event?.title || "Event"}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{event?.game}</span>
                          <span>•</span>
                          <span>{event?.start_date ? formatDate(event.start_date) : "-"}</span>
                          {registration.team && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                Tim: {registration.team.name}
                              </span>
                            </>
                          )}
                        </div>
                        {event?.location && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {registration.result && (
                        <Badge className="bg-accent/20 text-accent">
                          {registration.result}
                        </Badge>
                      )}
                      <Badge className={config.class}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {config.label}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/event/${registration.event_id}`}>
                          <Eye className="w-4 h-4" />
                        </Link>
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

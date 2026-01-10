"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types/database.types";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Filter,
  Search,
  Play,
  Clock,
  CheckCircle,
  ChevronRight,
  Globe,
  Loader2,
} from "lucide-react";

interface EventWithCount extends Event {
  registration_count?: number;
}

const games = [
  "Valorant",
  "Mobile Legends",
  "PUBG Mobile",
  "Free Fire",
  "Dota 2",
  "League of Legends",
  "Counter-Strike 2",
  "eFootball",
];

export default function EventPage() {
  const supabase = useMemo(() => createClient(), []);
  
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("Semua");
  const [selectedType, setSelectedType] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const fetchEvents = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    let query = supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: true });
    
    const { data, error } = await query;
    
    if (!error && data) {
      // Fetch registration counts for each event
      const eventsWithCounts = await Promise.all(
        data.map(async (event: Event) => {
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
      
      setEvents(eventsWithCounts);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [supabase]);

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      (event.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesGame =
      selectedGame === "Semua" || event.game === selectedGame;
    const matchesType =
      selectedType === "Semua" || event.location_type === selectedType;
    const matchesStatus =
      selectedStatus === "Semua" || event.status === selectedStatus;

    return matchesSearch && matchesGame && matchesType && matchesStatus;
  });

  const liveEvents = filteredEvents.filter((e) => e.status === "live");
  const upcomingEvents = filteredEvents.filter((e) => e.status === "upcoming");
  const completedEvents = filteredEvents.filter((e) => e.status === "completed");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge variant="live">🔴 LIVE</Badge>;
      case "upcoming":
        return <Badge variant="default">Akan Datang</Badge>;
      case "completed":
        return <Badge variant="outline">Selesai</Badge>;
      default:
        return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "hybrid":
        return "Hybrid";
      default:
        return type;
    }
  };

  const formatPrizePool = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)} Juta`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)} Ribu`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <Trophy className="w-3 h-3 mr-1" />
              Event
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Event <span className="gradient-text">Esports</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Temukan dan ikuti berbagai event esports mulai dari turnamen
              kompetitif hingga workshop dan meetup komunitas.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-border bg-card/50 sticky top-16 lg:top-20 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Game Filter */}
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Game</option>
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Tipe</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="hybrid">Hybrid</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="Semua">Semua Status</option>
                <option value="live">Live</option>
                <option value="upcoming">Akan Datang</option>
                <option value="completed">Selesai</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Loading State */}
      {loading && (
        <section className="py-20">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Memuat event...</p>
          </div>
        </section>
      )}

      {!loading && (
        <>
          {/* Live Events */}
          {liveEvents.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                  Sedang Berlangsung
                </h2>

                <div className="space-y-4">
                  {liveEvents.map((event) => (
                    <Card
                      key={event.id}
                      className="overflow-hidden bg-gradient-to-r from-destructive/10 to-primary/10 border-destructive/30"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          <div className="w-full lg:w-48 h-32 rounded-xl bg-muted overflow-hidden relative">
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <Trophy className="w-12 h-12 text-primary" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              {getStatusBadge(event.status)}
                              <Badge variant="game">{event.game}</Badge>
                              <Badge variant="outline">{getTypeLabel(event.location_type)}</Badge>
                            </div>
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-muted-foreground mb-4 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                {event.location_type === "online" ? (
                                  <Globe className="w-4 h-4" />
                                ) : (
                                  <MapPin className="w-4 h-4" />
                                )}
                                {event.location || "Online"}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {event.registration_count || 0}/{event.max_participants}
                              </span>
                              {event.prize_pool && event.prize_pool > 0 && (
                                <Badge variant="success">{formatPrizePool(event.prize_pool)}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex lg:flex-col gap-2 lg:justify-center">
                            <Button variant="outline" asChild>
                              <Link href={`/event/${event.slug}`}>Detail</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Akan Datang
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/event/${event.slug}`}>
                      <Card hover className="overflow-hidden group h-full">
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          {event.image_url && (
                            <img 
                              src={event.image_url} 
                              alt={event.title}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          )}
                          {!event.image_url && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Trophy className="w-16 h-16 text-primary/30" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                          <div className="absolute top-3 left-3 flex gap-2">
                            {getStatusBadge(event.status)}
                            <Badge variant="game">{event.game}</Badge>
                          </div>
                          {event.location_type === "online" && (
                            <Badge className="absolute top-3 right-3" variant="outline">
                              <Globe className="w-3 h-3 mr-1" />
                              Online
                            </Badge>
                          )}
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {event.description}
                          </p>

                          <div className="space-y-2 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(event.start_date).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {event.location || "Online"}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {event.registration_count || 0}/{event.max_participants} peserta
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            {event.prize_pool && event.prize_pool > 0 ? (
                              <Badge variant="success">{formatPrizePool(event.prize_pool)}</Badge>
                            ) : (
                              <span></span>
                            )}
                            <Button size="sm" variant="gradient" className="gap-1">
                              Daftar <ChevronRight className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Completed Events */}
          {completedEvents.length > 0 && (
            <section className="py-12">
              <div className="container mx-auto px-4 lg:px-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-accent" />
                  Selesai
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedEvents.map((event) => (
                    <Card key={event.id} className="overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                      <div className="aspect-video bg-muted relative grayscale overflow-hidden">
                        {event.image_url ? (
                          <img 
                            src={event.image_url} 
                            alt={event.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Trophy className="w-16 h-16 text-muted-foreground/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <Badge className="absolute top-3 left-3" variant="outline">
                          Selesai
                        </Badge>
                      </div>
                      <CardContent className="p-5">
                        <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.start_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>
                        <Button size="sm" variant="outline" className="w-full" asChild>
                          <Link href={`/event/${event.slug}`}>Lihat Detail</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* No Results */}
          {filteredEvents.length === 0 && (
            <section className="py-20">
              <div className="container mx-auto px-4 lg:px-8 text-center">
                <Filter className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Tidak ada event ditemukan</h3>
                <p className="text-muted-foreground mb-6">
                  Belum ada event yang tersedia atau coba ubah filter pencarian Anda.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setSelectedGame("Semua");
                    setSelectedType("Semua");
                    setSelectedStatus("Semua");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

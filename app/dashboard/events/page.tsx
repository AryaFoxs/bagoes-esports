"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Search,
  Filter,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const myEvents = [
  {
    id: "1",
    title: "Valorant Championship Series",
    game: "Valorant",
    date: "15 Jan 2026",
    status: "confirmed",
    team: "Phoenix Rising",
    result: null,
  },
  {
    id: "2",
    title: "MLBB Weekend Cup",
    game: "Mobile Legends",
    date: "18 Jan 2026",
    status: "pending",
    team: "Dragon Squad",
    result: null,
  },
  {
    id: "3",
    title: "PUBG Mobile Championship",
    game: "PUBG Mobile",
    date: "10 Des 2025",
    status: "completed",
    team: "Phoenix Rising",
    result: "Juara 2",
  },
  {
    id: "4",
    title: "Free Fire Community Cup",
    game: "Free Fire",
    date: "25 Nov 2025",
    status: "completed",
    team: "Solo",
    result: "Top 8",
  },
];

const statusConfig: Record<string, { label: string; class: string; icon: any }> = {
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
  rejected: {
    label: "Ditolak",
    class: "bg-destructive/20 text-destructive",
    icon: XCircle,
  },
};

export default function MyEventsPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents = myEvents.filter(
    (e) => statusFilter === "all" || e.status === statusFilter
  );

  const upcomingCount = myEvents.filter(
    (e) => e.status === "confirmed" || e.status === "pending"
  ).length;
  const completedCount = myEvents.filter((e) => e.status === "completed").length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
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
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{myEvents.length}</p>
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
              <Input placeholder="Cari event..." className="pl-9" />
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
            </select>
            <Button variant="gradient" asChild>
              <Link href="/event">Cari Event Baru</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((event) => {
          const config = statusConfig[event.status];
          const StatusIcon = config.icon;
          return (
            <Card key={event.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Trophy className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.game} • {event.date} • Tim: {event.team}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {event.result && (
                      <Badge className="bg-accent/20 text-accent">
                        {event.result}
                      </Badge>
                    )}
                    <Badge className={config.class}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {config.label}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/event/${event.id}`}>
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
    </div>
  );
}

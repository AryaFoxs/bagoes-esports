"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Calendar,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Trophy,
  Play,
  Pause,
  CheckCircle,
} from "lucide-react";

// Mock events data
const events = [
  {
    id: "1",
    title: "Valorant Championship Series",
    game: "Valorant",
    type: "tournament",
    status: "upcoming",
    date: "2026-01-15",
    registrations: 24,
    maxTeams: 32,
    prizePool: "Rp 50.000.000",
  },
  {
    id: "2",
    title: "MLBB Pro League Season 5",
    game: "Mobile Legends",
    type: "tournament",
    status: "live",
    date: "2026-01-10",
    registrations: 16,
    maxTeams: 16,
    prizePool: "Rp 100.000.000",
  },
  {
    id: "3",
    title: "PUBG Mobile Weekend Cup",
    game: "PUBG Mobile",
    type: "casual",
    status: "upcoming",
    date: "2026-01-25",
    registrations: 45,
    maxTeams: 64,
    prizePool: "Rp 25.000.000",
  },
  {
    id: "4",
    title: "Free Fire Community Tournament",
    game: "Free Fire",
    type: "tournament",
    status: "completed",
    date: "2025-12-20",
    registrations: 32,
    maxTeams: 32,
    prizePool: "Rp 30.000.000",
  },
];

const statusConfig: Record<string, { label: string; class: string }> = {
  upcoming: { label: "Akan Datang", class: "bg-primary/20 text-primary" },
  live: { label: "Berlangsung", class: "bg-destructive/20 text-destructive" },
  completed: { label: "Selesai", class: "bg-muted text-muted-foreground" },
  cancelled: { label: "Dibatalkan", class: "bg-destructive/20 text-destructive" },
};

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActions, setShowActions] = useState<string | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Manajemen Event"
        description="Kelola semua event dan turnamen"
        icon={Calendar}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Event" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2" asChild>
            <Link href="/admin/events/new">
              <Plus className="w-4 h-4" />
              Tambah Event
            </Link>
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{events.length}</p>
              <p className="text-xs text-muted-foreground">Total Event</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <Play className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {events.filter((e) => e.status === "live").length}
              </p>
              <p className="text-xs text-muted-foreground">Berlangsung</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Pause className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {events.filter((e) => e.status === "upcoming").length}
              </p>
              <p className="text-xs text-muted-foreground">Akan Datang</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {events.filter((e) => e.status === "completed").length}
              </p>
              <p className="text-xs text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="upcoming">Akan Datang</option>
              <option value="live">Berlangsung</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Event
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Pendaftar
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Hadiah
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Trophy className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {event.game} • {event.type === "tournament" ? "Turnamen" : "Kasual"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={statusConfig[event.status].class}>
                        {statusConfig[event.status].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>
                          {event.registrations}/{event.maxTeams}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-accent">
                      {event.prizePool}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative flex justify-end">
                        <button
                          onClick={() =>
                            setShowActions(
                              showActions === event.id ? null : event.id
                            )
                          }
                          className="p-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {showActions === event.id && (
                          <div className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                            <div className="p-2">
                              <Link
                                href={`/admin/events/${event.id}`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Lihat Detail
                              </Link>
                              <Link
                                href={`/admin/events/${event.id}/edit`}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                                <Trash2 className="w-4 h-4" />
                                Hapus
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

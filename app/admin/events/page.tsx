"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types/database.types";
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
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

interface EventWithCount extends Event {
  registration_count?: number;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  upcoming: { label: "Akan Datang", class: "bg-primary/20 text-primary" },
  live: { label: "Berlangsung", class: "bg-destructive/20 text-destructive" },
  completed: { label: "Selesai", class: "bg-muted text-muted-foreground" },
  cancelled: { label: "Dibatalkan", class: "bg-destructive/20 text-destructive" },
};

const typeLabels: Record<string, string> = {
  tournament: "Turnamen",
  casual: "Kasual",
  workshop: "Workshop",
  meetup: "Meetup",
};

export default function EventsPage() {
  const supabase = useMemo(() => createClient(), []);
  
  const [events, setEvents] = useState<EventWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showActions, setShowActions] = useState<string | null>(null);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventWithCount | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    live: 0,
    upcoming: 0,
    completed: 0,
  });

  const fetchEvents = async () => {
    if (!supabase) return;
    
    setLoading(true);
    
    // Fetch events
    let query = supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });
    
    // Apply status filter
    if (statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }
    
    // Apply search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,game.ilike.%${search}%`);
    }
    
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
      
      // Update stats
      setStats({
        total: eventsWithCounts.length,
        live: eventsWithCounts.filter((e) => e.status === "live").length,
        upcoming: eventsWithCounts.filter((e) => e.status === "upcoming").length,
        completed: eventsWithCounts.filter((e) => e.status === "completed").length,
      });
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, [supabase, statusFilter, search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-dropdown]') || target.closest('[data-action-btn]')) {
        return;
      }
      setShowActions(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUpdateStatus = async () => {
    if (!selectedEvent || !newStatus || !supabase) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    const { error } = await supabase
      .from("events")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", selectedEvent.id);

    if (error) {
      setUpdateError(error.message);
    } else {
      setUpdateSuccess(`Status event berhasil diubah menjadi ${statusConfig[newStatus]?.label || newStatus}`);
      setShowStatusModal(false);
      fetchEvents();
      setTimeout(() => setUpdateSuccess(null), 3000);
    }
    
    setIsUpdating(false);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent || !supabase) return;
    
    setIsUpdating(true);
    setUpdateError(null);

    try {
      // First, delete related event_registrations (foreign key constraint)
      const { error: regError } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", selectedEvent.id);

      if (regError) {
        console.error("Error deleting registrations:", regError);
        // Continue anyway, registrations might not exist
      }

      // Now delete the event
      const { error, data } = await supabase
        .from("events")
        .delete()
        .eq("id", selectedEvent.id)
        .select();

      console.log("Delete result:", { error, data });

      if (error) {
        console.error("Delete error:", error);
        setUpdateError(`Gagal menghapus: ${error.message}. Pastikan Anda memiliki izin admin.`);
      } else {
        setUpdateSuccess(`Event "${selectedEvent.title}" berhasil dihapus`);
        setShowDeleteModal(false);
        setSelectedEvent(null);
        fetchEvents();
        setTimeout(() => setUpdateSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Delete exception:", err);
      setUpdateError("Terjadi kesalahan saat menghapus event.");
    }
    
    setIsUpdating(false);
  };

  const openStatusModal = (event: EventWithCount) => {
    setSelectedEvent(event);
    setNewStatus(event.status);
    setShowStatusModal(true);
    setShowActions(null);
  };

  const openDeleteModal = (event: EventWithCount) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
    setShowActions(null);
  };

  const formatPrizePool = (amount: number) => {
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}M`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(0)} Juta`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)} Ribu`;
    }
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

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
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={fetchEvents}>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="gradient" className="gap-2" asChild>
              <Link href="/admin/events/new">
                <Plus className="w-4 h-4" />
                Tambah Event
              </Link>
            </Button>
          </div>
        }
      />

      {/* Success Message */}
      {updateSuccess && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{updateSuccess}</span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
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
              <p className="text-2xl font-bold">{stats.live}</p>
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
              <p className="text-2xl font-bold">{stats.upcoming}</p>
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
              <p className="text-2xl font-bold">{stats.completed}</p>
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
              <option value="cancelled">Dibatalkan</option>
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                      <p className="mt-2 text-muted-foreground">Memuat data...</p>
                    </td>
                  </tr>
                ) : events.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      {search || statusFilter !== "all" 
                        ? "Tidak ada event yang ditemukan" 
                        : "Belum ada event. Klik 'Tambah Event' untuk membuat event baru."}
                    </td>
                  </tr>
                ) : (
                  events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center overflow-hidden">
                            {event.image_url ? (
                              <img 
                                src={event.image_url} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Trophy className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {event.game} • {typeLabels[event.location_type] || event.location_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={statusConfig[event.status]?.class || "bg-muted"}>
                          {statusConfig[event.status]?.label || event.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(event.start_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {event.registration_count || 0}/{event.max_participants}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-accent">
                        {event.prize_pool ? formatPrizePool(event.prize_pool) : "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative flex justify-end">
                          <button
                            data-action-btn
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowActions(showActions === event.id ? null : event.id);
                            }}
                            className="p-2 rounded-lg hover:bg-muted transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {showActions === event.id && (
                            <div 
                              data-dropdown
                              className="absolute right-0 top-10 w-48 bg-card border border-border rounded-lg shadow-lg z-10"
                            >
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
                                <button 
                                  onClick={() => openStatusModal(event)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                                >
                                  <Play className="w-4 h-4" />
                                  Ubah Status
                                </button>
                                <button 
                                  onClick={() => openDeleteModal(event)}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Hapus
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Status Modal */}
      {showStatusModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Ubah Status Event</h3>
              <button onClick={() => setShowStatusModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-muted-foreground mb-2">
                Event: <span className="font-medium text-foreground">{selectedEvent.title}</span>
              </p>
              <p className="text-muted-foreground mb-4">
                Status saat ini: <Badge className={statusConfig[selectedEvent.status]?.class || "bg-muted"}>{statusConfig[selectedEvent.status]?.label || selectedEvent.status}</Badge>
              </p>
              
              <label className="block text-sm font-medium mb-2">Status Baru</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
              >
                <option value="upcoming">Akan Datang</option>
                <option value="live">Berlangsung</option>
                <option value="completed">Selesai</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            {updateError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowStatusModal(false)}>
                Batal
              </Button>
              <Button 
                variant="gradient" 
                className="flex-1" 
                onClick={handleUpdateStatus}
                disabled={isUpdating || newStatus === selectedEvent.status}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-destructive">Hapus Event</h3>
              <button onClick={() => setShowDeleteModal(false)} className="p-2 hover:bg-muted rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Apakah Anda yakin ingin menghapus event <span className="font-medium text-foreground">"{selectedEvent.title}"</span>? 
              Semua data pendaftaran untuk event ini juga akan dihapus. Tindakan ini tidak dapat dibatalkan.
            </p>

            {updateError && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{updateError}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
                Batal
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1" 
                onClick={handleDeleteEvent}
                disabled={isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

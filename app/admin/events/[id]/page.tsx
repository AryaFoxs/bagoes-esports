"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types/database.types";
import {
  Calendar,
  ArrowLeft,
  Edit,
  Loader2,
  MapPin,
  Users,
  Trophy,
  Clock,
  DollarSign,
  Gamepad2,
  Globe,
  CheckCircle,
  Play,
  Pause,
  XCircle,
} from "lucide-react";

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  upcoming: { label: "Akan Datang", class: "bg-primary/20 text-primary", icon: Clock },
  live: { label: "Berlangsung", class: "bg-green-500/20 text-green-500", icon: Play },
  completed: { label: "Selesai", class: "bg-accent/20 text-accent", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", class: "bg-destructive/20 text-destructive", icon: XCircle },
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  if (amount >= 1000000000) return `Rp ${(amount / 1000000000).toFixed(1)}M`;
  if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)} Juta`;
  if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(0)} Ribu`;
  return `Rp ${amount.toLocaleString("id-ID")}`;
};

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [registrationCount, setRegistrationCount] = useState(0);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      setLoading(true);
      
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
        router.push("/admin/events");
        return;
      }

      setEvent(data);

      // Get registration count
      const { count } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId);

      setRegistrationCount(count || 0);
      setLoading(false);
    };

    fetchEvent();
  }, [eventId, supabase, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Event tidak ditemukan</p>
        <Button asChild className="mt-4">
          <Link href="/admin/events">Kembali ke Daftar Event</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[event.status] || statusConfig.upcoming;
  const StatusIcon = status.icon;

  return (
    <div>
      <PageHeader
        title={event.title}
        description="Detail informasi event"
        icon={Calendar}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Event", href: "/admin/events" },
          { label: event.title },
        ]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/events" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </Link>
            </Button>
            <Button variant="gradient" asChild>
              <Link href={`/admin/events/${eventId}/edit`} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Event
              </Link>
            </Button>
          </div>
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Banner */}
          {event.image_url && (
            <Card className="overflow-hidden">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-64 object-cover"
              />
            </Card>
          )}

          {/* Event Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{event.title}</h2>
                <Badge className={status.class}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              <p className="text-muted-foreground mb-6">
                {event.description || "Tidak ada deskripsi"}
              </p>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Gamepad2 className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Game</p>
                    <p className="font-medium">{event.game}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tipe</p>
                    <p className="font-medium capitalize">{event.location_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tanggal Mulai</p>
                    <p className="font-medium">{formatDate(event.start_date)}</p>
                  </div>
                </div>

                {event.end_date && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Selesai</p>
                      <p className="font-medium">{formatDate(event.end_date)}</p>
                    </div>
                  </div>
                )}

                {event.location && event.location_type !== "online" && (
                  <div className="flex items-center gap-3 md:col-span-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lokasi</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rules */}
          {event.rules && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Peraturan</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <pre className="whitespace-pre-wrap font-sans">{event.rules}</pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Statistik</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Peserta</span>
                  </div>
                  <span className="font-semibold">
                    {registrationCount} / {event.max_participants}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total Hadiah</span>
                  </div>
                  <span className="font-semibold text-accent">
                    {formatCurrency(event.prize_pool || 0)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Biaya Daftar</span>
                  </div>
                  <span className="font-semibold">
                    {event.registration_fee ? formatCurrency(event.registration_fee) : "Gratis"}
                  </span>
                </div>

                {event.format && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Format</span>
                    <span className="font-semibold capitalize">
                      {event.format.replace(/_/g, " ")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Aksi</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/admin/events/${eventId}/edit`}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Event
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href={`/event/${event.slug}`} target="_blank">
                    <Globe className="w-4 h-4 mr-2" />
                    Lihat Halaman Publik
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { events } from "@/lib/data";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Globe,
  Wallet,
  Gamepad2,
  Timer,
  UserPlus,
  AlertCircle,
} from "lucide-react";

interface EventDetailProps {
  params: Promise<{ slug: string }>;
}

function EventDetailContent({ slug }: { slug: string }) {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const supabase = useMemo(() => createClient(), []);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  
  // Get event from local data (later will be from database)
  const event = events.find((e) => e.slug === slug);

  // Check if user is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      if (!user || !event || !supabase) return;
      
      const { data, error } = await supabase
        .from("event_registrations")
        .select("status")
        .eq("event_id", event.id)
        .eq("user_id", user.id)
        .single();
      
      if (data && !error) {
        setRegistrationStatus(data.status);
      }
    };

    checkRegistration();
  }, [user, event, supabase]);

  // Get participant count
  useEffect(() => {
    const getParticipantCount = async () => {
      if (!event || !supabase) return;
      
      const { count, error } = await supabase
        .from("event_registrations")
        .select("*", { count: "exact", head: true })
        .eq("event_id", event.id)
        .neq("status", "cancelled");
      
      if (!error && count !== null) {
        setParticipantCount(count);
      }
    };

    getParticipantCount();
  }, [event, supabase]);

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/event/${slug}`);
      return;
    }

    if (!event || !supabase) return;

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_id: event.id,
        user_id: user.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          setRegistrationError("Anda sudah terdaftar untuk event ini");
        } else {
          setRegistrationError(error.message);
        }
      } else {
        setRegistrationSuccess(true);
        setRegistrationStatus("pending");
        setParticipantCount((prev) => prev + 1);
      }
    } catch (err) {
      setRegistrationError("Terjadi kesalahan saat mendaftar");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!user || !event || !supabase) return;

    setIsRegistering(true);

    try {
      const { error } = await supabase
        .from("event_registrations")
        .update({ status: "cancelled" })
        .eq("event_id", event.id)
        .eq("user_id", user.id);

      if (!error) {
        setRegistrationStatus("cancelled");
        setParticipantCount((prev) => Math.max(0, prev - 1));
      }
    } finally {
      setIsRegistering(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event tidak ditemukan</h1>
          <Button asChild>
            <Link href="/event">Kembali ke daftar event</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isRegistered = registrationStatus && registrationStatus !== "cancelled";
  const isFull = participantCount >= event.maxParticipants;
  const canRegister = event.status === "upcoming" && !isRegistered && !isFull;

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

  const getRegistrationStatusBadge = () => {
    switch (registrationStatus) {
      case "pending":
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="w-3 h-3" />
            Menunggu Konfirmasi
          </Badge>
        );
      case "confirmed":
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Terdaftar
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" />
            Ditolak
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="gap-1">
            Dibatalkan
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/event" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Image */}
            <div className="aspect-video rounded-2xl overflow-hidden bg-muted relative">
              {event.image ? (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 gradient-primary flex items-center justify-center">
                  <Trophy className="w-24 h-24 text-white/50" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {getStatusBadge(event.status)}
                <Badge variant="game">{event.game}</Badge>
                {event.isOnline && (
                  <Badge variant="outline" className="gap-1">
                    <Globe className="w-3 h-3" />
                    Online
                  </Badge>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {event.title}
              </h1>
              <p className="text-muted-foreground text-lg">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Detail Event</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal</p>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Lokasi</p>
                      <p className="font-medium">{event.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Gamepad2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Game</p>
                      <p className="font-medium">{event.game}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peserta</p>
                      <p className="font-medium">
                        {participantCount}/{event.maxParticipants}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Hadiah
                      </p>
                      <p className="font-medium text-accent">
                        {event.prizePool || "TBA"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Timer className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tipe</p>
                      <p className="font-medium capitalize">{event.type}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Registration */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Pendaftaran</h2>

                {/* Registration Status */}
                {isRegistered && (
                  <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">
                        Status Pendaftaran
                      </span>
                      {getRegistrationStatusBadge()}
                    </div>
                    {registrationStatus === "confirmed" && (
                      <p className="text-sm text-accent">
                        Anda sudah terdaftar untuk event ini!
                      </p>
                    )}
                    {registrationStatus === "pending" && (
                      <p className="text-sm text-muted-foreground">
                        Pendaftaran Anda sedang diproses oleh panitia.
                      </p>
                    )}
                  </div>
                )}

                {/* Success Message */}
                {registrationSuccess && (
                  <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Pendaftaran Berhasil!</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tunggu konfirmasi dari panitia event.
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {registrationError && (
                  <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Gagal Mendaftar</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {registrationError}
                    </p>
                  </div>
                )}

                {/* Price Info */}
                <div className="mb-6 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Biaya Pendaftaran</span>
                    <span className="font-bold text-lg">
                      {event.prizePool ? "Gratis" : "Gratis"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Slot Tersisa</span>
                    <span className="font-bold">
                      {Math.max(0, event.maxParticipants - participantCount)}
                    </span>
                  </div>
                </div>

                {/* Registration Button */}
                {authLoading ? (
                  <Button disabled className="w-full">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memuat...
                  </Button>
                ) : !user ? (
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={() => router.push(`/login?redirect=/event/${slug}`)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Login untuk Daftar
                  </Button>
                ) : isFull && !isRegistered ? (
                  <Button disabled className="w-full">
                    Kuota Penuh
                  </Button>
                ) : event.status !== "upcoming" ? (
                  <Button disabled className="w-full">
                    Pendaftaran Ditutup
                  </Button>
                ) : isRegistered && registrationStatus !== "cancelled" ? (
                  <div className="space-y-2">
                    <Button disabled variant="outline" className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sudah Terdaftar
                    </Button>
                    {registrationStatus === "pending" && (
                      <Button
                        variant="ghost"
                        className="w-full text-destructive hover:text-destructive"
                        onClick={handleCancelRegistration}
                        disabled={isRegistering}
                      >
                        {isRegistering ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="w-4 h-4 mr-2" />
                        )}
                        Batalkan Pendaftaran
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    {isRegistering ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Daftar Sekarang
                      </>
                    )}
                  </Button>
                )}

                {/* Info */}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Dengan mendaftar, Anda menyetujui syarat dan ketentuan event.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

export default async function EventDetailPage({ params }: EventDetailProps) {
  const { slug } = await params;
  
  return (
    <Suspense fallback={<LoadingState />}>
      <EventDetailContent slug={slug} />
    </Suspense>
  );
}

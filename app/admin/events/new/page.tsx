"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewEventPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    locationType: "online",
    format: "single_elimination",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: 32,
    prizePool: 0,
    registrationFee: 0,
    imageUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase || !user) {
      setError("Anda harus login untuk membuat event");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const slug = generateSlug(formData.title) + "-" + Date.now();
      
      const { error: insertError } = await supabase.from("events").insert({
        title: formData.title,
        slug: slug,
        description: formData.description,
        game: formData.game,
        location_type: formData.locationType,
        format: formData.format,
        start_date: new Date(formData.startDate).toISOString(),
        end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
        location: formData.location || (formData.locationType === "online" ? "Online" : ""),
        max_participants: formData.maxParticipants,
        prize_pool: formData.prizePool,
        registration_fee: formData.registrationFee,
        image_url: formData.imageUrl || null,
        status: "upcoming",
        created_by: user.id,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setError("Event dengan judul ini sudah ada");
        } else {
          setError(insertError.message);
        }
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/events");
        }, 1500);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menyimpan event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tambah Event Baru"
        description="Buat event atau turnamen baru"
        icon={Calendar}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Event", href: "/admin/events" },
          { label: "Tambah Baru" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href="/admin/events" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </Button>
        }
      />

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>Event berhasil dibuat! Mengalihkan...</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Informasi Dasar</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Judul Event *
                    </label>
                    <Input
                      placeholder="Nama event atau turnamen"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Deskripsi *
                    </label>
                    <Textarea
                      placeholder="Deskripsi lengkap event..."
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Game *
                      </label>
                      <select
                        value={formData.game}
                        onChange={(e) =>
                          setFormData({ ...formData, game: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                        required
                      >
                        <option value="">Pilih Game</option>
                        <option value="Valorant">Valorant</option>
                        <option value="Mobile Legends">Mobile Legends</option>
                        <option value="PUBG Mobile">PUBG Mobile</option>
                        <option value="Free Fire">Free Fire</option>
                        <option value="Dota 2">Dota 2</option>
                        <option value="League of Legends">League of Legends</option>
                        <option value="Counter-Strike 2">Counter-Strike 2</option>
                        <option value="eFootball">eFootball</option>
                        <option value="Multi-Game">Multi-Game</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tipe Lokasi *
                      </label>
                      <select
                        value={formData.locationType}
                        onChange={(e) =>
                          setFormData({ ...formData, locationType: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tanggal Mulai *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({ ...formData, startDate: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tanggal Selesai
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Detail Turnamen</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Format
                      </label>
                      <select
                        value={formData.format}
                        onChange={(e) =>
                          setFormData({ ...formData, format: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="single_elimination">
                          Single Elimination
                        </option>
                        <option value="double_elimination">
                          Double Elimination
                        </option>
                        <option value="round_robin">Round Robin</option>
                        <option value="swiss">Swiss System</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Maksimal Peserta
                      </label>
                      <Input
                        type="number"
                        min="2"
                        value={formData.maxParticipants}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxParticipants: parseInt(e.target.value) || 32,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Total Hadiah (Rp)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.prizePool || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, prizePool: parseInt(e.target.value) || 0 })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Biaya Pendaftaran (Rp)
                      </label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0 untuk gratis"
                        value={formData.registrationFee || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationFee: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      URL Gambar Event
                    </label>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.imageUrl}
                      onChange={(e) =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Masukkan URL gambar untuk banner event
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Lokasi</h3>
                <div className="space-y-4">
                  {formData.locationType !== "online" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Alamat Venue
                      </label>
                      <Input
                        placeholder="Alamat lengkap venue"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                  )}
                  {formData.locationType === "online" && (
                    <p className="text-sm text-muted-foreground">
                      Event akan dilaksanakan secara online
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Publikasi</h3>
                <div className="space-y-4">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full gap-2"
                    disabled={isSubmitting || success}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Simpan Event
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/events")}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

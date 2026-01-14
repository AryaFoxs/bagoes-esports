"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { createClient } from "@/lib/supabase/client";
import type { Event } from "@/lib/types/database.types";
import {
  Calendar,
  Save,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  Upload,
  X,
  Plus,
} from "lucide-react";

// Category options for events
const categoryOptions = [
  { value: "Tournament", label: "Tournament" },
  { value: "Workshop", label: "Workshop" },
  { value: "Webinar", label: "Webinar" },
  { value: "Meet Up", label: "Meet Up" },
  { value: "Bootcamp", label: "Bootcamp" },
  { value: "Exhibition", label: "Exhibition" },
];

// Game options
const gameOptions = [
  "Valorant",
  "Mobile Legends",
  "PUBG Mobile",
  "Free Fire",
  "Dota 2",
  "League of Legends",
  "Counter-Strike 2",
  "eFootball",
  "Multi-Game",
  "General",
];

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const eventId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    categories: [] as string[], // Multiple categories
    games: [] as string[], // Multiple games
    locationType: "online",
    format: "single_elimination",
    startDate: "",
    endDate: "",
    location: "",
    maxParticipants: 32,
    prizePool: 0,
    registrationFee: 0,
    imageUrl: "",
    rules: "",
    status: "upcoming",
  });

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      if (error || !data) {
        console.error("Error fetching event:", error);
        router.push("/admin/events");
        return;
      }

      // Parse game field - could be single value or comma-separated
      const games = data.game ? data.game.split(",").map((g: string) => g.trim()) : [];
      
      // For now, use game as category too (we'll improve this later)
      const categories = data.format ? [categoryOptions.find(c => c.value.toLowerCase() === data.format)?.value || "Tournament"] : ["Tournament"];

      setFormData({
        title: data.title || "",
        description: data.description || "",
        categories: categories,
        games: games,
        locationType: data.location_type || "online",
        format: data.format || "single_elimination",
        startDate: data.start_date ? new Date(data.start_date).toISOString().slice(0, 16) : "",
        endDate: data.end_date ? new Date(data.end_date).toISOString().slice(0, 16) : "",
        location: data.location || "",
        maxParticipants: data.max_participants || 32,
        prizePool: data.prize_pool || 0,
        registrationFee: data.registration_fee || 0,
        imageUrl: data.image_url || "",
        rules: data.rules || "",
        status: data.status || "upcoming",
      });

      setLoading(false);
    };

    fetchEvent();
  }, [eventId, supabase, router]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError(null);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `event-${eventId}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("events")
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // If bucket doesn't exist, show friendly error
        if (uploadError.message.includes("Bucket not found")) {
          setError("Storage belum dikonfigurasi. Silakan buat bucket 'events' di Supabase Storage.");
        } else {
          setError(uploadError.message);
        }
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("events")
        .getPublicUrl(fileName);

      setFormData({ ...formData, imageUrl: publicUrl });
    } catch (err) {
      setError("Gagal mengupload gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("events")
        .update({
          title: formData.title,
          description: formData.description,
          game: formData.games.join(", "), // Store as comma-separated
          location_type: formData.locationType,
          format: formData.format,
          start_date: new Date(formData.startDate).toISOString(),
          end_date: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          location: formData.location || (formData.locationType === "online" ? "Online" : ""),
          max_participants: formData.maxParticipants,
          prize_pool: formData.prizePool,
          registration_fee: formData.registrationFee,
          image_url: formData.imageUrl || null,
          rules: formData.rules || null,
          status: formData.status,
        })
        .eq("id", eventId);

      if (updateError) {
        setError(updateError.message);
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

  // Add/remove game
  const addGame = (game: string) => {
    if (!formData.games.includes(game)) {
      setFormData({ ...formData, games: [...formData.games, game] });
    }
  };

  const removeGame = (game: string) => {
    setFormData({ ...formData, games: formData.games.filter(g => g !== game) });
  };

  // Add/remove category
  const addCategory = (category: string) => {
    if (!formData.categories.includes(category)) {
      setFormData({ ...formData, categories: [...formData.categories, category] });
    }
  };

  const removeCategory = (category: string) => {
    setFormData({ ...formData, categories: formData.categories.filter(c => c !== category) });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Event"
        description="Ubah informasi event"
        icon={Calendar}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Event", href: "/admin/events" },
          { label: "Edit" },
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
            <span>Event berhasil diperbarui! Mengalihkan...</span>
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
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </div>

                  {/* Categories (Multiple) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Kategori Event
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {cat}
                          <button
                            type="button"
                            onClick={() => removeCategory(cat)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value) addCategory(e.target.value);
                        e.target.value = "";
                      }}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="">+ Tambah Kategori</option>
                      {categoryOptions
                        .filter(opt => !formData.categories.includes(opt.value))
                        .map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Games (Multiple) */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Game
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.games.map((game) => (
                        <span
                          key={game}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm"
                        >
                          {game}
                          <button
                            type="button"
                            onClick={() => removeGame(game)}
                            className="hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <select
                      onChange={(e) => {
                        if (e.target.value) addGame(e.target.value);
                        e.target.value = "";
                      }}
                      className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                    >
                      <option value="">+ Tambah Game</option>
                      {gameOptions
                        .filter(g => !formData.games.includes(g))
                        .map((game) => (
                          <option key={game} value={game}>
                            {game}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tipe Lokasi *
                      </label>
                      <select
                        value={formData.locationType}
                        onChange={(e) => setFormData({ ...formData, locationType: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="upcoming">Akan Datang</option>
                        <option value="live">Berlangsung</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
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
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Detail Event</h3>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Format
                      </label>
                      <select
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="single_elimination">Single Elimination</option>
                        <option value="double_elimination">Double Elimination</option>
                        <option value="round_robin">Round Robin</option>
                        <option value="swiss">Swiss System</option>
                        <option value="presentation">Presentasi</option>
                        <option value="workshop">Workshop</option>
                        <option value="networking">Networking</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Maksimal Peserta
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={formData.maxParticipants}
                        onChange={(e) => setFormData({
                          ...formData,
                          maxParticipants: parseInt(e.target.value) || 32,
                        })}
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
                        onChange={(e) => setFormData({
                          ...formData,
                          prizePool: parseInt(e.target.value) || 0,
                        })}
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
                        onChange={(e) => setFormData({
                          ...formData,
                          registrationFee: parseInt(e.target.value) || 0,
                        })}
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Gambar Event
                    </label>
                    <div className="space-y-3">
                      {formData.imageUrl && (
                        <div className="relative inline-block">
                          <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="h-32 rounded-lg object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: "" })}
                            className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImage}
                          className="gap-2"
                        >
                          {uploadingImage ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Upload Gambar
                        </Button>
                        <span className="text-sm text-muted-foreground self-center">
                          atau masukkan URL:
                        </span>
                      </div>
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Peraturan Event
                    </label>
                    <Textarea
                      placeholder="Tuliskan peraturan event..."
                      className="min-h-[150px]"
                      value={formData.rules}
                      onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    />
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
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                <h3 className="font-bold mb-4">Simpan Perubahan</h3>
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
                        Simpan Perubahan
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

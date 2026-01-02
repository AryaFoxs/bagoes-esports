"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/admin/PageHeader";
import { Calendar, Save, ArrowLeft } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    game: "",
    type: "tournament",
    format: "single_elimination",
    date: "",
    endDate: "",
    location: "",
    isOnline: true,
    maxTeams: 32,
    prizePool: "",
    registrationFee: "",
    rules: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    router.push("/admin/events");
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
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tipe Event *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({ ...formData, type: e.target.value })
                        }
                        className="w-full h-11 px-4 rounded-lg border border-border bg-background text-sm"
                      >
                        <option value="tournament">Turnamen</option>
                        <option value="casual">Kasual</option>
                        <option value="workshop">Workshop</option>
                        <option value="meetup">Meetup</option>
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
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Tanggal Selesai *
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        required
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
                        Maksimal Tim
                      </label>
                      <Input
                        type="number"
                        value={formData.maxTeams}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxTeams: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Total Hadiah
                      </label>
                      <Input
                        placeholder="Rp 50.000.000"
                        value={formData.prizePool}
                        onChange={(e) =>
                          setFormData({ ...formData, prizePool: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Biaya Pendaftaran
                      </label>
                      <Input
                        placeholder="Gratis atau Rp 100.000"
                        value={formData.registrationFee}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            registrationFee: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Peraturan
                    </label>
                    <Textarea
                      placeholder="Aturan dan ketentuan turnamen..."
                      className="min-h-[150px]"
                      value={formData.rules}
                      onChange={(e) =>
                        setFormData({ ...formData, rules: e.target.value })
                      }
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
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isOnline"
                      checked={formData.isOnline}
                      onChange={(e) =>
                        setFormData({ ...formData, isOnline: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <label htmlFor="isOnline" className="text-sm">
                      Event Online
                    </label>
                  </div>
                  {!formData.isOnline && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lokasi
                      </label>
                      <Input
                        placeholder="Alamat venue"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
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
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Menyimpan..." : "Simpan Event"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/admin/events")}
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

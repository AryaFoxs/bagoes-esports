"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, ArrowLeft, Upload, Save, Users } from "lucide-react";
import Link from "next/link";

export default function CreateTeamPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    game: "",
    description: "",
    region: "",
    isRecruiting: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((res) => setTimeout(res, 1000));
    router.push("/dashboard/teams");
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Buat Tim Baru</h1>
            <p className="text-muted-foreground">Buat tim esports Anda sendiri</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/teams">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Informasi Tim</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Nama Tim *
                    </label>
                    <Input
                      placeholder="Nama tim Anda"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

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
                      Deskripsi
                    </label>
                    <Textarea
                      placeholder="Deskripsi tim Anda..."
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Region
                    </label>
                    <Input
                      placeholder="Jakarta, Indonesia"
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRecruiting"
                      checked={formData.isRecruiting}
                      onChange={(e) =>
                        setFormData({ ...formData, isRecruiting: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-border accent-primary"
                    />
                    <label htmlFor="isRecruiting" className="text-sm">
                      Buka rekrutmen anggota baru
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Logo Tim</h3>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload logo tim
                  </p>
                  <Button variant="outline" size="sm">
                    Pilih File
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Tindakan</h3>
                <div className="space-y-3">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Membuat..." : "Buat Tim"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.push("/dashboard/teams")}
                  >
                    Batal
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Tips
                </h3>
                <p className="text-sm text-muted-foreground">
                  Setelah membuat tim, Anda bisa mengundang anggota lain
                  untuk bergabung melalui halaman manajemen tim.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}

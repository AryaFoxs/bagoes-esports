"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { Image, Upload, Trash2, Download, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";

const mediaItems = [
  { id: "1", name: "event-banner-1.jpg", type: "image", size: "2.4 MB", date: "2026-01-10" },
  { id: "2", name: "team-logo-phoenix.png", type: "image", size: "156 KB", date: "2026-01-08" },
  { id: "3", name: "tournament-promo.mp4", type: "video", size: "15.2 MB", date: "2026-01-05" },
  { id: "4", name: "hero-background.jpg", type: "image", size: "3.1 MB", date: "2026-01-03" },
  { id: "5", name: "player-avatar.png", type: "image", size: "89 KB", date: "2026-01-02" },
  { id: "6", name: "sponsor-logo.svg", type: "image", size: "24 KB", date: "2026-01-01" },
];

export default function MediaPage() {
  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Kelola gambar, video, dan file media"
        icon={Image}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten", href: "/admin/content" },
          { label: "Media" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2">
            <Upload className="w-4 h-4" />
            Upload File
          </Button>
        }
      />

      {/* Upload Area */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="font-medium mb-2">Drag & drop file di sini</p>
            <p className="text-sm text-muted-foreground mb-4">
              atau klik untuk memilih file
            </p>
            <Button variant="outline">Pilih File</Button>
          </div>
        </CardContent>
      </Card>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Cari media..." className="pl-9" />
          </div>
        </CardContent>
      </Card>

      {/* Media Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <Card key={item.id} className="group overflow-hidden">
            <div className="aspect-square bg-muted flex items-center justify-center relative">
              <Image className="w-12 h-12 text-muted-foreground" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="sm" variant="secondary">
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-3">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.size} • {new Date(item.date).toLocaleDateString("id-ID")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

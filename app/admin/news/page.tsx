"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import { Newspaper, Search, Plus, Edit, Trash2, Eye } from "lucide-react";

const news = [
  {
    id: "1",
    title: "Pengumuman Turnamen Nasional 2026",
    excerpt: "Turnamen esports terbesar tahun ini akan segera dimulai...",
    status: "published",
    date: "2026-01-10",
    views: 2450,
  },
  {
    id: "2",
    title: "Kerjasama dengan Sponsor Baru",
    excerpt: "Kami dengan bangga mengumumkan kemitraan strategis...",
    status: "published",
    date: "2026-01-08",
    views: 1890,
  },
  {
    id: "3",
    title: "Update Sistem Ranking",
    excerpt: "Perubahan besar pada sistem ranking akan diterapkan...",
    status: "draft",
    date: null,
    views: 0,
  },
];

export default function NewsPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <PageHeader
        title="Manajemen Berita"
        description="Kelola berita dan pengumuman"
        icon={Newspaper}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Berita" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Tulis Berita
          </Button>
        }
      />

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari berita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <Badge
                      className={
                        item.status === "published"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {item.status === "published" ? "Publikasi" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{item.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {item.date && (
                      <span>{new Date(item.date).toLocaleDateString("id-ID")}</span>
                    )}
                    <span>{item.views.toLocaleString()} views</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

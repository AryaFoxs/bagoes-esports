"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  FileText,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
} from "lucide-react";

const articles = [
  {
    id: "1",
    title: "Strategi Terbaik untuk Valorant Ranked",
    author: "Admin",
    category: "Tips & Tricks",
    status: "published",
    publishDate: "2026-01-10",
    views: 1250,
  },
  {
    id: "2",
    title: "Update Meta Mobile Legends Patch 2.0",
    author: "Editor",
    category: "Berita",
    status: "published",
    publishDate: "2026-01-08",
    views: 980,
  },
  {
    id: "3",
    title: "Interview dengan Pro Player Indonesia",
    author: "Admin",
    category: "Interview",
    status: "draft",
    publishDate: null,
    views: 0,
  },
];

export default function ArticlesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Manajemen Artikel"
        description="Kelola blog dan artikel website"
        icon={FileText}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Konten", href: "/admin/content" },
          { label: "Artikel" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2" asChild>
            <Link href="/admin/content/articles/new">
              <Plus className="w-4 h-4" />
              Tulis Artikel
            </Link>
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
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
              <option value="published">Dipublikasikan</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Judul</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Tanggal</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Views</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="border-b border-border hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{article.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {article.author} • {article.category}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          article.status === "published"
                            ? "bg-accent/20 text-accent"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {article.status === "published" ? "Dipublikasikan" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {article.publishDate
                        ? new Date(article.publishDate).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm">{article.views.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
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

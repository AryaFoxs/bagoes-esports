"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, FileText, Trash2, ExternalLink } from "lucide-react";

const favorites = [
  {
    id: "1",
    type: "event",
    title: "Valorant Championship Series 2026",
    date: "15 Jan 2026",
    savedAt: "2 hari lalu",
  },
  {
    id: "2",
    type: "article",
    title: "10 Tips Pro untuk Naik Rank di Valorant",
    author: "Admin",
    savedAt: "1 minggu lalu",
  },
  {
    id: "3",
    type: "event",
    title: "MLBB Pro League Season 5",
    date: "20 Jan 2026",
    savedAt: "1 minggu lalu",
  },
  {
    id: "4",
    type: "article",
    title: "Meta Update Mobile Legends Patch Terbaru",
    author: "Editor",
    savedAt: "2 minggu lalu",
  },
];

export default function FavoritesPage() {
  const [filter, setFilter] = useState("all");

  const filteredFavorites = favorites.filter(
    (f) => filter === "all" || f.type === filter
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Favorit</h1>
            <p className="text-muted-foreground">Konten yang Anda simpan</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          onClick={() => setFilter("all")}
        >
          Semua ({favorites.length})
        </Button>
        <Button
          variant={filter === "event" ? "default" : "ghost"}
          onClick={() => setFilter("event")}
        >
          Event ({favorites.filter((f) => f.type === "event").length})
        </Button>
        <Button
          variant={filter === "article" ? "default" : "ghost"}
          onClick={() => setFilter("article")}
        >
          Artikel ({favorites.filter((f) => f.type === "article").length})
        </Button>
      </div>

      {/* Favorites List */}
      <div className="space-y-4">
        {filteredFavorites.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.type === "event"
                        ? "bg-primary/20"
                        : "bg-secondary/20"
                    }`}
                  >
                    {item.type === "event" ? (
                      <Calendar className="w-6 h-6 text-primary" />
                    ) : (
                      <FileText className="w-6 h-6 text-secondary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.type === "event"
                        ? `Tanggal: ${item.date}`
                        : `Oleh: ${item.author}`}
                      {" • "}Disimpan {item.savedAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {item.type === "event" ? "Event" : "Artikel"}
                  </Badge>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={
                        item.type === "event"
                          ? `/event/${item.id}`
                          : `/blog/${item.id}`
                      }
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
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

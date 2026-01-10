"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Heart, 
  Calendar, 
  FileText, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  RefreshCw,
  CheckCircle,
  Trophy,
  Users,
  Newspaper,
} from "lucide-react";

interface Favorite {
  id: string;
  user_id: string;
  item_type: "event" | "article" | "news" | "team";
  item_id: string;
  created_at: string;
  // Joined data
  event?: {
    id: string;
    title: string;
    start_date: string;
    game: string;
    banner_url: string | null;
  };
  article?: {
    id: string;
    title: string;
    excerpt: string;
    author_id: string;
    category: string;
    featured_image: string | null;
  };
  news?: {
    id: string;
    title: string;
    content: string;
    category: string;
  };
  team?: {
    id: string;
    name: string;
    game: string;
    logo_url: string | null;
  };
}

const typeConfig = {
  event: { 
    label: "Event", 
    icon: Calendar, 
    color: "bg-primary/20", 
    iconColor: "text-primary",
    href: (id: string) => `/event/${id}`
  },
  article: { 
    label: "Artikel", 
    icon: FileText, 
    color: "bg-secondary/20", 
    iconColor: "text-secondary",
    href: (id: string) => `/blog/${id}`
  },
  news: { 
    label: "Berita", 
    icon: Newspaper, 
    color: "bg-accent/20", 
    iconColor: "text-accent",
    href: (id: string) => `/news/${id}`
  },
  team: { 
    label: "Tim", 
    icon: Users, 
    color: "bg-warning/20", 
    iconColor: "text-warning",
    href: (id: string) => `/tim/${id}`
  },
};

export default function FavoritesPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [success, setSuccess] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    const { data, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (!error && data) {
      // Fetch related items for each favorite
      const enrichedFavorites = await Promise.all(
        data.map(async (fav: Favorite) => {
          let enriched = { ...fav };
          
          if (fav.item_type === "event") {
            const { data: event } = await supabase
              .from("events")
              .select("id, title, start_date, game, banner_url")
              .eq("id", fav.item_id)
              .single();
            enriched.event = event || undefined;
          } else if (fav.item_type === "article") {
            const { data: article } = await supabase
              .from("articles")
              .select("id, title, excerpt, author_id, category, featured_image")
              .eq("id", fav.item_id)
              .single();
            enriched.article = article || undefined;
          } else if (fav.item_type === "news") {
            const { data: news } = await supabase
              .from("news")
              .select("id, title, content, category")
              .eq("id", fav.item_id)
              .single();
            enriched.news = news || undefined;
          } else if (fav.item_type === "team") {
            const { data: team } = await supabase
              .from("teams")
              .select("id, name, game, logo_url")
              .eq("id", fav.item_id)
              .single();
            enriched.team = team || undefined;
          }
          
          return enriched;
        })
      );
      
      // Filter out favorites where the item was deleted
      const validFavorites = enrichedFavorites.filter(fav => 
        fav.event || fav.article || fav.news || fav.team
      );
      
      setFavorites(validFavorites);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [supabase, user]);

  const handleRemoveFavorite = async (favorite: Favorite) => {
    if (!supabase) return;
    
    setIsDeleting(favorite.id);
    
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favorite.id);
    
    if (!error) {
      setSuccess("Favorit berhasil dihapus");
      setFavorites(favorites.filter(f => f.id !== favorite.id));
      setTimeout(() => setSuccess(null), 3000);
    }
    
    setIsDeleting(null);
  };

  const filteredFavorites = favorites.filter(
    (f) => filter === "all" || f.item_type === filter
  );

  const getItemTitle = (fav: Favorite) => {
    if (fav.event) return fav.event.title;
    if (fav.article) return fav.article.title;
    if (fav.news) return fav.news.title;
    if (fav.team) return fav.team.name;
    return "Item tidak ditemukan";
  };

  const getItemSubtitle = (fav: Favorite) => {
    if (fav.event) return `Tanggal: ${new Date(fav.event.start_date).toLocaleDateString("id-ID")}`;
    if (fav.article) return `Kategori: ${fav.article.category}`;
    if (fav.news) return `Kategori: ${fav.news.category}`;
    if (fav.team) return `Game: ${fav.team.game}`;
    return "";
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return `${Math.floor(diffDays / 7)} minggu lalu`;
  };

  const countByType = (type: string) => favorites.filter(f => f.item_type === type).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Favorit</h1>
              <p className="text-muted-foreground">Konten yang Anda simpan</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchFavorites}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
          <div className="flex items-center gap-2 text-accent">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
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
          Event ({countByType("event")})
        </Button>
        <Button
          variant={filter === "article" ? "default" : "ghost"}
          onClick={() => setFilter("article")}
        >
          Artikel ({countByType("article")})
        </Button>
        <Button
          variant={filter === "news" ? "default" : "ghost"}
          onClick={() => setFilter("news")}
        >
          Berita ({countByType("news")})
        </Button>
        <Button
          variant={filter === "team" ? "default" : "ghost"}
          onClick={() => setFilter("team")}
        >
          Tim ({countByType("team")})
        </Button>
      </div>

      {/* Favorites List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : filteredFavorites.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Belum ada favorit</h3>
            <p className="text-muted-foreground mb-4">
              {filter !== "all" 
                ? `Anda belum menyimpan ${filter} apapun`
                : "Simpan event, artikel, atau konten lainnya yang Anda sukai"}
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" asChild>
                <Link href="/event">Jelajahi Event</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/blog">Baca Artikel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredFavorites.map((item) => {
            const config = typeConfig[item.item_type];
            const IconComponent = config.icon;
            
            return (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color}`}>
                        <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
                      </div>
                      <div>
                        <h3 className="font-bold">{getItemTitle(item)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {getItemSubtitle(item)} • Disimpan {formatRelativeTime(item.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{config.label}</Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={config.href(item.item_id)}>
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive"
                        onClick={() => handleRemoveFavorite(item)}
                        disabled={isDeleting === item.id}
                      >
                        {isDeleting === item.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

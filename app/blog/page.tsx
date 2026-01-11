"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import {
  Search,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Newspaper,
  Lightbulb,
  BarChart3,
  Heart,
  Loader2,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  featured_image: string | null;
  author_id: string;
  read_time: number;
  tags: string[] | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  author?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const categories = [
  { id: "all", label: "Semua", icon: BookOpen },
  { id: "news", label: "Berita", icon: Newspaper },
  { id: "tips", label: "Tips & Trik", icon: Lightbulb },
  { id: "analysis", label: "Analisis", icon: BarChart3 },
  { id: "community", label: "Komunitas", icon: Heart },
];

export default function BlogPage() {
  const supabase = useMemo(() => createClient(), []);
  
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      
      const { data } = await supabase
        .from("articles")
        .select(`
          *,
          author:profiles!articles_author_id_fkey (
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("status", "published")
        .order("created_at", { ascending: false });
      
      if (data) {
        setArticles(data);
      }
      
      setLoading(false);
    };
    
    fetchArticles();
  }, [supabase]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = articles.find(a => a.is_featured) || articles[0];
  const remainingArticles =
    selectedCategory === "all" && !search
      ? filteredArticles.filter(a => a.id !== featuredArticle?.id)
      : filteredArticles;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "news":
        return Newspaper;
      case "tips":
        return Lightbulb;
      case "analysis":
        return BarChart3;
      case "community":
        return Heart;
      default:
        return BookOpen;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "news":
        return "Berita";
      case "tips":
        return "Tips & Trik";
      case "analysis":
        return "Analisis";
      case "community":
        return "Komunitas";
      default:
        return category;
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setSubscribing(true);
    
    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .single();
    
    if (!existing) {
      await supabase.from("newsletter_subscribers").insert({
        email,
        subscribed_at: new Date().toISOString(),
      });
      setSubscribeMessage("Berhasil subscribe! Terima kasih.");
    } else {
      setSubscribeMessage("Email sudah terdaftar.");
    }
    
    setEmail("");
    setSubscribing(false);
    
    setTimeout(() => setSubscribeMessage(""), 3000);
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <BookOpen className="w-3 h-3 mr-1" />
              Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Berita & <span className="gradient-text">Artikel</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Dapatkan update terbaru, tips bermain, analisis mendalam, dan
              cerita inspiratif dari dunia esports.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-6 border-y border-border bg-card/50 sticky top-16 lg:top-20 z-30 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari artikel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={
                      selectedCategory === category.id ? "default" : "ghost"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Featured Article */}
          {selectedCategory === "all" && !search && featuredArticle && (
            <section className="py-12">
              <div className="container mx-auto px-4 lg:px-8">
                <Card hover className="overflow-hidden group">
                  <div className="grid lg:grid-cols-2">
                    <div className="aspect-video lg:aspect-auto bg-gradient-to-br from-primary/30 to-secondary/30 relative">
                      {featuredArticle.featured_image ? (
                        <Image
                          src={featuredArticle.featured_image}
                          alt={featuredArticle.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-24 h-24 text-white/30" />
                        </div>
                      )}
                      <Badge className="absolute top-4 left-4 capitalize">
                        {getCategoryLabel(featuredArticle.category)}
                      </Badge>
                    </div>
                    <CardContent className="p-8 flex flex-col justify-center">
                      <Badge variant="outline" className="w-fit mb-4">
                        Featured
                      </Badge>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {featuredArticle.title}
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          {featuredArticle.author?.full_name || featuredArticle.author?.username || "Anonymous"}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {featuredArticle.read_time || 5} min read
                        </span>
                      </div>
                      <Button variant="gradient" className="w-fit gap-2" asChild>
                        <Link href={`/blog/${featuredArticle.slug || featuredArticle.id}`}>
                          Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </section>
          )}

          {/* Articles Grid */}
          <section className="py-12">
            <div className="container mx-auto px-4 lg:px-8">
              {remainingArticles.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {remainingArticles.map((article) => {
                    const Icon = getCategoryIcon(article.category);
                    return (
                      <Card key={article.id} hover className="overflow-hidden group">
                        <div className="aspect-video bg-muted relative">
                          {article.featured_image ? (
                            <Image
                              src={article.featured_image}
                              alt={article.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <>
                              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Icon className="w-12 h-12 text-white/50" />
                              </div>
                            </>
                          )}
                          <Badge className="absolute top-3 left-3 capitalize">
                            {getCategoryLabel(article.category)}
                          </Badge>
                        </div>
                        <CardContent className="p-5">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                            <span>{article.author?.full_name || article.author?.username || "Anonymous"}</span>
                            <span>•</span>
                            <span>{article.read_time || 5} min read</span>
                          </div>
                          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            <Link href={`/blog/${article.slug || article.id}`}>
                              {article.title}
                            </Link>
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {article.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">
                    Tidak ada artikel ditemukan
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Coba ubah filter atau kata kunci pencarian.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("all");
                    }}
                  >
                    Reset Filter
                  </Button>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0 gradient-primary opacity-10" />

              <div className="relative text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Jangan Ketinggalan Update
                </h2>
                <p className="text-muted-foreground mb-8">
                  Subscribe newsletter kami untuk mendapatkan artikel terbaru
                  langsung di inbox kamu.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Email kamu..."
                    className="flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button variant="gradient" type="submit" disabled={subscribing}>
                    {subscribing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                  </Button>
                </form>
                {subscribeMessage && (
                  <p className="text-sm text-primary mt-4">{subscribeMessage}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  MessageCircle,
  Gamepad2,
  UserPlus,
  Trophy,
  BookOpen,
  Calendar,
  ArrowRight,
  Heart,
  Sparkles,
  Target,
  Loader2,
} from "lucide-react";

interface Community {
  id: string;
  name: string;
  description: string;
  game: string;
  banner_url: string | null;
  logo_url: string | null;
  member_count: number;
  is_open: boolean;
  created_at: string;
}

interface Team {
  id: string;
  name: string;
  game: string;
  logo_url: string | null;
  banner_url: string | null;
  member_count?: number;
  max_members?: number;
  is_recruiting: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  game: string;
  reward: number;
  start_date: string;
  end_date: string;
  status: string;
  target: number;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  featured_image: string | null;
  author_id: string;
  read_time: number;
  created_at: string;
  author?: {
    username: string;
    avatar_url: string | null;
  };
}

export default function KomunitasPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [communities, setCommunities] = useState<Community[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch communities
      const { data: commData } = await supabase
        .from("communities")
        .select("*")
        .eq("is_open", true)
        .order("member_count", { ascending: false })
        .limit(6);
      
      if (commData) setCommunities(commData);
      
      // Fetch teams
      const { data: teamData } = await supabase
        .from("teams")
        .select("*")
        .eq("is_recruiting", true)
        .order("created_at", { ascending: false })
        .limit(4);
      
      if (teamData) {
        // Get member counts for each team
        const teamsWithCounts = await Promise.all(
          teamData.map(async (team: Team) => {
            const { count } = await supabase
              .from("team_members")
              .select("*", { count: "exact", head: true })
              .eq("team_id", team.id);
            return { ...team, member_count: count || 0 };
          })
        );
        setTeams(teamsWithCounts);
      }
      
      // Fetch active challenges
      const { data: challengeData } = await supabase
        .from("challenges")
        .select("*")
        .eq("status", "active")
        .order("end_date", { ascending: true })
        .limit(3);
      
      if (challengeData) setChallenges(challengeData);
      
      // Fetch community articles
      const { data: articleData } = await supabase
        .from("articles")
        .select(`
          *,
          author:profiles!articles_author_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq("category", "community")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (articleData) setArticles(articleData);
      
      setLoading(false);
    };
    
    fetchData();
  }, [supabase]);

  const handleJoinCommunity = async (communityId: string) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    
    setJoining(communityId);
    
    // Check if already member
    const { data: existing } = await supabase
      .from("community_members")
      .select("id")
      .eq("community_id", communityId)
      .eq("user_id", user.id)
      .single();
    
    if (!existing) {
      await supabase.from("community_members").insert({
        community_id: communityId,
        user_id: user.id,
        role: "member",
      });
      
      // Update member count
      const community = communities.find(c => c.id === communityId);
      if (community) {
        setCommunities(communities.map(c => 
          c.id === communityId 
            ? { ...c, member_count: c.member_count + 1 }
            : c
        ));
      }
    }
    
    setJoining(null);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} hari tersisa` : "Berakhir";
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Komunitas
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Komunitas <span className="gradient-text">Esports</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Bergabung dengan komunitas gaming terbesar di Indonesia. Diskusi,
              berbagi strategi, dan temukan teman bermain baru!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/forum">
              <Card hover className="group cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                    <MessageCircle className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Forum Diskusi</h3>
                    <p className="text-sm text-muted-foreground">
                      Diskusi game & strategi
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card hover className="group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <UserPlus className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gabung Komunitas</h3>
                  <p className="text-sm text-muted-foreground">
                    Temukan grup game favorit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Link href="/event">
              <Card hover className="group cursor-pointer">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                    <Sparkles className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Event Komunitas</h3>
                    <p className="text-sm text-muted-foreground">
                      Kegiatan seru bersama
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Komunitas <span className="gradient-text">Populer</span>
              </h2>
              <p className="text-muted-foreground">
                Bergabung dengan komunitas game favoritmu
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : communities.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Belum ada komunitas</h3>
                <p className="text-muted-foreground">Komunitas akan segera tersedia</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} hover className="overflow-hidden group">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                    {community.banner_url ? (
                      <Image
                        src={community.banner_url}
                        alt={community.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Gamepad2 className="w-16 h-16 text-primary/50" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {community.name}
                        </h3>
                        <Badge variant="outline" className="mt-1">
                          {community.game}
                        </Badge>
                      </div>
                      {community.is_open && (
                        <Badge variant="success">Terbuka</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {community.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {community.member_count.toLocaleString()} anggota
                      </div>
                      <Button 
                        size="sm" 
                        variant="gradient"
                        onClick={() => handleJoinCommunity(community.id)}
                        disabled={joining === community.id}
                      >
                        {joining === community.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Gabung"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Tim & <span className="gradient-text">Grup</span>
              </h2>
              <p className="text-muted-foreground">
                Tim esports yang aktif di komunitas
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/tim" className="gap-2">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {teams.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Belum ada tim yang merekrut</h3>
                <p className="text-muted-foreground">Cek kembali nanti</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {teams.map((team) => (
                <Link key={team.id} href={`/tim/${team.id}`}>
                  <Card hover className="text-center group">
                    <CardContent className="p-6">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                        {team.logo_url ? (
                          <Image
                            src={team.logo_url}
                            alt={team.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Trophy className="w-10 h-10 text-primary" />
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                      <Badge variant="outline" className="mb-3">
                        {team.game}
                      </Badge>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        {team.member_count || 0} pemain
                      </div>
                      {team.is_recruiting && (
                        <Badge variant="success" className="mt-3">
                          Rekrutmen Dibuka
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Community Challenges */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Tantangan
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Tantangan <span className="gradient-text">Komunitas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ikuti tantangan seru dan dapatkan reward menarik
            </p>
          </div>

          {challenges.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Belum ada tantangan aktif</h3>
                <p className="text-muted-foreground">Tantangan baru akan segera tersedia</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge, index) => {
                const colors = [
                  { bg: "border-primary/30 bg-gradient-to-br from-primary/5 to-transparent", icon: "gradient-primary", text: "text-primary" },
                  { bg: "border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent", icon: "bg-secondary", text: "text-secondary" },
                  { bg: "border-accent/30 bg-gradient-to-br from-accent/5 to-transparent", icon: "bg-accent", text: "text-accent" },
                ];
                const color = colors[index % 3];
                const icons = [Gamepad2, Trophy, Heart];
                const IconComponent = icons[index % 3];
                
                return (
                  <Card key={challenge.id} className={`overflow-hidden ${color.bg}`}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl ${color.icon} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold">{challenge.title}</h3>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Target</span>
                          <span className={color.text}>{challenge.target}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className={`h-full w-0 ${color.icon} rounded-full`} />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {getDaysRemaining(challenge.end_date)}
                        </div>
                        <Badge variant="success">+{challenge.reward} XP</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Community Articles */}
      {articles.length > 0 && (
        <section className="py-12 lg:py-20 bg-card/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Cerita <span className="gradient-text">Komunitas</span>
                </h2>
                <p className="text-muted-foreground">
                  Kisah inspiratif dari anggota komunitas
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/blog?category=community" className="gap-2">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link key={article.id} href={`/blog/${article.id}`}>
                  <Card hover className="overflow-hidden group">
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
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-primary/40" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-white/60" />
                          </div>
                        </>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{article.author?.username || "Anonymous"}</span>
                        <span>•</span>
                        <span>{article.read_time || 5} min read</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0 gradient-primary opacity-10" />
              <div className="absolute inset-0 bg-grid opacity-10" />

              <div className="relative text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bergabung dengan Komunitas
                </h2>
                <p className="text-muted-foreground mb-8">
                  Daftar sekarang dan mulai berdiskusi, berbagi strategi, dan
                  temukan teman bermain baru!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="gradient" size="lg" asChild>
                    <Link href="/register" className="gap-2">
                      Daftar Sekarang <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/faq">Pelajari Lebih Lanjut</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}

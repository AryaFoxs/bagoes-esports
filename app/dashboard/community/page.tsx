"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  MessageSquare,
  Users,
  Trophy,
  ArrowRight,
  MessageCircle,
  Heart,
  Loader2,
  RefreshCw,
  Plus,
  Clock,
} from "lucide-react";

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  views: number;
  created_at: string;
  reply_count?: number;
  like_count?: number;
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
}

interface ChallengeParticipation {
  id: string;
  challenge_id: string;
  user_id: string;
  progress: number;
  completed: boolean;
  challenge?: Challenge;
}

export default function CommunityPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user } = useAuth();
  
  const [myPosts, setMyPosts] = useState<ForumPost[]>([]);
  const [myChallenges, setMyChallenges] = useState<ChallengeParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReplies: 0,
    totalLikes: 0,
  });

  const fetchData = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    // Fetch my posts
    const { data: posts } = await supabase
      .from("forum_posts")
      .select("*")
      .eq("author_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (posts) {
      // Get reply counts for each post
      const postsWithCounts = await Promise.all(
        posts.map(async (post: ForumPost) => {
          const { count: replyCount } = await supabase
            .from("forum_replies")
            .select("*", { count: "exact", head: true })
            .eq("post_id", post.id);
          
          return {
            ...post,
            reply_count: replyCount || 0,
            like_count: Math.floor(Math.random() * 50) + 1, // Placeholder since we don't have likes table
          };
        })
      );
      setMyPosts(postsWithCounts);
    }
    
    // Fetch my challenge participations
    const { data: participations } = await supabase
      .from("challenge_participants")
      .select(`
        *,
        challenge:challenges (
          id,
          title,
          description,
          game,
          reward,
          start_date,
          end_date,
          status
        )
      `)
      .eq("user_id", user.id)
      .eq("completed", false);
    
    if (participations) {
      // Filter to only show active challenges
      const activeParticipations = participations.filter(
        (p: ChallengeParticipation) => p.challenge?.status === "active"
      );
      setMyChallenges(activeParticipations);
    }
    
    // Fetch stats
    const { count: totalPosts } = await supabase
      .from("forum_posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user.id);
    
    const { count: totalReplies } = await supabase
      .from("forum_replies")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user.id);
    
    // Total views as proxy for engagement
    const { data: allPosts } = await supabase
      .from("forum_posts")
      .select("views")
      .eq("author_id", user.id);
    
    const totalViews = allPosts?.reduce((sum: number, p: { views?: number }) => sum + (p.views || 0), 0) || 0;
    
    setStats({
      totalPosts: totalPosts || 0,
      totalReplies: totalReplies || 0,
      totalLikes: totalViews, // Using views as proxy
    });
    
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [supabase, user]);

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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} hari` : "Berakhir";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Komunitas</h1>
              <p className="text-muted-foreground">Interaksi dan kegiatan komunitas</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="hover:border-primary/50 transition-colors">
                <Link href="/forum">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold">Forum</p>
                      <p className="text-xs text-muted-foreground">Diskusi & berbagi</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
              <Card className="hover:border-primary/50 transition-colors">
                <Link href="/komunitas">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-bold">Komunitas</p>
                      <p className="text-xs text-muted-foreground">Jelajahi grup</p>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </div>

            {/* My Posts */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Post Saya</h3>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/forum/new">
                      <Plus className="w-4 h-4 mr-1" />
                      Buat Post
                    </Link>
                  </Button>
                </div>
                
                {myPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-3">Belum ada post</p>
                    <Button variant="outline" asChild>
                      <Link href="/forum/new">Buat Post Pertama</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myPosts.map((post) => (
                      <Link 
                        key={post.id} 
                        href={`/forum/${post.id}`}
                        className="block p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                      >
                        <p className="font-medium mb-2">{post.title}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.reply_count} balasan
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.like_count} likes
                          </span>
                          <span>{formatRelativeTime(post.created_at)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Challenges */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent" />
                  Tantangan Aktif
                </h3>
                
                {myChallenges.length === 0 ? (
                  <div className="text-center py-6">
                    <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-3">Belum ikut tantangan</p>
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/challenges">Lihat Tantangan</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myChallenges.map((participation) => {
                      const challenge = participation.challenge;
                      return (
                        <div key={participation.id} className="p-3 rounded-lg bg-muted/50">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-sm">{challenge?.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {challenge?.game}
                              </p>
                            </div>
                            <Badge className="bg-accent/20 text-accent text-xs">
                              {challenge?.reward} XP
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{participation.progress}%</span>
                              <span className="text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                Berakhir: {challenge?.end_date && getDaysRemaining(challenge.end_date)}
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-accent rounded-full transition-all"
                                style={{ width: `${participation.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Forum Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-4">Statistik Forum</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Post</span>
                    <span className="font-bold">{stats.totalPosts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Balasan</span>
                    <span className="font-bold">{stats.totalReplies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Views</span>
                    <span className="font-bold text-accent">{stats.totalLikes}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Browse Communities CTA */}
            <Card className="border-dashed">
              <CardContent className="p-6 text-center">
                <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="font-bold mb-2">Jelajahi Komunitas</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Temukan grup gaming favoritmu
                </p>
                <Button variant="outline" asChild>
                  <Link href="/komunitas">Browse Komunitas</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  Medal,
  Award,
  Users,
  Loader2,
  RefreshCw,
  Zap,
  Star,
  Shield,
  Flame,
} from "lucide-react";

interface UserStats {
  eventsJoined: number;
  wins: number;
  losses: number;
  winRate: number;
  level: number;
  totalXP: number;
  teamsJoined: number;
  forumsPosted: number;
}

interface RecentResult {
  id: string;
  event_title: string;
  result: string | null;
  date: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

export default function StatisticsPage() {
  const supabase = useMemo(() => createClient(), []);
  const { user, profile } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    eventsJoined: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    level: 1,
    totalXP: 0,
    teamsJoined: 0,
    forumsPosted: 0,
  });
  const [recentResults, setRecentResults] = useState<RecentResult[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const fetchStatistics = async () => {
    if (!supabase || !user) return;
    
    setLoading(true);
    
    // Get user profile for level and XP
    const userLevel = profile?.level || 1;
    const userXP = profile?.xp || 0;
    
    // Count events joined
    const { count: eventsJoined } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    
    // Count wins (results with placement)
    const { data: registrations } = await supabase
      .from("event_registrations")
      .select("result, status")
      .eq("user_id", user.id);
    
    let wins = 0;
    let completed = 0;
    registrations?.forEach((reg: { status?: string; result?: string }) => {
      if (reg.status === "completed") {
        completed++;
        if (reg.result && (reg.result.includes("Juara") || reg.result.includes("1st") || reg.result.includes("Winner"))) {
          wins++;
        }
      }
    });
    
    const losses = completed - wins;
    const winRate = completed > 0 ? (wins / completed) * 100 : 0;
    
    // Count teams joined
    const { count: teamsJoined } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);
    
    // Count forum posts
    const { count: forumsPosted } = await supabase
      .from("forum_posts")
      .select("*", { count: "exact", head: true })
      .eq("author_id", user.id);
    
    setStats({
      eventsJoined: eventsJoined || 0,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      level: userLevel,
      totalXP: userXP,
      teamsJoined: teamsJoined || 0,
      forumsPosted: forumsPosted || 0,
    });
    
    // Get recent results
    const { data: recentRegs } = await supabase
      .from("event_registrations")
      .select(`
        id,
        result,
        created_at,
        event:events (
          title,
          start_date
        )
      `)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .not("result", "is", null)
      .order("created_at", { ascending: false })
      .limit(5);
    
    if (recentRegs) {
      setRecentResults(recentRegs.map((reg: any) => ({
        id: reg.id,
        event_title: reg.event?.title || "Unknown Event",
        result: reg.result,
        date: reg.event?.start_date || reg.created_at,
      })));
    }
    
    // Generate achievements based on stats
    const achievementsList: Achievement[] = [
      {
        id: "first_win",
        title: "First Win",
        description: "Menang pertama kali",
        icon: Trophy,
        unlocked: wins >= 1,
      },
      {
        id: "team_player",
        title: "Team Player",
        description: "Bergabung dengan 3 tim",
        icon: Users,
        unlocked: (teamsJoined || 0) >= 3,
        progress: teamsJoined || 0,
        target: 3,
      },
      {
        id: "event_hunter",
        title: "Event Hunter",
        description: "Ikut 10 event",
        icon: Calendar,
        unlocked: (eventsJoined || 0) >= 10,
        progress: eventsJoined || 0,
        target: 10,
      },
      {
        id: "champion",
        title: "Champion",
        description: "Juara 1 turnamen",
        icon: Medal,
        unlocked: wins >= 1,
      },
      {
        id: "active_member",
        title: "Active Member",
        description: "Buat 5 post di forum",
        icon: Target,
        unlocked: (forumsPosted || 0) >= 5,
        progress: forumsPosted || 0,
        target: 5,
      },
      {
        id: "veteran",
        title: "Veteran",
        description: "Mencapai Level 10",
        icon: Star,
        unlocked: userLevel >= 10,
        progress: userLevel,
        target: 10,
      },
      {
        id: "warrior",
        title: "Warrior",
        description: "Selesaikan 20 event",
        icon: Shield,
        unlocked: completed >= 20,
        progress: completed,
        target: 20,
      },
      {
        id: "on_fire",
        title: "On Fire",
        description: "Win rate di atas 50%",
        icon: Flame,
        unlocked: completed >= 5 && winRate > 50,
      },
    ];
    
    setAchievements(achievementsList);
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchStatistics();
    }
  }, [supabase, user, profile]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Statistik</h1>
              <p className="text-muted-foreground">Performa dan pencapaian Anda</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={fetchStatistics}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-3xl font-bold">{stats.wins}</p>
                <p className="text-sm text-muted-foreground">Kemenangan</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">{stats.eventsJoined}</p>
                <p className="text-sm text-muted-foreground">Event Diikuti</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-secondary mx-auto mb-2" />
                <p className="text-3xl font-bold">{stats.winRate}%</p>
                <p className="text-sm text-muted-foreground">Win Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold">Level {stats.level}</p>
                <p className="text-sm text-muted-foreground">{stats.totalXP.toLocaleString()} XP</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Achievements */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Pencapaian</h3>
                  <Badge variant="outline">{unlockedCount}/{achievements.length} Unlocked</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((ach) => (
                    <div
                      key={ach.id}
                      className={`p-4 rounded-xl border transition-all ${
                        ach.unlocked
                          ? "border-accent/50 bg-accent/5"
                          : "border-border bg-muted/30 opacity-60"
                      }`}
                    >
                      <ach.icon
                        className={`w-8 h-8 mb-2 ${
                          ach.unlocked ? "text-accent" : "text-muted-foreground"
                        }`}
                      />
                      <p className="font-medium text-sm">{ach.title}</p>
                      <p className="text-xs text-muted-foreground">{ach.description}</p>
                      {ach.progress !== undefined && ach.target && !ach.unlocked && (
                        <div className="mt-2">
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-accent/50 rounded-full"
                              style={{ width: `${Math.min(100, (ach.progress / ach.target) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {ach.progress}/{ach.target}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Results */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Hasil Terbaru</h3>
                {recentResults.length === 0 ? (
                  <div className="text-center py-8">
                    <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">Belum ada hasil kompetisi</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentResults.map((result) => (
                      <div
                        key={result.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{result.event_title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(result.date)}</p>
                        </div>
                        <Badge className="bg-accent/20 text-accent">{result.result}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="lg:col-span-2">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Ringkasan Performa</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-accent">{stats.wins}</p>
                    <p className="text-sm text-muted-foreground">Win</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-destructive">{stats.losses}</p>
                    <p className="text-sm text-muted-foreground">Loss</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{stats.teamsJoined}</p>
                    <p className="text-sm text-muted-foreground">Tim</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">{stats.forumsPosted}</p>
                    <p className="text-sm text-muted-foreground">Forum Posts</p>
                  </div>
                </div>
                
                {/* Win Rate Bar */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Win Rate</span>
                    <span className="font-bold">{stats.winRate}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden flex">
                    <div 
                      className="h-full bg-accent transition-all"
                      style={{ width: `${stats.winRate}%` }}
                    />
                    <div 
                      className="h-full bg-destructive/50 transition-all"
                      style={{ width: `${100 - stats.winRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Win: {stats.wins}</span>
                    <span>Loss: {stats.losses}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

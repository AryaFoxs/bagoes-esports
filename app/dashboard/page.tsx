"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Trophy,
  Calendar,
  Users,
  Star,
  ArrowRight,
  TrendingUp,
  Medal,
  Target,
} from "lucide-react";

// Mock user data
const userData = {
  name: "PlayerOne",
  level: 25,
  xp: 7500,
  xpToNext: 10000,
  rank: "Gold",
  stats: {
    eventsJoined: 15,
    wins: 8,
    teamsJoined: 3,
    forumPosts: 42,
  },
};

const upcomingEvents = [
  {
    id: "1",
    title: "Valorant Championship",
    date: "15 Jan 2026",
    status: "confirmed",
    game: "Valorant",
  },
  {
    id: "2",
    title: "MLBB Weekend Cup",
    date: "18 Jan 2026",
    status: "pending",
    game: "Mobile Legends",
  },
];

const myTeams = [
  { id: "1", name: "Phoenix Rising", game: "Valorant", role: "Captain", members: 5 },
  { id: "2", name: "Dragon Squad", game: "MLBB", role: "Member", members: 6 },
];

const recentActivity = [
  { id: 1, action: "Mendaftar event", detail: "Valorant Championship", time: "2 jam lalu" },
  { id: 2, action: "Bergabung tim", detail: "Dragon Squad", time: "1 hari lalu" },
  { id: 3, action: "Komentar forum", detail: "Tips bermain Valorant", time: "2 hari lalu" },
];

export default function DashboardPage() {
  const xpProgress = (userData.xp / userData.xpToNext) * 100;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Selamat datang kembali, {userData.name}!
            </p>
          </div>
        </div>
      </div>

      {/* Level & XP Card */}
      <Card className="mb-6 overflow-hidden">
        <div className="gradient-primary p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-80">Level Anda</p>
              <p className="text-4xl font-bold">{userData.level}</p>
            </div>
            <Badge className="bg-white/20 text-white border-none text-lg px-4 py-1">
              <Star className="w-4 h-4 mr-1" />
              {userData.rank}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress ke Level {userData.level + 1}</span>
              <span>{userData.xp.toLocaleString()} / {userData.xpToNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.stats.eventsJoined}</p>
              <p className="text-xs text-muted-foreground">Event Diikuti</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.stats.wins}</p>
              <p className="text-xs text-muted-foreground">Kemenangan</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.stats.teamsJoined}</p>
              <p className="text-xs text-muted-foreground">Tim</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userData.stats.forumPosts}</p>
              <p className="text-xs text-muted-foreground">Forum Posts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Event Mendatang</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/events">
                  Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.game} • {event.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      event.status === "confirmed"
                        ? "bg-accent/20 text-accent"
                        : "bg-warning/20 text-warning"
                    }
                  >
                    {event.status === "confirmed" ? "Terkonfirmasi" : "Menunggu"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* My Teams */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Tim Saya</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/teams">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-3">
              {myTeams.map((team) => (
                <div
                  key={team.id}
                  className="p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium">{team.name}</p>
                    <Badge variant="outline">{team.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {team.game} • {team.members} anggota
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/teams/create">Buat Tim Baru</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Aktivitas Terbaru</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="p-4 rounded-lg border border-border"
                >
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-primary text-sm">{activity.detail}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  Medal,
  Award,
} from "lucide-react";

const stats = {
  eventsJoined: 15,
  wins: 8,
  losses: 7,
  winRate: 53.3,
  rank: "Gold",
  level: 25,
  totalXP: 25000,
};

const achievements = [
  { id: "1", title: "First Win", description: "Menang pertama kali", icon: Trophy, unlocked: true },
  { id: "2", title: "Team Player", description: "Bergabung dengan 3 tim", icon: Target, unlocked: true },
  { id: "3", title: "Event Hunter", description: "Ikut 10 event", icon: Calendar, unlocked: true },
  { id: "4", title: "Champion", description: "Juara 1 turnamen", icon: Medal, unlocked: false },
];

const recentResults = [
  { event: "PUBG Mobile Championship", result: "Juara 2", date: "10 Des 2025" },
  { event: "Free Fire Community Cup", result: "Top 8", date: "25 Nov 2025" },
  { event: "Valorant Weekly", result: "Juara 3", date: "18 Nov 2025" },
];

export default function StatisticsPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Statistik</h1>
            <p className="text-muted-foreground">Performa dan pencapaian Anda</p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
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
            <h3 className="font-bold text-lg mb-4">Pencapaian</h3>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((ach) => (
                <div
                  key={ach.id}
                  className={`p-4 rounded-xl border ${
                    ach.unlocked
                      ? "border-accent/50 bg-accent/5"
                      : "border-border bg-muted/30 opacity-50"
                  }`}
                >
                  <ach.icon
                    className={`w-8 h-8 mb-2 ${
                      ach.unlocked ? "text-accent" : "text-muted-foreground"
                    }`}
                  />
                  <p className="font-medium text-sm">{ach.title}</p>
                  <p className="text-xs text-muted-foreground">{ach.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Results */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Hasil Terbaru</h3>
            <div className="space-y-3">
              {recentResults.map((result, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{result.event}</p>
                    <p className="text-xs text-muted-foreground">{result.date}</p>
                  </div>
                  <Badge className="bg-accent/20 text-accent">{result.result}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Win/Loss Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Statistik Pertandingan</h3>
            <div className="h-48 bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Chart akan ditampilkan di sini</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

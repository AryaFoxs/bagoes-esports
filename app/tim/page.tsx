"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { teams, games } from "@/lib/data";
import {
  Trophy,
  Users,
  Search,
  Shield,
  MapPin,
  Calendar,
  Star,
  ChevronRight,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TimPage() {
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState("Semua");
  const [showRecruiting, setShowRecruiting] = useState(false);

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(search.toLowerCase()) ||
      team.description.toLowerCase().includes(search.toLowerCase());
    const matchesGame = selectedGame === "Semua" || team.game === selectedGame;
    const matchesRecruiting = !showRecruiting || team.isRecruiting;

    return matchesSearch && matchesGame && matchesRecruiting;
  });

  const recruitingTeams = teams.filter((t) => t.isRecruiting);

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <Shield className="w-3 h-3 mr-1" />
              Tim Esports
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Tim <span className="gradient-text">Esports</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Temukan tim esports terbaik atau bergabung dengan tim yang sedang
              merekrut anggota baru.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Cari tim..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
              >
                <option value="Semua">Semua Game</option>
                {games.map((game) => (
                  <option key={game} value={game}>
                    {game}
                  </option>
                ))}
              </select>

              <Button
                variant={showRecruiting ? "default" : "outline"}
                onClick={() => setShowRecruiting(!showRecruiting)}
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Rekrutmen Dibuka
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Recruiting Teams Highlight */}
      {recruitingTeams.length > 0 && !showRecruiting && (
        <section id="rekrutmen" className="py-12 bg-gradient-to-r from-accent/10 to-primary/10 border-b border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-accent" />
                <h2 className="text-xl font-bold">Tim yang Membuka Rekrutmen</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecruiting(true)}
              >
                Lihat Semua
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recruitingTeams.slice(0, 3).map((team) => (
                <Card key={team.id} hover className="group">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold group-hover:text-primary transition-colors">
                        {team.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {team.game} • {team.recruitingRoles?.join(", ")}
                      </p>
                    </div>
                    <Button size="sm" variant="success">
                      Apply
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Teams Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <Card key={team.id} hover className="overflow-hidden group">
                {/* Team Banner */}
                <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
                  {team.isRecruiting && (
                    <Badge
                      variant="success"
                      className="absolute top-3 right-3"
                    >
                      Rekrutmen Dibuka
                    </Badge>
                  )}
                </div>

                {/* Team Logo */}
                <div className="relative px-5">
                  <div className="w-20 h-20 rounded-2xl bg-card border-4 border-card -mt-10 relative flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                </div>

                <CardContent className="p-5 pt-3">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
                        {team.name}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {team.game}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {team.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {team.members.length} pemain
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {team.region}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Est. {team.founded}
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      {team.achievements.length} prestasi
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/tim/${team.id}`}>
                        Lihat Profil
                      </Link>
                    </Button>
                    {team.isRecruiting && (
                      <Button variant="gradient" size="sm">
                        Join
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTeams.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tidak ada tim ditemukan</h3>
              <p className="text-muted-foreground mb-6">
                Coba ubah filter atau kata kunci pencarian.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setSelectedGame("Semua");
                  setShowRecruiting(false);
                }}
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Create Team CTA */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0 gradient-primary opacity-10" />
              <div className="absolute inset-0 bg-grid opacity-10" />

              <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Buat Tim Esportsmu Sendiri
                  </h2>
                  <p className="text-muted-foreground">
                    Kumpulkan pemain terbaik, ikuti turnamen, dan raih
                    kesuksesan bersama tim impianmu!
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="gradient" size="lg" asChild>
                    <Link href="/register" className="gap-2">
                      Buat Tim Baru <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/faq">Cara Membuat Tim</Link>
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

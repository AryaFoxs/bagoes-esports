"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { tournaments, leaderboard, games } from "@/lib/data";
import {
  Trophy,
  Calendar,
  Users,
  Search,
  Medal,
  Crown,
  Swords,
  ScrollText,
  ChevronRight,
  Clock,
  DollarSign,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function TurnamenPage() {
  const [selectedGame, setSelectedGame] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");

  const filteredTournaments = tournaments.filter((t) => {
    const matchesGame = selectedGame === "Semua" || t.game === selectedGame;
    const matchesStatus =
      selectedStatus === "Semua" || t.status === selectedStatus;
    return matchesGame && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ongoing":
        return <Badge variant="live">🔴 Berlangsung</Badge>;
      case "upcoming":
        return <Badge variant="default">Akan Datang</Badge>;
      case "completed":
        return <Badge variant="outline">Selesai</Badge>;
      default:
        return null;
    }
  };

  const getFormatLabel = (format: string) => {
    switch (format) {
      case "single_elimination":
        return "Single Elimination";
      case "double_elimination":
        return "Double Elimination";
      case "round_robin":
        return "Round Robin";
      case "swiss":
        return "Swiss System";
      default:
        return format;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge className="mb-4">
              <Swords className="w-3 h-3 mr-1" />
              Turnamen
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Turnamen <span className="gradient-text">Esports</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Jadwal lengkap turnamen esports, pendaftaran, format kompetisi,
              dan hasil pertandingan.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-y border-border bg-card/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-wrap gap-4">
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

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm focus:border-primary focus:outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="ongoing">Berlangsung</option>
              <option value="upcoming">Akan Datang</option>
              <option value="completed">Selesai</option>
            </select>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-2xl font-bold mb-8">Jadwal Turnamen</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                hover
                className="overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-32 md:h-auto bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Trophy className="w-16 h-16 text-primary/50" />
                  </div>
                  <CardContent className="flex-1 p-5">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getStatusBadge(tournament.status)}
                      <Badge variant="secondary">{tournament.game}</Badge>
                    </div>
                    <h3 className="font-bold text-xl mb-2 group-hover:text-primary transition-colors">
                      {tournament.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(tournament.date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {tournament.currentTeams}/{tournament.maxTeams} tim
                      </div>
                      <div className="flex items-center gap-2">
                        <ScrollText className="w-4 h-4" />
                        {getFormatLabel(tournament.format)}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {tournament.prizePool}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {tournament.status === "upcoming" && (
                        <Button variant="gradient" size="sm" className="gap-1">
                          Daftar <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          {filteredTournaments.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Tidak ada turnamen</h3>
              <p className="text-muted-foreground">
                Coba ubah filter untuk melihat turnamen lainnya.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Rules & Format Section */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <ScrollText className="w-3 h-3 mr-1" />
              Format & Aturan
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Format <span className="gradient-text">Kompetisi</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pelajari berbagai format turnamen yang digunakan
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Single Elimination",
                description: "Kalah sekali langsung gugur",
                icon: Swords,
              },
              {
                title: "Double Elimination",
                description: "Kesempatan kedua dari lower bracket",
                icon: Trophy,
              },
              {
                title: "Round Robin",
                description: "Setiap tim bertemu semua lawan",
                icon: Users,
              },
              {
                title: "Swiss System",
                description: "Bertemu lawan dengan poin serupa",
                icon: ScrollText,
              },
            ].map((format) => (
              <Card key={format.title} className="text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/20 flex items-center justify-center">
                    <format.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{format.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Section */}
      <section id="leaderboard" className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <Badge className="mb-4">
                <Medal className="w-3 h-3 mr-1" />
                Leaderboard
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Peringkat <span className="gradient-text">Global</span>
              </h2>
              <p className="text-muted-foreground">
                Tim terbaik berdasarkan poin turnamen
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">
                        Tim
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Poin
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        W
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        L
                      </th>
                      <th className="px-6 py-4 text-center text-sm font-semibold">
                        Win Rate
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr
                        key={entry.teamId}
                        className="border-b border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {entry.rank === 1 && (
                              <Crown className="w-5 h-5 text-accent" />
                            )}
                            {entry.rank === 2 && (
                              <Medal className="w-5 h-5 text-gray-400" />
                            )}
                            {entry.rank === 3 && (
                              <Medal className="w-5 h-5 text-amber-700" />
                            )}
                            {entry.rank > 3 && (
                              <span className="w-5 text-center font-bold">
                                {entry.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                              <Trophy className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-semibold">
                              {entry.teamName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-primary">
                            {entry.points}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-accent">
                          {entry.wins}
                        </td>
                        <td className="px-6 py-4 text-center text-destructive">
                          {entry.losses}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {(
                            (entry.wins / (entry.wins + entry.losses)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative p-8 md:p-12 lg:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Siap Berkompetisi?
              </h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
                Daftarkan tim kamu sekarang dan buktikan bahwa kalian yang
                terbaik!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90"
                  asChild
                >
                  <Link href="/register" className="gap-2">
                    Daftar Tim <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/faq">Lihat Panduan</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

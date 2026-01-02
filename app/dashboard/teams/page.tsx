"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Plus,
  Users,
  Settings,
  Crown,
  UserPlus,
  Eye,
  LogOut,
} from "lucide-react";

const myTeams = [
  {
    id: "1",
    name: "Phoenix Rising",
    game: "Valorant",
    role: "Captain",
    members: 5,
    maxMembers: 5,
    isRecruiting: false,
    wins: 12,
    losses: 3,
  },
  {
    id: "2",
    name: "Dragon Squad",
    game: "Mobile Legends",
    role: "Member",
    members: 6,
    maxMembers: 6,
    isRecruiting: false,
    wins: 8,
    losses: 5,
  },
];

const teamInvites = [
  { id: "1", teamName: "Thunder Strike", game: "PUBG Mobile", from: "TeamLeader123" },
  { id: "2", teamName: "Night Owls", game: "Valorant", from: "ProPlayer99" },
];

export default function MyTeamsPage() {
  const [activeTab, setActiveTab] = useState<"teams" | "invites">("teams");

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Tim Saya</h1>
            <p className="text-muted-foreground">Kelola dan bergabung dengan tim</p>
          </div>
        </div>
        <Button variant="gradient" className="gap-2" asChild>
          <Link href="/dashboard/teams/create">
            <Plus className="w-4 h-4" />
            Buat Tim
          </Link>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "teams" ? "default" : "ghost"}
          onClick={() => setActiveTab("teams")}
        >
          Tim Saya ({myTeams.length})
        </Button>
        <Button
          variant={activeTab === "invites" ? "default" : "ghost"}
          onClick={() => setActiveTab("invites")}
        >
          Undangan
          {teamInvites.length > 0 && (
            <Badge variant="destructive" className="ml-2">
              {teamInvites.length}
            </Badge>
          )}
        </Button>
      </div>

      {activeTab === "teams" ? (
        <div className="grid md:grid-cols-2 gap-6">
          {myTeams.map((team) => (
            <Card key={team.id} className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
                {team.role === "Captain" && (
                  <Badge className="absolute top-3 right-3 bg-accent/20 text-accent">
                    <Crown className="w-3 h-3 mr-1" />
                    Captain
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 pt-0 relative">
                <div className="w-16 h-16 rounded-xl bg-card border-4 border-card -mt-8 mb-3 flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{team.game}</p>

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="font-bold">{team.members}/{team.maxMembers}</p>
                    <p className="text-xs text-muted-foreground">Anggota</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="font-bold text-accent">{team.wins}</p>
                    <p className="text-xs text-muted-foreground">W</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <p className="font-bold text-destructive">{team.losses}</p>
                    <p className="text-xs text-muted-foreground">L</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/tim/${team.id}`}>
                      <Eye className="w-4 h-4 mr-1" />
                      Lihat
                    </Link>
                  </Button>
                  {team.role === "Captain" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/teams/${team.id}/manage`}>
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="text-destructive">
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Browse Teams CTA */}
          <Card className="border-dashed flex items-center justify-center min-h-[300px]">
            <div className="text-center p-6">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-bold mb-2">Cari Tim Lain</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Jelajahi tim yang membuka rekrutmen
              </p>
              <Button variant="outline" asChild>
                <Link href="/tim">Browse Tim</Link>
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-4">
          {teamInvites.length > 0 ? (
            teamInvites.map((invite) => (
              <Card key={invite.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                        <UserPlus className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">{invite.teamName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {invite.game} • Dari @{invite.from}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="gradient" size="sm">
                        Terima
                      </Button>
                      <Button variant="ghost" size="sm">
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Tidak ada undangan tim</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

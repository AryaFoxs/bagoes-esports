"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  Trophy,
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Users,
  Shield,
} from "lucide-react";

const teams = [
  {
    id: "1",
    name: "Phoenix Rising",
    game: "Valorant",
    members: 5,
    status: "active",
    isRecruiting: true,
    region: "Jakarta",
    wins: 12,
    losses: 3,
  },
  {
    id: "2",
    name: "Dragon Force",
    game: "Mobile Legends",
    members: 6,
    status: "active",
    isRecruiting: false,
    region: "Bandung",
    wins: 8,
    losses: 5,
  },
  {
    id: "3",
    name: "Thunder Strike",
    game: "PUBG Mobile",
    members: 4,
    status: "inactive",
    isRecruiting: true,
    region: "Surabaya",
    wins: 5,
    losses: 7,
  },
];

export default function TeamsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredTeams = teams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || team.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="Manajemen Tim"
        description="Kelola semua tim esports"
        icon={Trophy}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Tim" },
        ]}
        actions={
          <Button variant="gradient" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Tim
          </Button>
        }
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari tim..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-11 px-4 rounded-lg border border-border bg-background text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Teams Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((team) => (
          <Card key={team.id} className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
              <Badge
                className={`absolute top-3 right-3 ${
                  team.status === "active"
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {team.status === "active" ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>
            <CardContent className="p-5 pt-0 relative">
              <div className="w-16 h-16 rounded-xl bg-card border-4 border-card -mt-8 mb-3 flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-lg">{team.name}</h3>
                  <p className="text-sm text-muted-foreground">{team.game}</p>
                </div>
                {team.isRecruiting && (
                  <Badge className="bg-accent/20 text-accent">Rekrutmen</Badge>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold">{team.members}</p>
                  <p className="text-xs text-muted-foreground">Anggota</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold text-accent">{team.wins}</p>
                  <p className="text-xs text-muted-foreground">Menang</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="font-bold text-destructive">{team.losses}</p>
                  <p className="text-xs text-muted-foreground">Kalah</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/teams/${team.id}`}>
                    <Eye className="w-4 h-4 mr-1" />
                    Detail
                  </Link>
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

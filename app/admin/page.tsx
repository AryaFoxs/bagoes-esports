"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatCard } from "@/components/admin/StatCard";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Trophy,
  TrendingUp,
  ArrowRight,
  Eye,
  UserPlus,
  AlertTriangle,
} from "lucide-react";

// Mock data for dashboard
const recentActivities = [
  {
    id: 1,
    type: "user",
    title: "Pengguna baru terdaftar",
    description: "John Doe mendaftar sebagai anggota baru",
    time: "5 menit lalu",
  },
  {
    id: 2,
    type: "event",
    title: "Pendaftaran event baru",
    description: "Tim Phoenix mendaftar di MLBB Championship",
    time: "15 menit lalu",
  },
  {
    id: 3,
    type: "team",
    title: "Tim baru dibuat",
    description: "Tim Dragon Force bergabung di platform",
    time: "1 jam lalu",
  },
  {
    id: 4,
    type: "report",
    title: "Laporan baru masuk",
    description: "Laporan pelanggaran dari user #1234",
    time: "2 jam lalu",
  },
];

const upcomingEvents = [
  {
    id: "1",
    title: "Valorant Championship Series",
    date: "15 Jan 2026",
    registrations: 24,
    maxTeams: 32,
  },
  {
    id: "2",
    title: "MLBB Pro League Season 5",
    date: "20 Jan 2026",
    registrations: 18,
    maxTeams: 16,
  },
  {
    id: "3",
    title: "PUBG Mobile Weekend Cup",
    date: "25 Jan 2026",
    registrations: 45,
    maxTeams: 64,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Selamat datang di panel admin Bagoes Esports"
        icon={LayoutDashboard}
      />

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Pengguna"
          value="25,430"
          change={{ value: 12, type: "increase" }}
          icon={Users}
        />
        <StatCard
          title="Event Aktif"
          value="15"
          change={{ value: 5, type: "increase" }}
          icon={Calendar}
          iconColor="text-secondary"
          iconBgColor="bg-secondary/20"
        />
        <StatCard
          title="Tim Terdaftar"
          value="348"
          change={{ value: 8, type: "increase" }}
          icon={Trophy}
          iconColor="text-accent"
          iconBgColor="bg-accent/20"
        />
        <StatCard
          title="Pengunjung Hari Ini"
          value="1,234"
          change={{ value: 3, type: "decrease" }}
          icon={TrendingUp}
          iconColor="text-primary"
          iconBgColor="bg-primary/20"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Aktivitas Terbaru</h3>
                <Button variant="ghost" size="sm">
                  Lihat Semua
                </Button>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        activity.type === "user"
                          ? "bg-primary/20"
                          : activity.type === "event"
                          ? "bg-secondary/20"
                          : activity.type === "team"
                          ? "bg-accent/20"
                          : "bg-destructive/20"
                      }`}
                    >
                      {activity.type === "user" && (
                        <UserPlus className="w-5 h-5 text-primary" />
                      )}
                      {activity.type === "event" && (
                        <Calendar className="w-5 h-5 text-secondary" />
                      )}
                      {activity.type === "team" && (
                        <Trophy className="w-5 h-5 text-accent" />
                      )}
                      {activity.type === "report" && (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Events */}
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg">Event Mendatang</h3>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/events">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{event.date}</span>
                      <Badge variant="outline">
                        {event.registrations}/{event.maxTeams}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4">Aksi Cepat</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/admin/events/new">
                    <Calendar className="w-4 h-4" />
                    Tambah Event Baru
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/admin/content/articles/new">
                    <Eye className="w-4 h-4" />
                    Tulis Artikel
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  asChild
                >
                  <Link href="/admin/security/reports">
                    <AlertTriangle className="w-4 h-4" />
                    Lihat Laporan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

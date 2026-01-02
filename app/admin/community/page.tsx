"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/admin/PageHeader";
import { MessageSquare, Users, Trophy, Flag, ArrowRight } from "lucide-react";

const communityStats = [
  { label: "Total Anggota", value: "12,345", icon: Users, color: "text-primary" },
  { label: "Postingan Forum", value: "8,920", icon: MessageSquare, color: "text-secondary" },
  { label: "Tantangan Aktif", value: "5", icon: Trophy, color: "text-accent" },
  { label: "Laporan Pending", value: "12", icon: Flag, color: "text-destructive" },
];

const recentTopics = [
  { id: "1", title: "Tips bermain Valorant untuk pemula", author: "JohnDoe", replies: 45, time: "10 menit lalu" },
  { id: "2", title: "Diskusi meta MLBB Season terbaru", author: "GamerPro", replies: 78, time: "1 jam lalu" },
  { id: "3", title: "Cari team untuk turnamen weekend", author: "NewPlayer", replies: 23, time: "2 jam lalu" },
];

export default function CommunityPage() {
  return (
    <div>
      <PageHeader
        title="Manajemen Komunitas"
        description="Kelola forum, anggota, dan kegiatan komunitas"
        icon={MessageSquare}
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Komunitas" },
        ]}
      />

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {communityStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Topics */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Topik Terbaru</h3>
              <Button variant="ghost" size="sm">Lihat Semua</Button>
            </div>
            <div className="space-y-3">
              {recentTopics.map((topic) => (
                <div key={topic.id} className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                  <p className="font-medium text-sm mb-1">{topic.title}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>@{topic.author}</span>
                    <span>{topic.replies} balasan • {topic.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between" asChild>
                <Link href="/admin/community/challenges">
                  Kelola Tantangan <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Moderasi Forum <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                Atur Kategori <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between text-destructive" asChild>
                <Link href="/admin/security/reports">
                  Lihat Laporan <Badge variant="destructive" className="ml-2">12</Badge>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

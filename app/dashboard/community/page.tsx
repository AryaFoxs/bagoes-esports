"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Trophy,
  ArrowRight,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const myCommunities = [
  {
    id: "1",
    name: "Valorant Indonesia",
    members: 15420,
    posts: 3245,
    role: "Member",
    lastActive: "5 menit lalu",
  },
  {
    id: "2",
    name: "MLBB Pro Players",
    members: 8900,
    posts: 1890,
    role: "Member",
    lastActive: "1 jam lalu",
  },
];

const myChallenges = [
  {
    id: "1",
    title: "Weekly Kill Challenge",
    game: "Valorant",
    progress: 75,
    reward: "500 XP",
    endsIn: "2 hari",
  },
  {
    id: "2",
    title: "Win Streak Challenge",
    game: "MLBB",
    progress: 40,
    reward: "1000 XP",
    endsIn: "5 hari",
  },
];

const myPosts = [
  { id: "1", title: "Tips bermain Jett", replies: 23, likes: 45, time: "2 hari lalu" },
  { id: "2", title: "LFG Ranked Jakarta", replies: 12, likes: 18, time: "1 minggu lalu" },
];

export default function CommunityPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Komunitas</h1>
            <p className="text-muted-foreground">Interaksi dan kegiatan komunitas</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Communities */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Komunitas Saya</h3>
                <Button variant="ghost" size="sm">
                  Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {myCommunities.map((community) => (
                  <div
                    key={community.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{community.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {community.members.toLocaleString()} anggota • Aktif{" "}
                          {community.lastActive}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{community.role}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Posts */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Post Saya</h3>
                <Button variant="ghost" size="sm">
                  Buat Post <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {myPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-lg border border-border"
                  >
                    <p className="font-medium mb-2">{post.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post.replies} balasan
                      </span>
                      <span>❤️ {post.likes} likes</span>
                      <span>{post.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Challenges */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Tantangan Aktif
              </h3>
              <div className="space-y-4">
                {myChallenges.map((challenge) => (
                  <div key={challenge.id} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {challenge.game}
                        </p>
                      </div>
                      <Badge className="bg-accent/20 text-accent text-xs">
                        {challenge.reward}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{challenge.progress}%</span>
                        <span className="text-muted-foreground">
                          Berakhir: {challenge.endsIn}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${challenge.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Statistik Forum</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Post</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Balasan</span>
                  <span className="font-bold">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes Diterima</span>
                  <span className="font-bold text-accent">324</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

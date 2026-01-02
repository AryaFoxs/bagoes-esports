import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { communities, teams, articles } from "@/lib/data";
import {
  Users,
  MessageCircle,
  Gamepad2,
  UserPlus,
  Trophy,
  BookOpen,
  Calendar,
  ArrowRight,
  Heart,
  Sparkles,
  Target,
} from "lucide-react";

export default function KomunitasPage() {
  const communityArticles = articles.filter((a) => a.category === "community");

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-12 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Komunitas
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Komunitas <span className="gradient-text">Esports</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Bergabung dengan komunitas gaming terbesar di Indonesia. Diskusi,
              berbagi strategi, dan temukan teman bermain baru!
            </p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 border-y border-border bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card hover className="group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                  <MessageCircle className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Forum Diskusi</h3>
                  <p className="text-sm text-muted-foreground">
                    Diskusi game & strategi
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card hover className="group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <UserPlus className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Gabung Komunitas</h3>
                  <p className="text-sm text-muted-foreground">
                    Temukan grup game favorit
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card hover className="group cursor-pointer">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center group-hover:bg-accent/30 transition-colors">
                  <Sparkles className="w-7 h-7 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Event Komunitas</h3>
                  <p className="text-sm text-muted-foreground">
                    Kegiatan seru bersama
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Komunitas <span className="gradient-text">Populer</span>
              </h2>
              <p className="text-muted-foreground">
                Bergabung dengan komunitas game favoritmu
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.map((community) => (
              <Card key={community.id} hover className="overflow-hidden group">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Gamepad2 className="w-16 h-16 text-primary/50" />
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                        {community.name}
                      </h3>
                      <Badge variant="outline" className="mt-1">
                        {community.game}
                      </Badge>
                    </div>
                    {community.isOpen && (
                      <Badge variant="success">Terbuka</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {community.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {community.memberCount.toLocaleString()} anggota
                    </div>
                    <Button size="sm" variant="gradient">
                      Gabung
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Section */}
      <section className="py-12 lg:py-20 bg-card/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Tim & <span className="gradient-text">Grup</span>
              </h2>
              <p className="text-muted-foreground">
                Tim esports yang aktif di komunitas
              </p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/tim" className="gap-2">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teams.slice(0, 4).map((team) => (
              <Card key={team.id} hover className="text-center group">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trophy className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                  <Badge variant="outline" className="mb-3">
                    {team.game}
                  </Badge>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {team.members.length} pemain
                  </div>
                  {team.isRecruiting && (
                    <Badge variant="success" className="mt-3">
                      Rekrutmen Dibuka
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Challenges */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Target className="w-3 h-3 mr-1" />
              Tantangan
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Tantangan <span className="gradient-text">Komunitas</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ikuti tantangan seru dan dapatkan reward menarik
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Gamepad2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Weekly Challenge</h3>
                    <p className="text-sm text-muted-foreground">Win 10 matches</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-primary">7/10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[70%] gradient-primary rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    3 hari tersisa
                  </div>
                  <Badge variant="success">+500 XP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-secondary/30 bg-gradient-to-br from-secondary/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Tournament Ready</h3>
                    <p className="text-sm text-muted-foreground">Join 3 tournaments</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-secondary">1/3</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[33%] bg-secondary rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    7 hari tersisa
                  </div>
                  <Badge variant="secondary">+1000 XP</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Community Hero</h3>
                    <p className="text-sm text-muted-foreground">Help 5 members</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-accent">5/5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-full bg-accent rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Selesai!</Badge>
                  <Badge className="bg-accent text-accent-foreground">+750 XP</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Articles */}
      {communityArticles.length > 0 && (
        <section className="py-12 lg:py-20 bg-card/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Cerita <span className="gradient-text">Komunitas</span>
                </h2>
                <p className="text-muted-foreground">
                  Kisah inspiratif dari anggota komunitas
                </p>
              </div>
              <Button variant="ghost" asChild>
                <Link href="/blog?category=community" className="gap-2">
                  Lihat Semua <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communityArticles.map((article) => (
                <Card key={article.id} hover className="overflow-hidden group">
                  <div className="aspect-video bg-muted relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 to-primary/40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <BookOpen className="w-12 h-12 text-white/60" />
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span>{article.author.name}</span>
                      <span>•</span>
                      <span>{article.readTime} min read</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {article.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Join CTA */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <Card className="overflow-hidden">
            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="absolute inset-0 gradient-primary opacity-10" />
              <div className="absolute inset-0 bg-grid opacity-10" />

              <div className="relative text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Bergabung dengan Komunitas
                </h2>
                <p className="text-muted-foreground mb-8">
                  Daftar sekarang dan mulai berdiskusi, berbagi strategi, dan
                  temukan teman bermain baru!
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="gradient" size="lg" asChild>
                    <Link href="/register" className="gap-2">
                      Daftar Sekarang <ArrowRight className="w-5 h-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/faq">Pelajari Lebih Lanjut</Link>
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

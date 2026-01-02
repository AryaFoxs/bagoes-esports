import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events, teams, articles, testimonials, stats } from "@/lib/data";
import {
  Trophy,
  Users,
  Calendar,
  Star,
  ArrowRight,
  Play,
  Zap,
  Shield,
  Target,
  ChevronRight,
  Quote,
} from "lucide-react";

export default function Home() {
  const liveEvents = events.filter((e) => e.status === "live");
  const upcomingEvents = events.filter((e) => e.status === "upcoming").slice(0, 3);
  const featuredTeams = teams.slice(0, 4);
  const latestArticles = articles.slice(0, 3);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
          <div className="max-w-4xl mx-auto text-center">
            {/* Live Event Badge */}
            {liveEvents.length > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 mb-8 animate-fade-up">
                <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
                <span className="text-sm font-medium text-destructive">
                  LIVE NOW: {liveEvents[0].title}
                </span>
                <Link href={`/event`} className="text-destructive hover:underline">
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            )}

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up" style={{ animationDelay: "0.1s" }}>
              Platform Esports
              <br />
              <span className="gradient-text text-glow">Terdepan Indonesia</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: "0.2s" }}>
              Kelola turnamen, bangun komunitas, dan raih kemenangan bersama
              ribuan gamers profesional. Mulai petualangan esports-mu sekarang!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: "0.3s" }}>
              <Button variant="gradient" size="xl" asChild>
                <Link href="/register" className="gap-2">
                  Mulai Sekarang
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/turnamen" className="gap-2">
                  <Play className="w-5 h-5" />
                  Lihat Turnamen
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
              {[
                { label: "Total Members", value: stats.totalMembers.toLocaleString() + "+", icon: Users },
                { label: "Tim Esports", value: stats.totalTeams + "+", icon: Shield },
                { label: "Event Digelar", value: stats.totalEvents + "+", icon: Trophy },
                { label: "Total Hadiah", value: stats.totalPrizePool, icon: Target },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 rounded-xl bg-card/50 border border-border backdrop-blur-sm"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold gradient-text">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Live & Upcoming Events Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge variant="default" className="mb-4">
                <Zap className="w-3 h-3 mr-1" />
                Events
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Event <span className="gradient-text">Terbaru</span>
              </h2>
              <p className="text-muted-foreground">
                Temukan dan ikuti event esports yang sedang berlangsung
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/event" className="gap-2">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Live Events */}
          {liveEvents.length > 0 && (
            <div className="mb-8">
              {liveEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden bg-gradient-to-r from-destructive/10 to-primary/10 border-destructive/30 animate-pulse-glow"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="live">🔴 LIVE</Badge>
                            <Badge variant="outline">{event.game}</Badge>
                          </div>
                          <h3 className="text-xl font-bold">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {event.location} • {event.prizePool}
                          </p>
                        </div>
                      </div>
                      <Button variant="gradient" asChild>
                        <Link href={event.streamUrl || "/event"} className="gap-2">
                          <Play className="w-4 h-4" />
                          Tonton Sekarang
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Upcoming Events Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} hover className="overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 gradient-primary opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white/80" />
                  </div>
                  <Badge className="absolute top-3 left-3" variant="secondary">
                    {event.game}
                  </Badge>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                    {event.prizePool && (
                      <Badge variant="success">{event.prizePool}</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teams Preview Section */}
      <section className="py-20 lg:py-32 bg-card/30 relative">
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Tim & Komunitas
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Tim Esports <span className="gradient-text">Terbaik</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Bergabung dengan tim-tim profesional atau bentuk tim impianmu sendiri
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeams.map((team) => (
              <Card key={team.id} hover className="text-center group">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-1">{team.name}</h3>
                  <Badge variant="outline" className="mb-3">
                    {team.game}
                  </Badge>
                  <p className="text-sm text-muted-foreground mb-4">
                    {team.members.length} Pemain • {team.region}
                  </p>
                  {team.isRecruiting && (
                    <Badge variant="success" className="text-xs">
                      🟢 Rekrutmen Dibuka
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link href="/tim" className="gap-2">
                Lihat Semua Tim <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="mb-4">
                <Star className="w-3 h-3 mr-1" />
                Berita
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Berita <span className="gradient-text">Terkini</span>
              </h2>
              <p className="text-muted-foreground">
                Update terbaru dari dunia esports Indonesia
              </p>
            </div>
            <Button variant="ghost" asChild className="mt-4 md:mt-0">
              <Link href="/blog" className="gap-2">
                Lihat Semua <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <Card key={article.id} hover className="overflow-hidden group">
                <div className="aspect-video bg-muted relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/40" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Star className="w-12 h-12 text-white/60" />
                  </div>
                  <Badge className="absolute top-3 left-3 capitalize">
                    {article.category}
                  </Badge>
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

      {/* Testimonials Section */}
      <section className="py-20 lg:py-32 bg-card/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 lg:px-8 relative">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              <Quote className="w-3 h-3 mr-1" />
              Testimoni
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Kata Mereka tentang <span className="gradient-text">Bagoes Esports</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dengarkan pengalaman dari para pemain dan penyelenggara event
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="relative">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div className="flex gap-1 mt-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-accent text-accent"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 lg:py-32 relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 gradient-primary opacity-90" />
            <div className="absolute inset-0 bg-grid opacity-20" />

            <div className="relative p-8 md:p-12 lg:p-16 text-center text-white">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Siap Menjadi Juara?
              </h2>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
                Bergabunglah bersama ribuan gamers Indonesia dan mulai
                perjalanan esports-mu sekarang!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                  asChild
                >
                  <Link href="/register" className="gap-2">
                    Daftar Sekarang
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/kontak">Hubungi Kami</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

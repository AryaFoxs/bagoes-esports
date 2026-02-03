import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Users, Shield, Trophy, Target, ChevronRight } from "lucide-react";
import { stats } from "@/lib/data";

interface HeroSectionProps {
  liveEvent?: {
    title: string;
  };
  stats: {
    totalMembers: number;
    totalTeams: number;
    totalEvents: number;
    totalPrizePool: string;
  };
}

export function HeroSection({ liveEvent, stats }: HeroSectionProps) {
  const statItems = [
    { label: "Total Members", value: stats.totalMembers.toLocaleString() + "+", icon: Users },
    { label: "Tim Esports", value: stats.totalTeams + "+", icon: Shield },
    { label: "Event Digelar", value: stats.totalEvents + "+", icon: Trophy },
    { label: "Total Hadiah", value: stats.totalPrizePool, icon: Target },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live Event Badge */}
          {liveEvent && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/20 border border-destructive/30 mb-8 animate-fade-up">
              <span className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm font-medium text-destructive">
                LIVE NOW: {liveEvent.title}
              </span>
              <Link href={`/event`} className="text-destructive hover:underline">
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-up tracking-tight leading-[1.1]" style={{ animationDelay: "0.1s" }}>
            Platform Esports
            <br />
            <span className="gradient-text text-glow">Terdepan Indonesia</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up leading-relaxed" style={{ animationDelay: "0.2s" }}>
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 mt-16 animate-fade-up" style={{ animationDelay: "0.4s" }}>
            {statItems.map((stat) => (
              <div
                key={stat.label}
                className="p-4 md:p-6 rounded-xl bg-card/50 border border-border backdrop-blur-sm card-hover"
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
  );
}

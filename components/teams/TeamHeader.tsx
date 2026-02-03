import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Calendar, UserPlus, ArrowLeft, Twitter, Instagram, Youtube, MessageCircle, Globe } from "lucide-react";
import type { Team } from "@/types";

interface TeamHeaderProps {
  team: Team;
}

export function TeamHeader({ team }: TeamHeaderProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "twitter": return Twitter;
      case "instagram": return Instagram;
      case "youtube": return Youtube;
      case "discord": return MessageCircle;
      default: return Globe;
    }
  };

  return (
    <>
      <section className="relative h-64 md:h-80 bg-gradient-to-br from-primary/30 to-secondary/30 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="container mx-auto px-4 lg:px-8 relative h-full flex items-end pb-8">
          <Button variant="ghost" size="sm" className="absolute top-8 left-4" asChild>
            <Link href="/tim" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </Button>
        </div>
      </section>

      <section className="relative">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 -mt-16 relative">
            <div className="w-32 h-32 rounded-2xl bg-card border-4 border-background shadow-lg flex items-center justify-center">
              <Shield className="w-16 h-16 text-primary" />
            </div>

            <div className="flex-1 pt-4 md:pt-8">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{team.name}</h1>
                    {team.isRecruiting && (
                      <Badge variant="success">Rekrutmen Dibuka</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                    <Badge variant="secondary">{team.game}</Badge>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {team.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Est. {team.founded}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {team.isRecruiting && (
                    <Button variant="gradient" className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      Join Team
                    </Button>
                  )}
                  <Button variant="outline">Follow</Button>
                </div>
              </div>

              <p className="mt-4 text-muted-foreground max-w-2xl">
                {team.description}
              </p>

              {team.socialLinks && (
                <div className="flex items-center gap-2 mt-4">
                  {Object.entries(team.socialLinks).map(([platform, url]) => {
                    if (!url) return null;
                    const Icon = getSocialIcon(platform);
                    return (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

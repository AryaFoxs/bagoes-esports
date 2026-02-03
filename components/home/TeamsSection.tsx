import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users } from "lucide-react";
import { TeamCard } from "@/components/teams/TeamCard";
import type { Team } from "@/types";

interface TeamsSectionProps {
  featuredTeams: Team[];
}

export function TeamsSection({ featuredTeams }: TeamsSectionProps) {
  return (
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
            <TeamCard key={team.id} team={team} />
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
  );
}

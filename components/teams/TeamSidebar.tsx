import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, ChevronRight } from "lucide-react";
import type { Team } from "@/types";

interface TeamSidebarProps {
  team: Team;
}

export function TeamSidebar({ team }: TeamSidebarProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Statistik Tim</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Anggota</span>
              <span className="font-bold">{team.members.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Pencapaian</span>
              <span className="font-bold">
                {team.achievements.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Game</span>
              <Badge variant="secondary">{team.game}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Region</span>
              <span className="font-bold">{team.region}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Didirikan</span>
              <span className="font-bold">{team.founded}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recruiting */}
      {team.isRecruiting && team.recruitingRoles && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="w-5 h-5 text-accent" />
              <h3 className="font-bold">Posisi Tersedia</h3>
            </div>
            <div className="space-y-2 mb-4">
              {team.recruitingRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-2 p-2 rounded-lg bg-background"
                >
                  <ChevronRight className="w-4 h-4 text-accent" />
                  <span>{role}</span>
                </div>
              ))}
            </div>
            <Button variant="success" className="w-full">
              Apply Now
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Contact */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-bold mb-4">Hubungi Tim</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Tertarik untuk berkolaborasi atau mensponsori tim ini?
          </p>
          <Button variant="outline" className="w-full">
            Kirim Pesan
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

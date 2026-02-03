import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";
import type { Team } from "@/types";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card hover className="text-center group">
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
  );
}

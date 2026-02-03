import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
import type { TeamMember } from "@/types";

interface TeamMembersProps {
  members: TeamMember[];
}

export function TeamMembers({ members }: TeamMembersProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Users className="w-6 h-6 text-primary" />
        Anggota Tim
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((member, index) => (
          <Card key={member.id} hover className="group">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-muted-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{member.nickname}</h3>
                  {index === 0 && (
                    <Badge variant="default" className="text-xs">
                      Captain
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground">
                  {member.name} • {member.country}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

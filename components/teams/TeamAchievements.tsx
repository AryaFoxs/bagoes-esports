import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal } from "lucide-react";
import type { Achievement } from "@/types";

interface TeamAchievementsProps {
  achievements: Achievement[];
}

export function TeamAchievements({ achievements }: TeamAchievementsProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Trophy className="w-6 h-6 text-accent" />
        Pencapaian
      </h2>

      {achievements.length > 0 ? (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Medal className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.tournament}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={
                      achievement.placement === "Champion"
                        ? "success"
                        : "outline"
                    }
                  >
                    {achievement.placement}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(achievement.date).toLocaleDateString(
                      "id-ID",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Belum ada pencapaian yang tercatat.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

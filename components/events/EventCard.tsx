import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Trophy, Play } from "lucide-react";
import type { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isLive?: boolean;
}

export function EventCard({ event, isLive = false }: EventCardProps) {
  if (isLive) {
    return (
      <Card
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
            <Link href={event.streamUrl || "/event"}>
              <Play className="w-4 h-4 mr-2 inline" />
              Tonton Sekarang
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card hover className="overflow-hidden group">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute inset-0 gradient-primary opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-white/80" />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="default">Akan Datang</Badge>
          <Badge variant="game">{event.game}</Badge>
        </div>
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
  );
}

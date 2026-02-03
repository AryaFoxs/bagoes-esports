import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/types";

interface EventsSectionProps {
  liveEvents: Event[];
  upcomingEvents: Event[];
}

export function EventsSection({ liveEvents, upcomingEvents }: EventsSectionProps) {
  return (
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
          <div className="mb-8 space-y-4">
            {liveEvents.map((event) => (
              <EventCard key={event.id} event={event} isLive />
            ))}
          </div>
        )}

        {/* Upcoming Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}

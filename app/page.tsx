import prisma from "@/lib/prisma";
import { testimonials } from "@/lib/data";
import { HeroSection } from "@/components/home/HeroSection";
import { EventsSection } from "@/components/home/EventsSection";
import { TeamsSection } from "@/components/home/TeamsSection";
import { NewsSection } from "@/components/home/NewsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";
import type { Event, Team, Article } from "@/types";

export default async function Home() {
  // Fetch Events
  const allEvents = await prisma.event.findMany({
    orderBy: { startDate: "asc" },
  });

  const liveEvents: Event[] = allEvents
    .filter((e) => e.status === "live")
    .map((e) => ({
      ...e,
      date: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() || "",
      registrationDeadline: e.registrationDeadline?.toISOString() || "",
      image: e.image || "",
      type: e.type as any,
      status: e.status as any,
    })) as any;

  const upcomingEvents: Event[] = allEvents
    .filter((e) => e.status === "upcoming")
    .slice(0, 3)
    .map((e) => ({
      ...e,
      date: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() || "",
      registrationDeadline: e.registrationDeadline?.toISOString() || "",
      image: e.image || "",
      type: e.type as any,
      status: e.status as any,
    })) as any;

  // Fetch Teams
  const dbTeams = await prisma.team.findMany({
    take: 4,
    include: {
      members: true,
      achievements: true,
    },
  });

  const featuredTeams: Team[] = dbTeams.map((t) => ({
    ...t,
    description: t.description || "",
    logo: t.logo || "",
    banner: t.banner || undefined,
    founded: t.founded || "",
    region: t.region || "",
    socialLinks: (t.socialLinks as any) || {},
    members: t.members.map((m) => ({
      id: m.id,
      name: m.nickname || "", // Mapping nickname to name if needed
      nickname: m.nickname || "",
      role: m.role,
      avatar: "", // Need to handle avatar if it's in Profile
      joinedDate: m.joinedAt.toISOString(),
      country: "Indonesia",
    })),
    achievements: t.achievements.map((a) => ({
      ...a,
      date: a.date.toISOString(),
    })),
  })) as any;

  // Fetch Articles
  const dbArticles = await prisma.article.findMany({
    take: 3,
    orderBy: { publishedAt: "desc" },
    include: {
      author: true,
    },
  });

  const latestArticles: Article[] = dbArticles.map((a) => ({
    ...a,
    excerpt: a.excerpt || "",
    content: a.content || "",
    image: a.image || "",
    publishedAt: a.publishedAt.toISOString(),
    category: a.category as any,
    author: {
      id: a.author.id,
      name: a.author.fullName || a.author.username || "Admin",
      avatar: a.author.avatarUrl || "",
    },
  })) as any;

  // Fetch Stats for Hero
  const [totalMembers, totalTeams, totalEvents] = await Promise.all([
    prisma.profile.count(),
    prisma.team.count(),
    prisma.event.count(),
  ]);

  const homeStats = {
    totalMembers: totalMembers || 25000,
    totalTeams: totalTeams || 350,
    totalEvents: totalEvents || 150,
    totalPrizePool: "Rp 2.5 Miliar", // Keeping this static as it's hard to calculate from diverse pools
  };

  return (
    <div className="relative">
      <HeroSection liveEvent={liveEvents[0]} stats={homeStats} />
      
      <EventsSection 
        liveEvents={liveEvents} 
        upcomingEvents={upcomingEvents} 
      />

      <TeamsSection featuredTeams={featuredTeams} />

      <NewsSection latestArticles={latestArticles} />

      <TestimonialsSection testimonials={testimonials} />

      <FinalCTASection />
    </div>
  );
}

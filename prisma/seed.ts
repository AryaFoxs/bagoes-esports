import { PrismaClient, Role, EventType, EventStatus, TournamentFormat } from "@prisma/client";
import { config } from "dotenv";
config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding...");

  // Profiles (Authors & Players)
  const authors = [
    { id: "user-1", username: "rizky", email: "rizky@bagoes.id", fullName: "Rizky Pratama", role: Role.admin, avatarUrl: "/images/authors/rizky.jpg" },
    { id: "user-2", username: "sarah", email: "sarah@bagoes.id", fullName: "Sarah Wijaya", role: Role.user, avatarUrl: "/images/authors/sarah.jpg" },
    { id: "user-3", username: "bimo", email: "bimo@bagoes.id", fullName: "Bimo Aditya", role: Role.user, avatarUrl: "/images/authors/bimo.jpg" },
  ];

  for (const author of authors) {
    await prisma.profile.upsert({
      where: { id: author.id },
      update: {},
      create: author,
    });
  }

  // Events
  const eventsData = [
    {
      id: "evt-001",
      slug: "esports-world-cup-2025",
      title: "Esports World Cup 2025",
      description: "Turnamen global yang mempertemukan tim-tim terbaik dunia dalam berbagai game esports.",
      game: "Multi-Game",
      type: EventType.tournament,
      status: EventStatus.live,
      startDate: new Date("2025-01-02T10:00:00"),
      endDate: new Date("2025-01-10T22:00:00"),
      location: "Riyadh, Saudi Arabia",
      isOnline: false,
      maxParticipants: 64,
      currentParticipants: 64,
      prizePool: "$60,000,000",
      image: "/event/tournament/EWC-2025.webp",
      streamUrl: "https://twitch.tv/esportsworldcup",
      registrationDeadline: new Date("2024-12-25T23:59:00"),
    },
    {
      id: "evt-002",
      slug: "mobile-legends-m7-world-championship",
      title: "Mobile Legends M7 World Championship",
      description: "Kompetisi Mobile Legends tingkat dunia dengan tim-tim terbaik dari setiap region.",
      game: "Mobile Legends",
      type: EventType.tournament,
      status: EventStatus.upcoming,
      startDate: new Date("2026-01-15T09:00:00"),
      endDate: new Date("2026-01-30T22:00:00"),
      location: "Jakarta, Indonesia",
      isOnline: false,
      maxParticipants: 16,
      currentParticipants: 16,
      prizePool: "$3,000,000",
      image: "/event/tournament/Mobile-Legends-M7.jpg",
      registrationDeadline: new Date("2026-01-10T23:59:00"),
    },
  ];

  for (const event of eventsData) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: event,
    });
  }

  // Teams
  const teamsData = [
    {
      id: "team-001",
      name: "Phoenix Esports",
      slug: "phoenix-esports",
      game: "Valorant",
      logo: "/images/teams/phoenix.png",
      banner: "/images/teams/phoenix-banner.jpg",
      description: "Tim Valorant profesional yang telah memenangkan berbagai turnamen nasional dan internasional. Kami berkomitmen untuk menjadi yang terbaik di Asia Tenggara.",
      founded: "2022",
      region: "Jakarta",
      socialLinks: {
        twitter: "https://twitter.com/phoenixesports",
        instagram: "https://instagram.com/phoenixesports",
        youtube: "https://youtube.com/@phoenixesports",
        discord: "https://discord.gg/phoenix",
      },
      isRecruiting: true,
      recruitingRoles: ["Content Creator", "Analyst"],
    },
  ];

  for (const team of teamsData) {
    await prisma.team.upsert({
      where: { id: team.id },
      update: {},
      create: team,
    });
  }

  // Articles
  const articlesData = [
    {
      id: "art-001",
      slug: "valorant-champions-cup-2026-siap-digelar",
      title: "Valorant Champions Cup 2026 Siap Digelar di Jakarta",
      excerpt: "Turnamen Valorant terbesar tahun ini akan mempertemukan 64 tim terbaik dari seluruh Indonesia dengan total hadiah Rp 500 juta.",
      category: "news",
      authorId: "user-1",
      publishedAt: new Date("2025-12-28T10:00:00"),
      image: "/images/articles/vcc2026.jpg",
      tags: ["Valorant", "Tournament", "Esports"],
      readTime: 5,
    },
  ];

  for (const article of articlesData) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {},
      create: article,
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error("SEED ERROR:", e.message || e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

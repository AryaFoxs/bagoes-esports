import type { Event, Tournament, Team, Article, Testimonial, FAQItem, LeaderboardEntry, TeamMember, Community, Achievement } from "@/types";

// ===== EVENTS =====
export const events: Event[] = [
  // === TOURNAMENT EVENTS ===
  {
    id: "evt-001",
    slug: "esports-world-cup-2025",
    title: "Esports World Cup 2025",
    description: "Turnamen global yang mempertemukan tim-tim terbaik dunia dalam berbagai game esports.",
    game: "Multi-Game",
    type: "tournament",
    status: "live",
    date: "2025-01-02T10:00:00",
    endDate: "2025-01-10T22:00:00",
    location: "Riyadh, Saudi Arabia",
    isOnline: false,
    maxParticipants: 64,
    currentParticipants: 64,
    prizePool: "$60,000,000",
    image: "/event/tournament/EWC-2025.webp",
    streamUrl: "https://twitch.tv/esportsworldcup",
    registrationDeadline: "2024-12-25T23:59:00",
  },
  {
    id: "evt-002",
    slug: "mobile-legends-m7-world-championship",
    title: "Mobile Legends M7 World Championship",
    description: "Kompetisi Mobile Legends tingkat dunia dengan tim-tim terbaik dari setiap region.",
    game: "Mobile Legends",
    type: "tournament",
    status: "upcoming",
    date: "2026-01-15T09:00:00",
    endDate: "2026-01-30T22:00:00",
    location: "Jakarta, Indonesia",
    isOnline: false,
    maxParticipants: 16,
    currentParticipants: 16,
    prizePool: "$3,000,000",
    image: "/event/tournament/Mobile-Legends-M7.jpg",
    registrationDeadline: "2026-01-10T23:59:00",
  },
  {
    id: "evt-003",
    slug: "free-fire-world-series-sea-2025",
    title: "Free Fire World Series SEA 2025",
    description: "Turnamen Free Fire terbesar di Asia Tenggara dengan hadiah fantastis.",
    game: "Free Fire",
    type: "tournament",
    status: "upcoming",
    date: "2025-02-01T10:00:00",
    endDate: "2025-02-15T22:00:00",
    location: "Bangkok, Thailand",
    isOnline: false,
    maxParticipants: 24,
    currentParticipants: 20,
    prizePool: "$500,000",
    image: "/event/tournament/FFWS-SEA-2025.webp",
    registrationDeadline: "2025-01-28T23:59:00",
  },
  {
    id: "evt-004",
    slug: "pubg-mobile-global-championship-2025",
    title: "PUBG Mobile Global Championship 2025",
    description: "Kejuaraan dunia PUBG Mobile dengan tim-tim profesional dari seluruh dunia.",
    game: "PUBG Mobile",
    type: "tournament",
    status: "upcoming",
    date: "2025-03-01T10:00:00",
    endDate: "2025-03-20T22:00:00",
    location: "Istanbul, Turkey",
    isOnline: false,
    maxParticipants: 48,
    currentParticipants: 48,
    prizePool: "$4,000,000",
    image: "/event/tournament/PMGC-2025.webp",
    registrationDeadline: "2025-02-25T23:59:00",
  },
  {
    id: "evt-005",
    slug: "mobile-legends-m6-world-championship",
    title: "Mobile Legends M6 World Championship",
    description: "Turnamen M6 yang sudah selesai dengan juara ECHO dari Filipina.",
    game: "Mobile Legends",
    type: "tournament",
    status: "completed",
    date: "2024-12-01T10:00:00",
    endDate: "2024-12-15T22:00:00",
    location: "Kuala Lumpur, Malaysia",
    isOnline: false,
    maxParticipants: 16,
    currentParticipants: 16,
    prizePool: "$2,000,000",
    image: "/event/tournament/Mobile-Legends-M6.png",
    registrationDeadline: "2024-11-25T23:59:00",
  },
  // === KASUAL/CASUAL EVENTS ===
  {
    id: "evt-006",
    slug: "liga-mahasiswa-esports-2025",
    title: "Liga Mahasiswa Esports 2025",
    description: "Kompetisi esports antar universitas untuk membangun komunitas gaming di kampus.",
    game: "Multi-Game",
    type: "casual",
    status: "upcoming",
    date: "2025-02-10T09:00:00",
    endDate: "2025-03-10T18:00:00",
    location: "Online + Final Offline",
    isOnline: true,
    maxParticipants: 200,
    currentParticipants: 156,
    prizePool: "Rp 100.000.000",
    image: "/event/kasual/Liga-Mahasiswa-2025.avif",
    registrationDeadline: "2025-02-05T23:59:00",
  },
  {
    id: "evt-007",
    slug: "liga-pelajar-indonesia-2025",
    title: "Liga Pelajar Indonesia 2025",
    description: "Turnamen esports untuk pelajar SMP dan SMA di seluruh Indonesia.",
    game: "Mobile Legends",
    type: "casual",
    status: "upcoming",
    date: "2025-03-01T10:00:00",
    endDate: "2025-04-15T17:00:00",
    location: "Online",
    isOnline: true,
    maxParticipants: 500,
    currentParticipants: 320,
    prizePool: "Rp 50.000.000",
    image: "/event/kasual/Liga-Pelajar-2025.jpeg",
    registrationDeadline: "2025-02-25T23:59:00",
  },
  {
    id: "evt-008",
    slug: "liga-mahasiswa-esports-2024",
    title: "Liga Mahasiswa Esports 2024",
    description: "Kompetisi tahun lalu yang sukses diikuti oleh 180 kampus.",
    game: "Multi-Game",
    type: "casual",
    status: "completed",
    date: "2024-02-15T09:00:00",
    endDate: "2024-03-20T18:00:00",
    location: "Jakarta",
    isOnline: false,
    maxParticipants: 180,
    currentParticipants: 180,
    prizePool: "Rp 75.000.000",
    image: "/event/kasual/Liga-Mahasiswa-2024.jpg",
    registrationDeadline: "2024-02-10T23:59:00",
  },
  // === MEETUP EVENTS ===
  {
    id: "evt-009",
    slug: "meet-and-greet-onic-esports",
    title: "Meet and Greet ONIC Esports",
    description: "Kesempatan bertemu langsung dengan para pemain ONIC Esports dan dapatkan merchandise eksklusif.",
    game: "Mobile Legends",
    type: "meetup",
    status: "upcoming",
    date: "2025-01-20T14:00:00",
    endDate: "2025-01-20T18:00:00",
    location: "Mal Taman Anggrek, Jakarta",
    isOnline: false,
    maxParticipants: 500,
    currentParticipants: 420,
    image: "/event/meetup/Meet-and-Greet-Onic.jpg",
    registrationDeadline: "2025-01-18T23:59:00",
  },
  {
    id: "evt-010",
    slug: "vct-pacific-fan-meet",
    title: "VCT Pacific Fan Meet",
    description: "Meet and greet dengan pemain-pemain Valorant dari tim VCT Pacific.",
    game: "Valorant",
    type: "meetup",
    status: "upcoming",
    date: "2025-02-05T15:00:00",
    endDate: "2025-02-05T19:00:00",
    location: "Gandaria City, Jakarta",
    isOnline: false,
    maxParticipants: 300,
    currentParticipants: 285,
    image: "/event/meetup/Meet-and-Greet-VCT.jpg",
    registrationDeadline: "2025-02-03T23:59:00",
  },
  {
    id: "evt-011",
    slug: "mobile-legends-community-gathering",
    title: "Mobile Legends Community Gathering",
    description: "Acara gathering komunitas Mobile Legends dengan berbagai aktivitas seru.",
    game: "Mobile Legends",
    type: "meetup",
    status: "upcoming",
    date: "2025-01-28T13:00:00",
    endDate: "2025-01-28T20:00:00",
    location: "Summarecon Mall Bekasi",
    isOnline: false,
    maxParticipants: 400,
    currentParticipants: 350,
    image: "/event/meetup/Meet-and-Greet-Mobile-Legends.jpg",
    registrationDeadline: "2025-01-25T23:59:00",
  },
  // === WORKSHOP EVENTS ===
  {
    id: "evt-012",
    slug: "workshop-art-of-cosplay",
    title: "Workshop: Art of Cosplay",
    description: "Pelajari seni cosplay dari karakter game favorit Anda bersama cosplayer profesional.",
    game: "General",
    type: "workshop",
    status: "upcoming",
    date: "2025-01-25T10:00:00",
    endDate: "2025-01-25T16:00:00",
    location: "Balai Kartini, Jakarta",
    isOnline: false,
    maxParticipants: 100,
    currentParticipants: 78,
    image: "/event/workshop/Art-of-Cosplay.avif",
    registrationDeadline: "2025-01-22T23:59:00",
  },
  {
    id: "evt-013",
    slug: "workshop-branding-in-esports",
    title: "Workshop: Branding in Esports",
    description: "Pelajari strategi branding dan marketing untuk tim esports dari para ahli industri.",
    game: "General",
    type: "workshop",
    status: "upcoming",
    date: "2025-02-08T09:00:00",
    endDate: "2025-02-08T15:00:00",
    location: "Universitas Multimedia Nusantara",
    isOnline: false,
    maxParticipants: 80,
    currentParticipants: 65,
    image: "/event/workshop/Branding-In-Esports.jpg",
    registrationDeadline: "2025-02-05T23:59:00",
  },
  {
    id: "evt-014",
    slug: "workshop-how-to-set-up-the-stage",
    title: "Workshop: How to Set Up The Stage",
    description: "Workshop teknis tentang setup panggung dan production untuk event esports.",
    game: "General",
    type: "workshop",
    status: "upcoming",
    date: "2025-02-15T10:00:00",
    endDate: "2025-02-15T17:00:00",
    location: "ICE BSD City",
    isOnline: false,
    maxParticipants: 60,
    currentParticipants: 45,
    image: "/event/workshop/How-to-Set-Up-The-Stage.jpeg",
    registrationDeadline: "2025-02-12T23:59:00",
  },
  {
    id: "evt-015",
    slug: "workshop-nurturing-leadership-in-esports",
    title: "Workshop: Nurturing Leadership in Esports",
    description: "Kembangkan skill leadership Anda untuk memimpin tim esports menuju kemenangan.",
    game: "General",
    type: "workshop",
    status: "upcoming",
    date: "2025-02-22T09:00:00",
    endDate: "2025-02-22T14:00:00",
    location: "Sari Pan Pacific Hotel",
    isOnline: false,
    maxParticipants: 50,
    currentParticipants: 38,
    image: "/event/workshop/Nurturing-Leadership-in-Esports.jpg",
    registrationDeadline: "2025-02-19T23:59:00",
  },
];

// ===== TOURNAMENTS =====
export const tournaments: Tournament[] = [
  {
    id: "trn-001",
    title: "Valorant Champions Cup 2026",
    game: "Valorant",
    format: "double_elimination",
    status: "ongoing",
    date: "2026-01-02T10:00:00",
    endDate: "2026-01-05T22:00:00",
    prizePool: "Rp 500.000.000",
    maxTeams: 64,
    currentTeams: 64,
    rules: [
      "Format: Double Elimination",
      "Setiap pertandingan Best of 3 (Bo3)",
      "Grand Final Best of 5 (Bo5)",
      "Semua peta dalam pool kompetitif dapat dimainkan",
      "Pemain harus berusia minimal 16 tahun",
    ],
    image: "/images/tournaments/valorant-champions.jpg",
  },
  {
    id: "trn-002",
    title: "MLBB Pro League Season 5",
    game: "Mobile Legends",
    format: "round_robin",
    status: "upcoming",
    date: "2026-01-15T09:00:00",
    endDate: "2026-03-15T22:00:00",
    prizePool: "Rp 300.000.000",
    entryFee: "Gratis",
    maxTeams: 32,
    currentTeams: 28,
    rules: [
      "Format: Round Robin diikuti Playoff",
      "Fase Grup: Best of 2 (Bo2)",
      "Playoff: Best of 5 (Bo5)",
      "Tim harus memiliki minimal 5 pemain",
      "Roster lock setelah pendaftaran ditutup",
    ],
    image: "/images/tournaments/mlbb-pl.jpg",
  },
  {
    id: "trn-003",
    title: "Free Fire Indonesia Masters",
    game: "Free Fire",
    format: "swiss",
    status: "upcoming",
    date: "2026-02-01T10:00:00",
    endDate: "2026-02-15T22:00:00",
    prizePool: "Rp 200.000.000",
    entryFee: "Rp 100.000",
    maxTeams: 48,
    currentTeams: 36,
    rules: [
      "Format: Swiss System",
      "5 ronde Swiss diikuti Final 16 tim",
      "Poin berdasarkan kill dan placement",
      "Squad 4 pemain + 1 cadangan",
    ],
    image: "/images/tournaments/freefire-masters.jpg",
  },
];

// ===== LEADERBOARD =====
export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, teamId: "team-001", teamName: "Phoenix Esports", logo: "/images/teams/phoenix.png", points: 2850, wins: 12, losses: 1 },
  { rank: 2, teamId: "team-002", teamName: "Dragon Warriors", logo: "/images/teams/dragon.png", points: 2720, wins: 11, losses: 2 },
  { rank: 3, teamId: "team-003", teamName: "Shadow Gaming", logo: "/images/teams/shadow.png", points: 2580, wins: 10, losses: 3 },
  { rank: 4, teamId: "team-004", teamName: "Thunder Strike", logo: "/images/teams/thunder.png", points: 2450, wins: 9, losses: 4 },
  { rank: 5, teamId: "team-005", teamName: "Cyber Hunters", logo: "/images/teams/cyber.png", points: 2300, wins: 8, losses: 5 },
  { rank: 6, teamId: "team-006", teamName: "Nova Esports", logo: "/images/teams/nova.png", points: 2180, wins: 7, losses: 6 },
  { rank: 7, teamId: "team-007", teamName: "Apex Legends ID", logo: "/images/teams/apex.png", points: 2050, wins: 6, losses: 7 },
  { rank: 8, teamId: "team-008", teamName: "Vortex Gaming", logo: "/images/teams/vortex.png", points: 1920, wins: 5, losses: 8 },
];

// ===== TEAMS =====
export const teams: Team[] = [
  {
    id: "team-001",
    name: "Phoenix Esports",
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
    members: [
      { id: "m1", name: "Adi Pratama", nickname: "AdiXpro", role: "Captain / Duelist", avatar: "/images/players/adi.jpg", joinedDate: "2022-01-15", country: "Indonesia" },
      { id: "m2", name: "Budi Santoso", nickname: "BudiFlash", role: "Initiator", avatar: "/images/players/budi.jpg", joinedDate: "2022-01-15", country: "Indonesia" },
      { id: "m3", name: "Citra Dewi", nickname: "CitraAce", role: "Controller", avatar: "/images/players/citra.jpg", joinedDate: "2022-03-01", country: "Indonesia" },
      { id: "m4", name: "Deni Wijaya", nickname: "DeniKing", role: "Sentinel", avatar: "/images/players/deni.jpg", joinedDate: "2022-06-01", country: "Indonesia" },
      { id: "m5", name: "Eko Saputra", nickname: "EkoSniper", role: "Duelist", avatar: "/images/players/eko.jpg", joinedDate: "2023-01-15", country: "Indonesia" },
    ],
    achievements: [
      { id: "a1", title: "VCT Challengers Indonesia", tournament: "VCT 2025", date: "2025-10-15", placement: "Champion" },
      { id: "a2", title: "SEA Invitational", tournament: "ESL SEA 2025", date: "2025-08-20", placement: "2nd Place" },
      { id: "a3", title: "Jakarta Esports Cup", tournament: "JEC 2024", date: "2024-12-10", placement: "Champion" },
    ],
  },
  {
    id: "team-002",
    name: "Dragon Warriors",
    game: "Mobile Legends",
    logo: "/images/teams/dragon.png",
    banner: "/images/teams/dragon-banner.jpg",
    description: "Tim Mobile Legends dengan roster berpengalaman dan strategi yang solid. Kami bermain untuk menang!",
    founded: "2021",
    region: "Surabaya",
    socialLinks: {
      twitter: "https://twitter.com/dragonwarriors",
      instagram: "https://instagram.com/dragonwarriors_id",
      youtube: "https://youtube.com/@dragonwarriors",
    },
    isRecruiting: false,
    members: [
      { id: "m6", name: "Fajar Hidayat", nickname: "FajarX", role: "Gold Laner", avatar: "/images/players/fajar.jpg", joinedDate: "2021-05-01", country: "Indonesia" },
      { id: "m7", name: "Gilang Ramadhan", nickname: "GilangOP", role: "Jungler", avatar: "/images/players/gilang.jpg", joinedDate: "2021-05-01", country: "Indonesia" },
      { id: "m8", name: "Hadi Nugroho", nickname: "HadiMVP", role: "Mid Laner", avatar: "/images/players/hadi.jpg", joinedDate: "2021-08-15", country: "Indonesia" },
      { id: "m9", name: "Irfan Maulana", nickname: "IrfanTank", role: "Roamer", avatar: "/images/players/irfan.jpg", joinedDate: "2022-01-01", country: "Indonesia" },
      { id: "m10", name: "Joko Susilo", nickname: "JokoGG", role: "Exp Laner", avatar: "/images/players/joko.jpg", joinedDate: "2022-03-15", country: "Indonesia" },
    ],
    achievements: [
      { id: "a4", title: "MPL Indonesia Season 10", tournament: "MPL ID S10", date: "2024-11-20", placement: "Champion" },
      { id: "a5", title: "MSC 2024", tournament: "Mobile Legends SEA Cup", date: "2024-06-15", placement: "3rd Place" },
    ],
  },
  {
    id: "team-003",
    name: "Shadow Gaming",
    game: "PUBG Mobile",
    logo: "/images/teams/shadow.png",
    description: "Squad PUBG Mobile yang fokus pada rotasi cerdas dan aim yang presisi.",
    founded: "2020",
    region: "Bandung",
    socialLinks: {
      instagram: "https://instagram.com/shadowgaming_id",
      discord: "https://discord.gg/shadow",
    },
    isRecruiting: true,
    recruitingRoles: ["IGL", "Entry Fragger"],
    members: [
      { id: "m11", name: "Kevin Tanaka", nickname: "KevinPro", role: "IGL", avatar: "/images/players/kevin.jpg", joinedDate: "2020-03-01", country: "Indonesia" },
      { id: "m12", name: "Luki Pratama", nickname: "LukiSnipe", role: "Sniper", avatar: "/images/players/luki.jpg", joinedDate: "2020-03-01", country: "Indonesia" },
      { id: "m13", name: "Miko Sanjaya", nickname: "MikoRush", role: "Assaulter", avatar: "/images/players/miko.jpg", joinedDate: "2021-01-15", country: "Indonesia" },
      { id: "m14", name: "Nanda Putra", nickname: "NandaGG", role: "Support", avatar: "/images/players/nanda.jpg", joinedDate: "2021-06-01", country: "Indonesia" },
    ],
    achievements: [
      { id: "a6", title: "PMPL Indonesia Fall", tournament: "PMPL ID Fall 2024", date: "2024-09-30", placement: "Champion" },
    ],
  },
];

// ===== COMMUNITIES =====
export const communities: Community[] = [
  { id: "com-001", name: "Valorant Indonesia", description: "Komunitas terbesar untuk pemain Valorant di Indonesia", game: "Valorant", memberCount: 15000, image: "/images/community/valorant.jpg", isOpen: true },
  { id: "com-002", name: "MLBB Squad Finder", description: "Tempat mencari squad dan teammate untuk bermain MLBB", game: "Mobile Legends", memberCount: 8500, image: "/images/community/mlbb.jpg", isOpen: true },
  { id: "com-003", name: "PUBGM Competitive", description: "Komunitas untuk pemain PUBG Mobile yang ingin berkompetisi", game: "PUBG Mobile", memberCount: 6200, image: "/images/community/pubgm.jpg", isOpen: true },
];

// ===== ARTICLES =====
export const articles: Article[] = [
  {
    id: "art-001",
    slug: "valorant-champions-cup-2026-siap-digelar",
    title: "Valorant Champions Cup 2026 Siap Digelar di Jakarta",
    excerpt: "Turnamen Valorant terbesar tahun ini akan mempertemukan 64 tim terbaik dari seluruh Indonesia dengan total hadiah Rp 500 juta.",
    content: `
      <p>Turnamen esports paling dinanti tahun ini, Valorant Champions Cup 2026, akan resmi dimulai pada 2 Januari 2026 di Jakarta Convention Center. Event ini akan mempertemukan 64 tim terbaik dari seluruh Indonesia.</p>
      
      <h2>Format Kompetisi</h2>
      <p>Kompetisi akan menggunakan format Double Elimination dengan setiap pertandingan menggunakan sistem Best of 3 (Bo3). Grand Final akan berlangsung dengan format Best of 5 (Bo5).</p>
      
      <h2>Prize Pool</h2>
      <p>Total hadiah yang diperebutkan mencapai Rp 500.000.000 dengan distribusi sebagai berikut:</p>
      <ul>
        <li>Juara 1: Rp 250.000.000</li>
        <li>Juara 2: Rp 100.000.000</li>
        <li>Juara 3-4: Rp 50.000.000</li>
        <li>Juara 5-8: Rp 12.500.000</li>
      </ul>
      
      <h2>Tim Favorit</h2>
      <p>Beberapa tim yang difavoritkan untuk memenangkan turnamen ini antara lain Phoenix Esports, yang baru saja memenangkan VCT Challengers Indonesia, serta tim-tim kuat lainnya seperti Nova Esports dan Thunder Strike.</p>
    `,
    category: "news",
    author: { id: "auth-001", name: "Rizky Pratama", avatar: "/images/authors/rizky.jpg" },
    publishedAt: "2025-12-28T10:00:00",
    image: "/images/articles/vcc2026.jpg",
    tags: ["Valorant", "Tournament", "Esports"],
    readTime: 5,
  },
  {
    id: "art-002",
    slug: "tips-naik-rank-valorant-2026",
    title: "10 Tips Ampuh Naik Rank di Valorant 2026",
    excerpt: "Panduan lengkap untuk pemain yang ingin meningkatkan rank mereka di Valorant dengan tips dari pro player.",
    content: `
      <p>Naik rank di Valorant membutuhkan kombinasi antara skill mekanik, game sense, dan kerja sama tim. Berikut adalah 10 tips yang dapat membantu Anda naik rank lebih cepat.</p>
      
      <h2>1. Warming Up Sebelum Bermain</h2>
      <p>Selalu lakukan warming up di practice range selama 15-20 menit sebelum bermain competitive.</p>
      
      <h2>2. Fokus pada 2-3 Agent</h2>
      <p>Daripada bermain semua agent, fokuslah untuk menguasai 2-3 agent dari role berbeda.</p>
      
      <h2>3. Komunikasi dengan Tim</h2>
      <p>Gunakan voice chat untuk memberikan info enemy dan koordinasi strategi.</p>
    `,
    category: "tips",
    author: { id: "auth-002", name: "Sarah Wijaya", avatar: "/images/authors/sarah.jpg" },
    publishedAt: "2025-12-26T14:00:00",
    image: "/images/articles/valorant-tips.jpg",
    tags: ["Valorant", "Tips", "Guide", "Ranked"],
    readTime: 8,
  },
  {
    id: "art-003",
    slug: "analisis-meta-mlbb-season-terbaru",
    title: "Analisis Meta Mobile Legends Season Terbaru",
    excerpt: "Breakdown lengkap tentang hero-hero meta dan strategi yang sedang populer di ranked Mobile Legends.",
    content: `
      <p>Season terbaru Mobile Legends membawa banyak perubahan pada meta game. Mari kita analisis hero-hero yang sedang naik daun.</p>
      
      <h2>Hero Tier S</h2>
      <p>Beberapa hero yang sangat kuat di meta saat ini antara lain...</p>
    `,
    category: "analysis",
    author: { id: "auth-003", name: "Bimo Aditya", avatar: "/images/authors/bimo.jpg" },
    publishedAt: "2025-12-24T09:00:00",
    image: "/images/articles/mlbb-meta.jpg",
    tags: ["Mobile Legends", "Meta", "Analysis"],
    readTime: 10,
  },
  {
    id: "art-004",
    slug: "kisah-sukses-phoenix-esports",
    title: "Kisah Sukses Phoenix Esports: Dari Tim Amatir Menjadi Juara",
    excerpt: "Perjalanan inspiratif tim Phoenix Esports dari komunitas biasa hingga menjadi juara VCT Challengers.",
    content: `
      <p>Phoenix Esports memulai perjalanan mereka pada tahun 2022 sebagai tim amatir yang bermain di turnamen-turnamen kecil...</p>
    `,
    category: "community",
    author: { id: "auth-001", name: "Rizky Pratama", avatar: "/images/authors/rizky.jpg" },
    publishedAt: "2025-12-22T11:00:00",
    image: "/images/articles/phoenix-story.jpg",
    tags: ["Phoenix Esports", "Story", "Inspiration"],
    readTime: 7,
  },
];

// ===== TESTIMONIALS =====
export const testimonials: Testimonial[] = [
  {
    id: "test-001",
    name: "Adi Pratama",
    role: "Captain, Phoenix Esports",
    avatar: "/images/testimonials/adi.jpg",
    content: "Platform ini sangat membantu tim kami untuk menemukan turnamen dan mengembangkan komunitas. Sistemnya sangat user-friendly!",
    rating: 5,
  },
  {
    id: "test-002",
    name: "Dewi Anggraini",
    role: "Casual Gamer",
    avatar: "/images/testimonials/dewi.jpg",
    content: "Sebagai pemain kasual, saya senang bisa menemukan turnamen yang sesuai dengan skill level saya. Komunitas di sini juga sangat ramah.",
    rating: 5,
  },
  {
    id: "test-003",
    name: "Rudi Hermawan",
    role: "Event Organizer",
    avatar: "/images/testimonials/rudi.jpg",
    content: "Sebagai penyelenggara event, platform ini memudahkan kami untuk mengelola pendaftaran dan mengumumkan hasil turnamen.",
    rating: 4,
  },
  {
    id: "test-004",
    name: "Maya Sari",
    role: "Content Creator",
    avatar: "/images/testimonials/maya.jpg",
    content: "Berita dan konten di sini selalu update dan berkualitas. Sangat membantu untuk konten saya sebagai streamer esports.",
    rating: 5,
  },
];

// ===== FAQ =====
export const faqItems: FAQItem[] = [
  {
    id: "faq-001",
    question: "Bagaimana cara mendaftar untuk turnamen?",
    answer: "Untuk mendaftar turnamen, Anda perlu membuat akun terlebih dahulu. Setelah login, kunjungi halaman Turnamen, pilih turnamen yang ingin diikuti, dan klik tombol 'Daftar'. Isi formulir pendaftaran dengan lengkap dan tunggu konfirmasi dari penyelenggara.",
    category: "Turnamen",
  },
  {
    id: "faq-002",
    question: "Apakah saya bisa mendaftar sebagai individu atau harus sebagai tim?",
    answer: "Ini tergantung pada jenis turnamennya. Beberapa turnamen memungkinkan pendaftaran individu, sementara yang lain memerlukan pendaftaran sebagai tim. Informasi ini akan tertera pada detail turnamen masing-masing.",
    category: "Turnamen",
  },
  {
    id: "faq-003",
    question: "Bagaimana cara bergabung dengan komunitas?",
    answer: "Kunjungi halaman Komunitas dan pilih grup atau komunitas yang ingin Anda ikuti. Klik tombol 'Gabung' dan Anda akan menjadi anggota komunitas tersebut. Beberapa komunitas mungkin memerlukan persetujuan admin terlebih dahulu.",
    category: "Komunitas",
  },
  {
    id: "faq-004",
    question: "Bagaimana cara membuat tim esports?",
    answer: "Setelah login, pergi ke halaman Tim Esports dan klik 'Buat Tim Baru'. Isi detail tim Anda termasuk nama, game yang dimainkan, dan informasi lainnya. Setelah tim dibuat, Anda dapat mengundang pemain lain untuk bergabung.",
    category: "Tim",
  },
  {
    id: "faq-005",
    question: "Apa yang harus saya lakukan jika lupa password?",
    answer: "Di halaman login, klik 'Lupa Password'. Masukkan email yang terdaftar dan kami akan mengirimkan link untuk reset password ke email Anda.",
    category: "Akun",
  },
  {
    id: "faq-006",
    question: "Bagaimana cara menghubungi support?",
    answer: "Anda dapat menghubungi support melalui halaman Support dengan mengisi formulir tiket atau melalui live chat yang tersedia. Tim support kami akan merespons dalam waktu 24 jam kerja.",
    category: "Support",
  },
  {
    id: "faq-007",
    question: "Apakah ada biaya untuk mengikuti turnamen?",
    answer: "Beberapa turnamen gratis, sementara yang lain mungkin memiliki biaya pendaftaran. Informasi biaya akan ditampilkan dengan jelas pada detail turnamen sebelum Anda mendaftar.",
    category: "Turnamen",
  },
  {
    id: "faq-008",
    question: "Bagaimana sistem peringkat/leaderboard bekerja?",
    answer: "Leaderboard dihitung berdasarkan poin yang dikumpulkan dari partisipasi dan performa di turnamen. Poin diberikan berdasarkan placement, jumlah kemenangan, dan konsistensi pemain/tim.",
    category: "Turnamen",
  },
];

// ===== GAMES LIST =====
export const games = [
  "Valorant",
  "Mobile Legends",
  "PUBG Mobile",
  "Free Fire",
  "Dota 2",
  "League of Legends",
  "Counter-Strike 2",
  "Apex Legends",
  "FIFA",
  "eFootball",
];

// ===== STATS =====
export const stats = {
  totalMembers: 25000,
  totalTeams: 350,
  totalEvents: 150,
  totalPrizePool: "Rp 2.5 Miliar",
};

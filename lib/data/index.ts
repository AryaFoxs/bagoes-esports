import type { Event, Tournament, Team, Article, Testimonial, FAQItem, LeaderboardEntry, TeamMember, Community, Achievement } from "@/types";

// ===== EVENTS =====
export const events: Event[] = [
  {
    id: "evt-001",
    title: "Valorant Champions Cup 2026",
    description: "Turnamen Valorant terbesar tahun ini dengan prize pool fantastis dan tim-tim terbaik dari seluruh Indonesia.",
    game: "Valorant",
    type: "tournament",
    status: "live",
    date: "2026-01-02T10:00:00",
    endDate: "2026-01-05T22:00:00",
    location: "Jakarta Convention Center",
    isOnline: false,
    maxParticipants: 64,
    currentParticipants: 64,
    prizePool: "Rp 500.000.000",
    image: "/images/events/valorant-cup.jpg",
    streamUrl: "https://twitch.tv/bagoesesports",
    registrationDeadline: "2025-12-25T23:59:00",
  },
  {
    id: "evt-002",
    title: "Mobile Legends: Bang Bang Pro League",
    description: "Kompetisi profesional MLBB dengan format liga yang akan menentukan tim terbaik musim ini.",
    game: "Mobile Legends",
    type: "tournament",
    status: "upcoming",
    date: "2026-01-15T09:00:00",
    endDate: "2026-03-15T22:00:00",
    location: "Online",
    isOnline: true,
    maxParticipants: 32,
    currentParticipants: 28,
    prizePool: "Rp 300.000.000",
    image: "/images/events/mlbb-pro.jpg",
    registrationDeadline: "2026-01-10T23:59:00",
  },
  {
    id: "evt-003",
    title: "PUBG Mobile Community Cup",
    description: "Turnamen kasual untuk komunitas PUBG Mobile. Terbuka untuk semua level skill!",
    game: "PUBG Mobile",
    type: "casual",
    status: "upcoming",
    date: "2026-01-20T14:00:00",
    endDate: "2026-01-20T20:00:00",
    location: "Online",
    isOnline: true,
    maxParticipants: 100,
    currentParticipants: 72,
    prizePool: "Rp 10.000.000",
    image: "/images/events/pubgm-cup.jpg",
    registrationDeadline: "2026-01-18T23:59:00",
  },
  {
    id: "evt-004",
    title: "Esports Workshop: Strategi & Mental Game",
    description: "Workshop interaktif tentang strategi bermain dan mental game untuk para pemain esports.",
    game: "General",
    type: "workshop",
    status: "upcoming",
    date: "2026-01-25T13:00:00",
    endDate: "2026-01-25T17:00:00",
    location: "Bandung Creative Hub",
    isOnline: false,
    maxParticipants: 50,
    currentParticipants: 35,
    image: "/images/events/workshop.jpg",
    registrationDeadline: "2026-01-23T23:59:00",
  },
  {
    id: "evt-005",
    title: "Dota 2 Winter Championship",
    description: "Turnamen Dota 2 dengan format single elimination untuk tim-tim terbaik.",
    game: "Dota 2",
    type: "tournament",
    status: "completed",
    date: "2025-12-15T10:00:00",
    endDate: "2025-12-20T22:00:00",
    location: "Surabaya",
    isOnline: false,
    maxParticipants: 16,
    currentParticipants: 16,
    prizePool: "Rp 150.000.000",
    image: "/images/events/dota-winter.jpg",
    registrationDeadline: "2025-12-10T23:59:00",
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

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  game: string;
  type: "tournament" | "casual" | "workshop" | "meetup";
  status: "upcoming" | "live" | "completed";
  date: string;
  endDate?: string;
  location: string;
  isOnline: boolean;
  maxParticipants: number;
  currentParticipants: number;
  prizePool?: string;
  image: string;
  streamUrl?: string;
  registrationDeadline: string;
}

// Tournament Types
export interface Tournament {
  id: string;
  title: string;
  game: string;
  format: "single_elimination" | "double_elimination" | "round_robin" | "swiss";
  status: "upcoming" | "ongoing" | "completed";
  date: string;
  endDate: string;
  prizePool: string;
  entryFee?: string;
  maxTeams: number;
  currentTeams: number;
  rules: string[];
  image: string;
  bracket?: BracketMatch[];
}

export interface BracketMatch {
  id: string;
  round: number;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

export interface LeaderboardEntry {
  rank: number;
  teamId: string;
  teamName: string;
  logo: string;
  points: number;
  wins: number;
  losses: number;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  game: string;
  logo: string;
  banner?: string;
  description: string;
  founded: string;
  region: string;
  members: TeamMember[];
  achievements: Achievement[];
  socialLinks: SocialLinks;
  isRecruiting: boolean;
  recruitingRoles?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  nickname: string;
  role: string;
  avatar: string;
  joinedDate: string;
  country: string;
}

export interface Achievement {
  id: string;
  title: string;
  tournament: string;
  date: string;
  placement: string;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  youtube?: string;
  twitch?: string;
  discord?: string;
  website?: string;
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  game: string;
  memberCount: number;
  image: string;
  isOpen: boolean;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  category: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
  likes: number;
}

// Blog Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "news" | "tips" | "analysis" | "community";
  author: Author;
  publishedAt: string;
  image: string;
  tags: string[];
  readTime: number;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

// FAQ & Support Types
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  teams?: string[];
}

// Testimonial Types
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

// Contact Form Types
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Registration Types
export interface EventRegistration {
  eventId: string;
  userId: string;
  teamId?: string;
  registeredAt: string;
  status: "pending" | "confirmed" | "cancelled";
}

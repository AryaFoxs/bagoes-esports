// Database types for Supabase tables

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  level: number;
  xp: number;
  rank: string;
  role: 'user' | 'admin' | 'superadmin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  game: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  location: string | null;
  location_type: "online" | "offline" | "hybrid";
  format: string | null;
  max_participants: number;
  registration_fee: number;
  prize_pool: number;
  status: "upcoming" | "live" | "completed" | "cancelled";
  image_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  game: string;
  description: string | null;
  logo_url: string | null;
  region: string | null;
  is_recruiting: boolean;
  wins: number;
  losses: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: "captain" | "co-captain" | "member";
  status: "active" | "inactive" | "pending";
  joined_at: string;
  // Joined data
  profile?: Profile;
  team?: Team;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  team_id: string | null;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  result: string | null;
  registered_at: string;
  // Joined data
  event?: Event;
  profile?: Profile;
  team?: Team;
}

export interface Notification {
  id: string;
  user_id: string;
  type: "event" | "team" | "forum" | "transaction" | "system";
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_type: "event" | "article";
  item_id: string;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image: string | null;
  category: string;
  author_id: string | null;
  status: "draft" | "published" | "archived";
  views: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  author?: Profile;
}

export interface Media {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  alt_text: string | null;
  uploaded_by: string | null;
  created_at: string;
}

// Database types for Supabase client
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile> & { id: string; username: string };
        Update: Partial<Profile>;
      };
      events: {
        Row: Event;
        Insert: Partial<Event> & { title: string; slug: string; game: string; start_date: string };
        Update: Partial<Event>;
      };
      teams: {
        Row: Team;
        Insert: Partial<Team> & { name: string; slug: string; game: string };
        Update: Partial<Team>;
      };
      team_members: {
        Row: TeamMember;
        Insert: Partial<TeamMember> & { team_id: string; user_id: string };
        Update: Partial<TeamMember>;
      };
      event_registrations: {
        Row: EventRegistration;
        Insert: Partial<EventRegistration> & { event_id: string; user_id: string };
        Update: Partial<EventRegistration>;
      };
      notifications: {
        Row: Notification;
        Insert: Partial<Notification> & { user_id: string; type: string; title: string };
        Update: Partial<Notification>;
      };
      favorites: {
        Row: Favorite;
        Insert: Partial<Favorite> & { user_id: string; item_type: string; item_id: string };
        Update: Partial<Favorite>;
      };
    };
  };
}

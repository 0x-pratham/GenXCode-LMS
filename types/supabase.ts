export type AppRole = 'super_admin' | 'admin' | 'mentor' | 'student';
export type ContentStatus = 'draft' | 'published' | 'archived';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: AppRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LeagueMembership {
  id: string;
  season_id: string;
  user_id: string;
  league: 'code_starter' | 'code_builder' | 'code_champion';
  xp_total: number;
  rank: number | null;
  created_at: string;
  updated_at: string;
}

export interface DailyChallenge {
  id: string;
  cohort_id: string | null;
  title: string;
  description: string;
  instructions: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xp_reward: number;
  opens_at: string;
  due_at: string | null;
  status: ContentStatus;
  created_at: string;
}

// Global Supabase Database Type
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
      };
      league_memberships: {
        Row: LeagueMembership;
        Insert: Partial<LeagueMembership>;
        Update: Partial<LeagueMembership>;
      };
      daily_challenges: {
        Row: DailyChallenge;
        Insert: Partial<DailyChallenge>;
        Update: Partial<DailyChallenge>;
      };
    };
  };
}
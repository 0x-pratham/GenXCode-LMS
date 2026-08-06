import { 
  LayoutDashboard, 
  BookOpen, 
  Swords, 
  Trophy, 
  Video, 
  UserCircle 
} from 'lucide-react';

export const portalLinks = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Courses', href: '/courses', icon: BookOpen },
  { title: 'Daily Challenges', href: '/challenges', icon: Swords },
  { title: 'Live Sessions', href: '/live', icon: Video },
  { title: 'Leaderboard', href: '/leaderboard', icon: Trophy },
  { title: 'Profile', href: '/profile', icon: UserCircle },
] as const;
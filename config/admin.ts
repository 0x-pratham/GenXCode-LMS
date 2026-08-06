import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Swords, 
  Megaphone,
  Code2,
  Settings 
} from 'lucide-react';

export const adminLinks = [
  { title: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
  { title: 'Users & Invites', href: '/admin/users', icon: Users },
  { title: 'Courses', href: '/admin/courses', icon: BookOpen },
  { title: 'Challenges', href: '/admin/challenges', icon: Swords },
  { title: 'Hackathons', href: '/admin/hackathons', icon: Code2 },
  { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
] as const;
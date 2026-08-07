import { 
  LayoutDashboard, Users, MailOpen, BookOpen, Swords, HelpCircle, 
  Radio, ClipboardCheck, Trophy, Code2, Newspaper, ImageIcon, 
  Briefcase, Megaphone, LineChart, Settings, ScrollText 
} from 'lucide-react';

export const adminNavGroups = [
  {
    label: "Overview",
    items: [
      { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    label: "User Management",
    items: [
      { title: 'Users', href: '/admin/users', icon: Users },
      { title: 'Invitations', href: '/admin/invitations', icon: MailOpen },
    ]
  },
  {
    label: "Learning",
    items: [
      { title: 'Courses', href: '/admin/courses', icon: BookOpen },
      { title: 'Challenges', href: '/admin/challenges', icon: Swords },
      { title: 'Quizzes', href: '/admin/quizzes', icon: HelpCircle },
    ]
  },
  {
    label: "Community",
    items: [
      { title: 'Live Classes', href: '/admin/live', icon: Radio },
      { title: 'Attendance', href: '/admin/attendance', icon: ClipboardCheck },
      { title: 'Leaderboard', href: '/admin/leaderboard', icon: Trophy },
      { title: 'Hackathons', href: '/admin/hackathons', icon: Code2 },
    ]
  },
  {
    label: "Content",
    items: [
      { title: 'Blogs', href: '/admin/blogs', icon: Newspaper },
      { title: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      { title: 'Jobs', href: '/admin/jobs', icon: Briefcase },
      { title: 'Announcements', href: '/admin/announcements', icon: Megaphone },
    ]
  },
  {
    label: "System",
    items: [
      { title: 'Analytics', href: '/admin/analytics', icon: LineChart },
      { title: 'Settings', href: '/admin/settings', icon: Settings },
      { title: 'Logs', href: '/admin/logs', icon: ScrollText },
    ]
  }
];
import {
  LayoutDashboard,
  BookOpen,
  Swords,
  Trophy,
  Radio,
  Code2,
  Briefcase,
  Newspaper,
  ImageIcon,
  UserCircle,
  HelpCircle // Added icon for Quizzes
} from "lucide-react";

export const portalLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Courses",
    href: "/courses",
    icon: BookOpen,
  },
  {
    title: "Challenges",
    href: "/challenges",
    icon: Swords,
  },
  {
    title: "Quizzes",
    href: "/quizzes",
    icon: HelpCircle,
  },
  {
    title: "Live Classes",
    href: "/live",
    icon: Radio,
  },
  {
    title: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
  },
  {
    title: "Hackathons",
    href: "/hackathons",
    icon: Code2,
  },
  {
    title: "Blogs",
    href: "/blogs",
    icon: Newspaper,
  },
  {
    title: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    title: "Gallery",
    href: "/gallery",
    icon: ImageIcon,
  },
  {
    title: "My Profile",
    href: "/profile",
    icon: UserCircle,
  },
] as const;
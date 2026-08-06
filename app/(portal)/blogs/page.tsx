import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowRight, Clock } from "lucide-react";

// Mock Data based on posts & announcements schema
const BLOG_POSTS = [
  {
    id: "p1",
    title: "Why Next.js 16 is the Future of Enterprise Web",
    excerpt: "Exploring the new Turbopack optimizations, Server Actions stability, and how GenXCode handles 10k+ concurrent users.",
    coverUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
    publishedAt: "Oct 12, 2026",
    readTime: "5 min read",
    author: "Admin Team",
    isAnnouncement: true,
  },
  {
    id: "p2",
    title: "Mastering Supabase Row Level Security (RLS)",
    excerpt: "A deep dive into how to secure your database policies effectively without writing backend middleware.",
    coverUrl: "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1000&auto=format&fit=crop",
    publishedAt: "Oct 08, 2026",
    readTime: "8 min read",
    author: "Aryan Sharma",
    isAnnouncement: false,
  },
  {
    id: "p3",
    title: "Design Systems in 2026: Beyond Tailwind",
    excerpt: "How we built the GenXCode UI system using Radix Primitives and automated CSS variable generation.",
    coverUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
    publishedAt: "Sep 28, 2026",
    readTime: "6 min read",
    author: "UI/UX Team",
    isAnnouncement: false,
  }
];

export default function BlogsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-accent" />
          Tech Insights & News
        </h1>
        <p className="text-foreground/70 mt-1">Stay updated with the latest in tech, platform announcements, and engineering blogs.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden hover:border-primary/30 transition-all">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={post.coverUrl}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              {post.isAnnouncement && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-md">
                    Announcement
                  </Badge>
                </div>
              )}
            </div>
            
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between text-xs font-medium text-foreground/60 mb-3">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.publishedAt}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
              </div>
              <CardTitle className="line-clamp-2 text-xl hover:text-accent transition-colors cursor-pointer">
                {post.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="flex-1">
              <p className="text-sm text-foreground/70 line-clamp-3">
                {post.excerpt}
              </p>
            </CardContent>
            
            <CardFooter className="pt-0 border-t border-border/50 bg-surface/30 p-4 flex items-center justify-between">
              <span className="text-xs font-medium text-foreground/70">By {post.author}</span>
              <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-accent hover:bg-transparent">
                Read More <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
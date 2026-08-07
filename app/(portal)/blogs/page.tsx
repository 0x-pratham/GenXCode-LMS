import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function BlogsPage() {
  const supabase = await createClient();

  // Database se posts fetch kar rahe hain, sath mein profiles table se author ka naam (Join)
  const { data: blogPosts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at,
      author:profiles ( full_name )
    `)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
  }

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
        {blogPosts?.map((post) => {
          // Date formatting (e.g., "Oct 12, 2026")
          const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          // Author name fallback
          const authorName = Array.isArray(post.author) 
            ? post.author[0]?.full_name 
            : post.author?.full_name || "Admin Team";

          return (
            <Card key={post.id} className="flex flex-col overflow-hidden hover:border-primary/30 transition-all">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.cover_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"} // Fallback image if null
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between text-xs font-medium text-foreground/60 mb-3">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {formattedDate}</span>
                  {/* Read time ka column DB mein nahi hai, toh abhi static rakha hai, chahein toh content length se calculate kar sakte hain */}
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 5 min read</span>
                </div>
                {/* Single post page par bhejne ke liye Link add kiya gaya hai using slug */}
                <Link href={`/blogs/${post.slug}`}>
                  <CardTitle className="line-clamp-2 text-xl hover:text-accent transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                </Link>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-sm text-foreground/70 line-clamp-3">
                  {post.excerpt}
                </p>
              </CardContent>
              
              <CardFooter className="pt-0 border-t border-border/50 bg-surface/30 p-4 flex items-center justify-between">
                <span className="text-xs font-medium text-foreground/70">By {authorName}</span>
                <Link href={`/blogs/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-primary hover:text-accent hover:bg-transparent">
                    Read More <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}

        {/* Empty State */}
        {(!blogPosts || blogPosts.length === 0) && (
          <div className="col-span-full py-12 text-center text-foreground/50 border border-dashed border-border rounded-xl">
            No posts available right now. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
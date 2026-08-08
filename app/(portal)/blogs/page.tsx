import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowRight, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function BlogsPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
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
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Newspaper className="w-7 h-7 text-accent" />
            </div>
            <div>
              Tech <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Insights</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Stay updated with the latest in tech, platform announcements, and engineering deep-dives.
          </p>
        </div>
      </div>

      {/* Grid Layout for Blogs */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts && blogPosts.length > 0 ? (
          blogPosts.map((post, index) => {
            // Date formatting
            const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            });

            // Author name fallback
            const authorName = Array.isArray(post.author) 
              ? post.author[0]?.full_name 
              : post.author?.full_name || "Admin Team";

            const animationDelay = `${(index + 2) * 150}ms`;

            return (
              <Card 
                key={post.id} 
                style={{ animationDelay }}
                className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl"
              >
                {/* Cover Image Block */}
                <div className="relative h-52 w-full overflow-hidden border-b border-white/5">
                  <Image
                    src={post.cover_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"} // Fallback image if null
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-110"
                  />
                  {/* Subtle dark gradient to blend image into the card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                </div>
                
                <CardHeader className="pt-6 pb-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#E2D1FE]/60 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent/80" /> {formattedDate}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-accent/80" /> 5 min read
                    </span>
                  </div>
                  
                  <Link href={`/blogs/${post.slug}`}>
                    <CardTitle className="line-clamp-2 text-2xl font-bold text-foreground hover:text-accent transition-colors cursor-pointer leading-snug drop-shadow-sm">
                      {post.title}
                    </CardTitle>
                  </Link>
                </CardHeader>
                
                <CardContent className="flex-1 pt-0">
                  <p className="text-base text-[#E2D1FE]/70 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-5 pb-5 px-6 bg-black/40 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#E2D1FE] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                    By {authorName}
                  </div>
                  <Link href={`/blogs/${post.slug}`}>
                    <Button variant="ghost" className="text-foreground hover:bg-white/10 hover:text-white rounded-xl font-bold transition-all group px-4">
                      Read <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          /* Empty State */
          <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Newspaper className="w-10 h-10 text-[#E2D1FE]/30" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">No Posts Available</h3>
            <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">
              Our engineering and admin team will publish new insights and news soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
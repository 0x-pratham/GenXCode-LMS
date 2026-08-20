import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Newspaper, Calendar, ArrowRight, Clock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

// Optimized Data Fetcher for Maximum Backend Speed
async function getBlogsData() {
  const supabase = await createClient();

  // Fetch posts with author full_name AND avatar_url (Join)
  // Note: RLS policy "public view published posts" hides drafts from students automatically.
  // Staff/Admins will be able to see drafts due to "staff view all posts" policy[cite: 15].
  const { data: blogPosts, error } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_url,
      published_at,
      status,
      author:profiles ( full_name, avatar_url )
    `)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error.message);
  }

  return blogPosts || [];
}

export default async function BlogsPage() {
  const supabase = await createClient();

  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6 focus:outline-none" tabIndex={0}>
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
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

      <Suspense fallback={<BlogsSkeleton />}>
        <BlogsContent />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function BlogsContent() {
  const blogPosts = await getBlogsData();

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogPosts && blogPosts.length > 0 ? (
        blogPosts.map((post, index) => {
          // Date formatting
          const formattedDate = new Date(post.published_at).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          // Author data fallback
          const authorData = Array.isArray(post.author) ? post.author[0] : post.author;
          const authorName = authorData?.full_name || "Admin Team";
          const authorAvatar = authorData?.avatar_url || ""; 
          
          const isPublished = post.status === 'published';
          const animationDelay = `${(index + 2) * 150}ms`;

          return (
            <Card 
              key={post.id} 
              style={{ animationDelay }}
              className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl group"
            >
              {/* Image Banner */}
              <div className="relative h-52 w-full overflow-hidden border-b border-white/5">
                {!isPublished && (
                  <div className="absolute top-4 left-4 z-20">
                    <Badge variant="outline" className="bg-black/60 text-white/50 border-white/20 backdrop-blur-md uppercase tracking-wider">
                      Draft
                    </Badge>
                  </div>
                )}
                <img
                  src={post.cover_url || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
                
                <Link href={`/blogs/${post.slug}`} className="outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md inline-block">
                  <CardTitle className="line-clamp-2 text-2xl font-bold text-foreground group-hover:text-accent transition-colors cursor-pointer leading-snug drop-shadow-sm">
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
                {/* Author Identity Block with Avatar */}
                <div className="flex items-center gap-2.5 bg-white/5 pl-1.5 pr-3 py-1.5 rounded-full border border-white/5 shadow-inner max-w-[55%]">
                  {authorAvatar ? (
                     <img src={authorAvatar} alt={authorName} className="w-6 h-6 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 border border-accent/30 text-[10px] font-bold text-accent">
                      {authorName.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-[#E2D1FE] truncate">
                    {authorName}
                  </span>
                </div>
                <Link href={`/blogs/${post.slug}`} tabIndex={-1}>
                  <Button tabIndex={0} variant="ghost" className="text-foreground hover:bg-white/10 hover:text-white rounded-xl font-bold transition-all group/btn px-4 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background border border-transparent">
                    Read <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
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
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function BlogsSkeleton() {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-black/20 border border-white/10 rounded-3xl h-[450px] flex flex-col overflow-hidden">
          <div className="h-52 bg-white/10 w-full shrink-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 w-24 bg-white/5 rounded"></div>
              <div className="h-4 w-24 bg-white/5 rounded"></div>
            </div>
            <div className="h-6 w-full bg-white/10 rounded mb-2"></div>
            <div className="h-6 w-3/4 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-full bg-white/5 rounded mb-2"></div>
            <div className="h-4 w-4/5 bg-white/5 rounded mb-6"></div>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
              <div className="h-8 w-32 bg-white/5 rounded-full"></div>
              <div className="h-10 w-24 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
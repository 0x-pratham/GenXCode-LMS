import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Newspaper } from "lucide-react";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch the specific post by slug and join author details safely
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      author:profiles ( full_name, avatar_url )
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    return (
      <div className="max-w-xl mx-auto py-28 px-4 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <Newspaper className="w-8 h-8 text-[#E2D1FE]/40" />
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">Post Not Found</h2>
        <p className="text-[#E2D1FE]/60 text-sm">The article you're looking for doesn't exist or has been archived.</p>
        <Button asChild className="mt-2 bg-brand-gradient border-none font-bold accent-glow hover:brightness-110 rounded-xl h-11 px-6">
          <Link href="/blogs">Return to Blogs</Link>
        </Button>
      </div>
    );
  }

  // Formatting author & dates
  const authorData = Array.isArray(post.author) ? post.author[0] : post.author;
  const authorName = authorData?.full_name || "Admin Team";
  const authorAvatar = authorData?.avatar_url || "";
  
  const formattedDate = new Date(post.published_at || post.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // --- SMART CONTENT SANITIZER & PARSER ---
  let rawBody: any = post.body;
  let parsedHtml = "";

  if (typeof rawBody === "string") {
    // Agar string ke andar JSON format save ho gaya hai (jaise { "markdown": "..." })
    try {
      const parsedJson = JSON.parse(rawBody);
      if (typeof parsedJson === "object" && parsedJson !== null) {
        rawBody = parsedJson.markdown || parsedJson.html || parsedJson.content || rawBody;
      }
    } catch (e) {
      // Normal string hai, JSON parse fail hua toh ignore karo
    }
  } else if (rawBody && typeof rawBody === "object") {
    rawBody = rawBody.markdown || rawBody.html || rawBody.content || JSON.stringify(rawBody);
  }

  if (typeof rawBody === "string") {
    // \r\n ko clean HTML breaks (<br />) ya paragraphs mein convert karna
    parsedHtml = rawBody
      .replace(/\\r\\n/g, "<br /><br />")
      .replace(/\\n/g, "<br />")
      .replace(/\r\n/g, "<br /><br />")
      .replace(/\n/g, "<br />");
  } else {
    parsedHtml = "<p>Content formatting error.</p>";
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-24 relative z-10 px-4 sm:px-6 lg:px-8">
      
      {/* Back Navigation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards pt-4">
        <Link href="/blogs" className="inline-flex items-center text-xs font-bold text-[#E2D1FE]/70 hover:text-accent transition-colors group bg-black/30 px-4 py-2 rounded-xl border border-white/5 shadow-inner w-fit">
          <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Insights
        </Link>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Article Meta & Header Section */}
        <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards space-y-4 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-semibold text-[#E2D1FE]/60">
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Calendar className="w-3.5 h-3.5 text-accent" /> {formattedDate}
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              <Clock className="w-3.5 h-3.5 text-accent" /> 5 min read
            </span>
          </div>

          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Author Bar */}
          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            <Avatar className="w-10 h-10 border border-white/10 shadow-sm">
              <AvatarImage src={authorAvatar} className="object-cover" />
              <AvatarFallback className="bg-accent/20 text-accent font-bold text-sm">
                {authorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="text-sm font-bold text-foreground">{authorName}</div>
              <div className="text-[11px] text-[#E2D1FE]/50 font-medium">Engineering & Product Team</div>
            </div>
          </div>
        </div>

        {/* Clean Cinematic Cover Image */}
        {post.cover_url && (
          <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards relative w-full h-[280px] sm:h-[380px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        )}

        {/* Main Content Body Container */}
        <article className="animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards pt-2">
          <div className="bg-black/20 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative">
            
            {/* Excerpt Summary */}
            {post.excerpt && (
              <div className="mb-8 p-5 rounded-2xl bg-accent/10 border border-accent/20 border-l-4 border-l-accent text-accent/90 text-base sm:text-lg font-medium leading-relaxed italic">
                "{post.excerpt}"
              </div>
            )}

            {/* Typography Content Render with Clean Formatting */}
            <div 
              className="prose prose-invert max-w-none relative z-10
                prose-p:text-[#E2D1FE]/80 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
                prose-headings:font-heading prose-headings:text-foreground prose-headings:font-bold
                prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-a:text-accent prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white prose-strong:font-bold
                prose-code:text-accent prose-code:bg-accent/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono
                prose-pre:bg-black/80 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl
                prose-img:rounded-2xl prose-img:border prose-img:border-white/10
                prose-blockquote:border-l-accent prose-blockquote:bg-white/5 prose-blockquote:px-5 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
                prose-ul:list-disc prose-ol:list-decimal prose-li:text-[#E2D1FE]/80 marker:text-accent"
              dangerouslySetInnerHTML={{ __html: parsedHtml || "<p>Content is being formulated. Check back later.</p>" }}
            />
          </div>
        </article>
      </div>

    </div>
  );
}
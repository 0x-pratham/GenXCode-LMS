import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

// Optimized Data Fetcher for Maximum Backend Speed
async function getGalleryData() {
  const supabase = await createClient();

  // Fetch gallery items from Database
  // RLS automatically filters out drafts for normal users while allowing staff to see everything[cite: 18].
  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery items:", error.message);
  }

  return galleryItems || [];
}

export default async function GalleryPage() {
  const supabase = await createClient();

  // 1. Safe Auth Check - Protect the route
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10 focus:outline-none" tabIndex={0}>
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <ImageIcon className="w-7 h-7 text-accent" />
            </div>
            <div>
              Community <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Gallery</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Memories, hackathons, and offline meetups of our elite developer community.
          </p>
        </div>
      </div>

      {/* Suspense boundary for lazy loading */}
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryContent />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function GalleryContent() {
  const galleryItems = await getGalleryData();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.length > 0 ? (
        galleryItems.map((item, index) => {
          
          // Robust Storage URL Logic: Handles both Direct Uploads & External URLs flawlessly
          let imageUrl = item.image_path;
          if (item.image_path && !item.image_path.startsWith("http")) {
            // Automatically resolve internal bucket paths to full public URLs
            imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_path}`;
          }

          const isDraft = item.status === 'draft';
          const animationDelay = `${(index + 2) * 150}ms`;

          return (
            <div 
              key={item.id} 
              style={{ animationDelay }}
              className="animate-fade-in-up opacity-0 fill-mode-forwards group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              tabIndex={0}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                
                {/* Draft Badge (Visible to Admins only) */}
                {isDraft && (
                  <div className="absolute top-5 right-5 z-20">
                    <Badge variant="outline" className="bg-black/80 text-white/50 border-white/20 backdrop-blur-md uppercase tracking-wider text-[10px]">
                      Draft
                    </Badge>
                  </div>
                )}

                {/* Using standard HTML img tag to prevent Next.js hostname configuration crashes */}
                <img
                  src={imageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop"}
                  alt={item.alt_text || item.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90"
                  loading="lazy"
                />

                {/* Heavy dark gradient at bottom for perfect text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
                
                <div className="absolute top-5 left-5">
                  <Badge variant="outline" className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-3 py-1.5 shadow-lg text-xs font-bold tracking-wide">
                    Community
                  </Badge>
                </div>
                
                {/* Content block with slight upward slide on hover */}
                <div className="absolute bottom-5 left-5 right-5 translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white flex items-center gap-2 drop-shadow-md mb-2 leading-tight">
                    {item.title} <Sparkles className="w-5 h-5 text-accent drop-shadow-sm shrink-0" />
                  </h3>
                  <p className="text-sm text-[#E2D1FE]/80 line-clamp-2 drop-shadow-sm font-medium leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ImageIcon className="w-10 h-10 text-[#E2D1FE]/30" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">No Memories Yet</h3>
          <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">
            Photos from our hackathons and meetups will be published here soon!
          </p>
        </div>
      )}
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function GallerySkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-white/10 bg-black/40 flex flex-col justify-end">
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
          <div className="relative z-10 p-5 w-full bg-gradient-to-t from-black/80 to-transparent">
            <div className="h-6 w-3/4 bg-white/10 rounded mb-3"></div>
            <div className="h-4 w-full bg-white/10 rounded mb-1"></div>
            <div className="h-4 w-2/3 bg-white/10 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
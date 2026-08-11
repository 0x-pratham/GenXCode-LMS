import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();

  // 1. Safe Auth Check - Protect the route
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch only 'published' gallery items from Database
  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery items:", error.message);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {galleryItems && galleryItems.length > 0 ? (
          galleryItems.map((item, index) => {
            
            // 3. Robust Storage URL Logic: Handles both Direct Uploads & External URLs flawlessly
            let imageUrl = item.image_path;
            if (item.image_path && !item.image_path.startsWith("http")) {
              // Automatically resolve internal bucket paths to full public URLs
              imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_path}`;
            }

            const animationDelay = `${(index + 2) * 150}ms`;

            return (
              <div 
                key={item.id} 
                style={{ animationDelay }}
                className="animate-fade-in-up opacity-0 fill-mode-forwards group relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 transition-all duration-500 hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.2)]"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  
                  {/* FIXED: Using standard HTML img tag to prevent Next.js hostname configuration crashes */}
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
    </div>
  );
}
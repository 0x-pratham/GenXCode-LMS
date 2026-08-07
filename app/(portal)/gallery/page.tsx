import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function GalleryPage() {
  const supabase = await createClient();

  // 1. Database se sirf 'published' items fetch kar rahe hain
  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery items:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <ImageIcon className="w-8 h-8 text-accent" />
          GenXCode Gallery
        </h1>
        <p className="text-foreground/70 mt-1">Memories, hackathons, and offline meetups of our elite community.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {galleryItems?.map((item) => {
          // 2. Image URL logic: Agar tum DB mein direct link (http...) save karte ho toh wo use hoga, 
          // nahi toh Supabase Storage ke 'gallery' bucket ka public URL banayega.
          const imageUrl = item.image_path?.startsWith("http")
            ? item.image_path
            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_path}`;

          return (
            <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-surface/50 transition-all hover:shadow-lg">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={item.alt_text || item.title} // Schema ke hisaab se alt_text use kiya
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4">
                  {/* Note: Schema mein 'category' column nahi hai, isliye fallback text lagaya hai. Tum chaho toh schema mein column add kar sakte ho */}
                  <Badge className="bg-accent text-accent-foreground border-none">
                    Community
                  </Badge>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                    {item.title} <Sparkles className="w-4 h-4 text-accent" />
                  </h3>
                  <p className="text-sm text-white/80 mt-1 line-clamp-2">{item.caption}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Agar database khali ho toh ye dikhega */}
        {(!galleryItems || galleryItems.length === 0) && (
          <div className="col-span-full py-12 text-center text-foreground/50 border border-dashed border-border rounded-xl">
            No memories published yet.
          </div>
        )}
      </div>
    </div>
  );
}
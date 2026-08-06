import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Sparkles } from "lucide-react";

// Mock Data based on gallery_items schema
const GALLERY_ITEMS = [
  {
    id: "g1",
    title: "Web3 Hackathon Winners",
    caption: "Team 'CryptoPunks' taking the first prize!",
    imagePath: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000&auto=format&fit=crop",
    category: "Hackathon",
  },
  {
    id: "g2",
    title: "Pune Tech Meetup 2026",
    caption: "Our largest offline gathering so far.",
    imagePath: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    category: "Meetup",
  },
  {
    id: "g3",
    title: "Late Night Coding Session",
    caption: "Building the next big thing in AI.",
    imagePath: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    category: "Community",
  },
  {
    id: "g4",
    title: "Next.js Workshop",
    caption: "Live coding session on Server Components.",
    imagePath: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop",
    category: "Workshop",
  },
];

export default function GalleryPage() {
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
        {GALLERY_ITEMS.map((item) => (
          <div key={item.id} className="group relative overflow-hidden rounded-xl border border-border bg-surface/50 transition-all hover:shadow-lg">
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={item.imagePath}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
              
              <div className="absolute top-4 left-4">
                <Badge className="bg-accent text-accent-foreground border-none">
                  {item.category}
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
        ))}
      </div>
    </div>
  );
}
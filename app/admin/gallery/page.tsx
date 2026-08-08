import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function GalleryAdminPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged[cite: 30]
  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select(`
      *,
      author:profiles ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching gallery:", error);

  // Refined Status Badges for Glass Theme
  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Published</Badge>
      : <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Draft</Badge>;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <ImageIcon className="w-7 h-7 text-accent" />
            </div>
            <div>
              Gallery <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Management</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Upload, monitor, and manage community memories and event photographs.
          </p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Upload Image
        </Button>
      </div>

      {/* Media Library Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Media Library</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            All uploaded images visible on the public community gallery.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4 w-28">Preview</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Title</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Uploaded By</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems && galleryItems.length > 0 ? (
                galleryItems.map((item, index) => {
                  const uploader = Array.isArray(item.author) ? item.author[0]?.full_name : item.author?.full_name;
                  const imageUrl = item.image_path?.startsWith("http")
                    ? item.image_path
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_path}`;
                  const animationDelay = `${(index + 3) * 100}ms`;

                  return (
                    <TableRow 
                      key={item.id}
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4">
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                          <Image src={imageUrl} alt={item.alt_text || "Preview"} fill className="object-cover opacity-90" />
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="font-bold text-foreground drop-shadow-sm">{item.title}</div>
                        <div className="text-xs font-medium text-[#E2D1FE]/50 line-clamp-1 mt-0.5">{item.caption}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-semibold text-[#E2D1FE]/80">
                        {uploader || "System"}
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-[#E2D1FE]/70 hover:text-white hover:bg-white/10 rounded-xl transition-all">
                            <Edit className="w-4 h-4 text-accent" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No images in the gallery yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
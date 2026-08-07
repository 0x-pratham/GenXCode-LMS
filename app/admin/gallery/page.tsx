import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Plus, Edit, Trash2 } from "lucide-react";
import Image from "next/image";

export default async function GalleryAdminPage() {
  const supabase = await createClient();

  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select(`
      *,
      author:profiles ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching gallery:", error);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-accent" />
            Gallery Management
          </h1>
          <p className="text-foreground/70 mt-1">Upload and manage community memories and event photos.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Upload Image
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
          <CardDescription>All uploaded images for the public gallery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Preview</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {galleryItems && galleryItems.length > 0 ? (
                galleryItems.map((item) => {
                  const uploader = Array.isArray(item.author) ? item.author[0]?.full_name : item.author?.full_name;
                  const imageUrl = item.image_path?.startsWith("http")
                    ? item.image_path
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${item.image_path}`;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded-md overflow-hidden bg-surface">
                          <Image src={imageUrl} alt={item.alt_text || "Preview"} fill className="object-cover" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{item.title}</div>
                        <div className="text-xs text-foreground/50 line-clamp-1">{item.caption}</div>
                      </TableCell>
                      <TableCell>
                        {item.status === 'published' ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-foreground/50">Draft</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">{uploader || "System"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-foreground/50 hover:text-primary">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-foreground/50 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
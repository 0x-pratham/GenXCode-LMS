import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, Plus, Trash2, RefreshCw, UploadCloud } from "lucide-react";

export default async function GalleryAdminPage() {
  const supabase = await createClient();

  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // 2. Fetch gallery items with author profiles (Join based on created_by)
  const { data: galleryItems, error } = await supabase
    .from("gallery_items")
    .select(`
      *,
      author:profiles!gallery_items_created_by_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching gallery:", error.message);

  // 3. Robust Server Action: Handles both Direct File Upload to Bucket & URL insertion
  async function handleCreateGalleryItem(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const caption = formData.get("caption") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const imageFile = formData.get("imageFile") as File | null;
    const altText = formData.get("altText") as string || title;
    const status = (formData.get("status") as "draft" | "published" | "archived") || "draft";

    let finalImagePath = imageUrl;

    // A. Use Admin Client for Storage to guarantee RLS bypass during background upload
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // B. If a file was uploaded, push it to Supabase 'gallery' bucket
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from("gallery")
        .upload(fileName, imageFile, {
          cacheControl: imageFile.type,
          upsert: false
        });

      if (uploadError) {
        console.error("Storage upload failed:", uploadError.message);
        return; // In production, redirect with error toast
      }
      
      // Save the bucket path to DB
      finalImagePath = uploadData.path;
    }

    // Require at least one media source
    if (!finalImagePath) {
      console.error("No image provided");
      return;
    }

    // C. Insert into Database
    const { error: insertError } = await supabaseAdmin
      .from("gallery_items")
      .insert([
        {
          title,
          image_path: finalImagePath, 
          alt_text: altText,
          caption,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to add gallery item:", insertError.message);
      return;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
  }

  // 4. Server Action to Rotate Status
  async function handleRotateStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const itemId = formData.get("itemId") as string;
    const currentStatus = formData.get("currentStatus") as string;

    let newStatus: "draft" | "published" | "archived" = "draft";
    if (currentStatus === "draft") newStatus = "published";
    else if (currentStatus === "published") newStatus = "archived";
    else if (currentStatus === "archived") newStatus = "draft";

    const { error: updateError } = await supabaseServer
      .from("gallery_items")
      .update({ 
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null
      })
      .eq("id", itemId);

    if (updateError) {
      console.error("Failed to update status:", updateError.message);
      return;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
  }

  // 5. Server Action to Delete an Item
  async function handleDeleteGalleryItem(formData: FormData) {
    "use server";
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const itemId = formData.get("itemId") as string;
    const imagePath = formData.get("imagePath") as string;

    // A. Delete from Storage Bucket if it's not an external URL
    if (imagePath && !imagePath.startsWith("http")) {
      await supabaseAdmin.storage.from("gallery").remove([imagePath]);
    }

    // B. Delete from DB
    const { error: deleteError } = await supabaseAdmin
      .from("gallery_items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      console.error("Failed to delete gallery item:", deleteError.message);
      return;
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Published</Badge>;
      case 'draft':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Draft</Badge>;
      default:
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]">Archived</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header */}
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Upload Form Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards xl:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-accent" /> Add New Image
            </CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Upload directly or provide an external URL.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={handleCreateGalleryItem} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Image Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Hackathon 2026 Winners" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              {/* MEDIA SOURCE: FILE UPLOAD OR URL */}
              <div className="space-y-4 p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="space-y-2.5">
                  <Label htmlFor="imageFile" className="text-foreground font-bold ml-1">Upload File (Recommended)</Label>
                  <Input 
                    id="imageFile" 
                    name="imageFile" 
                    type="file"
                    accept="image/*"
                    className="bg-black/20 border-white/10 text-foreground file:bg-accent file:text-white file:border-0 file:rounded-lg file:px-4 file:py-1.5 file:mr-4 file:font-bold hover:file:bg-accent/90 file:transition-colors cursor-pointer h-12 pt-1.5"
                  />
                </div>
                <div className="flex items-center gap-3 opacity-60">
                  <div className="h-px bg-white/20 flex-1"></div>
                  <span className="text-[10px] font-bold uppercase tracking-wider">OR PASTE URL</span>
                  <div className="h-px bg-white/20 flex-1"></div>
                </div>
                <div className="space-y-2.5">
                  <Input 
                    id="imageUrl" 
                    name="imageUrl" 
                    type="url"
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="caption" className="text-foreground font-bold ml-1">Caption (Optional)</Label>
                <Textarea 
                  id="caption" 
                  name="caption" 
                  placeholder="A short description of the moment..." 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[90px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Visibility Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="published"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="draft" className="bg-gray-900 text-white">Draft (Hidden)</option>
                    <option value="published" className="bg-gray-900 text-emerald-400">Published (Live)</option>
                    <option value="archived" className="bg-gray-900 text-red-400">Archived</option>
                  </select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Publish to Gallery
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Media Library Table Card */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards xl:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Media Library</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              All uploaded images visible on the public community gallery.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[700px]">
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
                    const uploaderObj = Array.isArray(item.author) ? item.author[0] : item.author;
                    const uploader = uploaderObj?.full_name;
                    
                    // Native HTML img to prevent Next.js host crashes
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
                        <TableCell className="pl-8 py-4 align-top">
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                            <img src={imageUrl} alt={item.alt_text || "Preview"} className="w-full h-full object-cover opacity-90" />
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <div className="font-bold text-foreground drop-shadow-sm">{item.title}</div>
                          <div className="text-xs font-medium text-[#E2D1FE]/50 line-clamp-2 mt-1 max-w-[200px]">{item.caption || "No caption"}</div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          {getStatusBadge(item.status)}
                        </TableCell>
                        <TableCell className="py-4 text-sm font-semibold text-[#E2D1FE]/80 align-top">
                          {uploader || "Admin"}
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4 align-top">
                          <div className="flex justify-end gap-2 mt-1">
                            <form action={handleRotateStatus}>
                              <input type="hidden" name="itemId" value={item.id} />
                              <input type="hidden" name="currentStatus" value={item.status} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-[#E2D1FE]/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold cursor-pointer" title="Click to rotate status">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </Button>
                            </form>
                            <form action={handleDeleteGalleryItem}>
                              <input type="hidden" name="itemId" value={item.id} />
                              <input type="hidden" name="imagePath" value={item.image_path} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold cursor-pointer">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </form>
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
    </div>
  );
}
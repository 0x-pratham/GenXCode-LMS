import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Newspaper, Plus, RefreshCw } from "lucide-react";

export default async function BlogsAdminPage() {
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

  // 2. Fetch all blog posts along with author profiles and cover_url
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id, title, slug, status, created_at, published_at, cover_url,
      author:profiles!posts_author_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error.message);
  }

  // 3. Bulletproof Server Action to Create a Blog Post with Banner URL
  async function handleCreatePost(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const bannerUrl = formData.get("bannerUrl") as string;
    const bodyText = formData.get("body") as string;
    const status = (formData.get("status") as "draft" | "published" | "archived") || "draft";

    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const { error: insertError } = await supabaseServer
      .from("posts")
      .insert([
        {
          title,
          slug,
          excerpt,
          cover_url: bannerUrl || null, // Storing banner URL to schema's cover_url column
          body: { markdown: bodyText },
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
          author_id: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to create post:", insertError.message);
      return;
    }

    revalidatePath("/admin/blogs");
  }

  // 4. Server Action to Rotate Status
  async function handleRotateStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const postId = formData.get("postId") as string;
    const currentStatus = formData.get("currentStatus") as string;

    let newStatus: "draft" | "published" | "archived" = "draft";
    if (currentStatus === "draft") newStatus = "published";
    else if (currentStatus === "published") newStatus = "archived";
    else if (currentStatus === "archived") newStatus = "draft";

    const { error: updateError } = await supabaseServer
      .from("posts")
      .update({ 
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null
      })
      .eq("id", postId);

    if (updateError) {
      console.error("Failed to update post status:", updateError.message);
      return;
    }

    revalidatePath("/admin/blogs");
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
              <Newspaper className="w-7 h-7 text-accent" />
            </div>
            <div>
              Content & <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Blogs</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Write, edit, and publish engineering articles, tutorials, and community blogs.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Create Post Form Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards xl:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Write Post</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Create a new publication for your readers.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={handleCreatePost} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Post Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Scaling Next.js Apps" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="excerpt" className="text-foreground font-bold ml-1">Short Excerpt</Label>
                <Input 
                  id="excerpt" 
                  name="excerpt" 
                  placeholder="Brief summary of the article..." 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="bannerUrl" className="text-foreground font-bold ml-1">Banner URL (Optional)</Label>
                <Input 
                  id="bannerUrl" 
                  name="bannerUrl" 
                  type="url"
                  placeholder="https://images.unsplash.com/..." 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="body" className="text-foreground font-bold ml-1">Content Body</Label>
                <Textarea 
                  id="body" 
                  name="body" 
                  placeholder="Write your article markdown/content here..." 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[140px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Publication Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="draft"
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
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Publish / Save Post
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Blogs Table Card */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards xl:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">All Posts</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Manage your CMS content and publication visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Title</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Author</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Date Created</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts && posts.length > 0 ? (
                  posts.map((post, index) => {
                    const authorObj = Array.isArray(post.author) ? post.author[0] : post.author;
                    const authorName = authorObj?.full_name || "Unknown Author";
                    const animationDelay = `${(index + 3) * 100}ms`;
                    
                    return (
                      <TableRow 
                        key={post.id}
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 align-top">
                          <div className="font-bold text-foreground drop-shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {post.cover_url ? (
                                <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover opacity-80" />
                              ) : (
                                <Newspaper className="w-4 h-4 text-accent" />
                              )}
                            </div>
                            <span className="line-clamp-1">{post.title}</span>
                          </div>
                          <div className="text-xs font-medium text-[#E2D1FE]/50 ml-13 mt-0.5">/{post.slug}</div>
                        </TableCell>
                        <TableCell className="py-4 text-sm font-semibold text-[#E2D1FE]/80 align-top">
                          {authorName}
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          {getStatusBadge(post.status)}
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4 align-top">
                          <form action={handleRotateStatus} className="inline-block">
                            <input type="hidden" name="postId" value={post.id} />
                            <input type="hidden" name="currentStatus" value={post.status} />
                            <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-[#E2D1FE]/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold" title="Click to rotate status">
                              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-accent" /> Rotate Status
                            </Button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No posts created yet.
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
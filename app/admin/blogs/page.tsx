import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Newspaper, Plus, Edit } from "lucide-react";

export default async function BlogsAdminPage() {
  const supabase = await createClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id, title, slug, status, created_at,
      author:profiles ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching posts:", error);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-accent" />
            Content / Blogs
          </h1>
          <p className="text-foreground/70 mt-1">Write, edit, and publish engineering blogs & articles.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Write Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Manage your CMS content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((post) => {
                  const authorName = Array.isArray(post.author) ? post.author[0]?.full_name : post.author?.full_name;
                  
                  return (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="font-medium text-primary">{post.title}</div>
                        <div className="text-xs text-foreground/50">/{post.slug}</div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">{authorName || "Unknown"}</TableCell>
                      <TableCell>
                        {post.status === 'published' ? (
                          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Published</Badge>
                        ) : post.status === 'draft' ? (
                          <Badge variant="outline" className="text-foreground/50 border-dashed">Draft</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500 border-none">Archived</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">
                        {new Date(post.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-foreground/50 hover:text-primary">
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
                    No posts created yet.
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
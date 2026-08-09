import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Plus, Calendar, Trash2, RefreshCw } from "lucide-react";

export default async function AdminAnnouncementsPage() {
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

  // 2. Fetch all announcements
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching announcements:", error.message);
  }

  // 3. Server Action: Create New Announcement
  async function handleCreateAnnouncement(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const bodyText = formData.get("body") as string;
    const status = (formData.get("status") as "draft" | "published" | "archived") || "published";

    const { error: insertError } = await supabaseServer
      .from("announcements")
      .insert([
        {
          title,
          body: bodyText,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to post announcement:", insertError.message);
      return;
    }

    revalidatePath("/admin/announcements");
  }

  // 4. Server Action: Rotate Status
  async function handleRotateStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const announcementId = formData.get("announcementId") as string;
    const currentStatus = formData.get("currentStatus") as string;

    let newStatus: "draft" | "published" | "archived" = "draft";
    if (currentStatus === "draft") newStatus = "published";
    else if (currentStatus === "published") newStatus = "archived";
    else if (currentStatus === "archived") newStatus = "draft";

    const { error: updateError } = await supabaseServer
      .from("announcements")
      .update({ 
        status: newStatus,
        published_at: newStatus === "published" ? new Date().toISOString() : null
      })
      .eq("id", announcementId);

    if (updateError) {
      console.error("Failed to update status:", updateError.message);
      return;
    }

    revalidatePath("/admin/announcements");
  }

  // 5. Server Action: Delete Announcement
  async function handleDeleteAnnouncement(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const announcementId = formData.get("announcementId") as string;

    const { error: deleteError } = await supabaseServer
      .from("announcements")
      .delete()
      .eq("id", announcementId);

    if (deleteError) {
      console.error("Failed to delete announcement:", deleteError.message);
      return;
    }

    revalidatePath("/admin/announcements");
  }

  // Refined Status Badges for Glass Theme
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
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Megaphone className="w-7 h-7 text-accent" />
            </div>
            <div>
              Announcements & <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Broadcasts</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Post system updates, community news, and real-time alerts for all active students.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Announcement Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Post Announcement</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Broadcast a message to the entire platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={handleCreateAnnouncement} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Weekend Hackathon Live!" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="body" className="text-foreground font-bold ml-1">Message Body</Label>
                <Textarea 
                  id="body" 
                  name="body" 
                  placeholder="Write your announcement details here..." 
                  rows={4} 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[120px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="published"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="published" className="bg-gray-900 text-emerald-400">Published (Live)</option>
                    <option value="draft" className="bg-gray-900 text-white">Draft (Hidden)</option>
                    <option value="archived" className="bg-gray-900 text-red-400">Archived</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Broadcast Now
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Announcements Table */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Broadcast History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Message</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status & Date</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements && announcements.length > 0 ? (
                  announcements.map((item, index) => {
                    const animationDelay = `${(index + 4) * 100}ms`;

                    return (
                      <TableRow 
                        key={item.id}
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 space-y-1 align-top w-1/2">
                          <div className="font-bold text-foreground text-base drop-shadow-sm flex items-start gap-2.5">
                            <div className="w-8 h-8 mt-1 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Megaphone className="w-4 h-4 text-accent" />
                            </div>
                            <div className="space-y-1">
                              <span className="line-clamp-1">{item.title}</span>
                              <div className="text-xs font-medium text-[#E2D1FE]/60 line-clamp-2">
                                {item.body}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-2 w-fit">
                            {getStatusBadge(item.status)}
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#E2D1FE]/50">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4 align-top">
                          <div className="flex justify-end gap-2 mt-1">
                            <form action={handleRotateStatus}>
                              <input type="hidden" name="announcementId" value={item.id} />
                              <input type="hidden" name="currentStatus" value={item.status} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-[#E2D1FE]/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold" title="Click to rotate status">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </Button>
                            </form>
                            <form action={handleDeleteAnnouncement}>
                              <input type="hidden" name="announcementId" value={item.id} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold">
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
                    <TableCell colSpan={3} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No announcements broadcasted yet.
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
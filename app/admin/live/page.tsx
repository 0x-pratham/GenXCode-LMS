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
import { Video, Plus, Calendar, Link as LinkIcon } from "lucide-react";

export default async function AdminLiveSessionsPage() {
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

  // 2. Fetch existing sessions directly
  const { data: sessions, error } = await supabase
    .from("live_sessions")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Error fetching live sessions:", error.message);
  }

  // 3. Bulletproof Server Action for Creating a Live Session
  async function createLiveSession(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const provider = formData.get("provider") as "zoom" | "google_meet";
    const durationMins = parseInt(formData.get("duration") as string) || 60;
    const startsAtStr = formData.get("startsAt") as string;
    const meetingUrl = formData.get("meetingUrl") as string;
    const status = formData.get("status") as "draft" | "published";
    
    // Calculate ends_at based on startsAt + duration
    const startsAt = new Date(startsAtStr);
    const endsAt = new Date(startsAt.getTime() + durationMins * 60000);

    const { error: insertError } = await supabaseServer
      .from("live_sessions")
      .insert([
        {
          title: title,
          description: description,
          provider: provider,
          meeting_url: meetingUrl,
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          status: status,
          host_id: currentUser.id,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to create live session:", insertError.message);
      return;
    }

    revalidatePath(`/admin/live-sessions`);
  }

  // 4. Server Action to toggle status (Publish <-> Draft)
  async function toggleSessionStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const sessionId = formData.get("sessionId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error: updateError } = await supabaseServer
      .from("live_sessions")
      .update({ status: newStatus })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Failed to update status:", updateError.message);
      return;
    }

    revalidatePath(`/admin/live-sessions`);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Video className="w-7 h-7 text-accent" />
            </div>
            <div>
              Schedule <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Masterclasses</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Host live sessions via Zoom or Google Meet and sync them to student portals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Session Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Schedule New Session</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Notify students about an upcoming live class.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={createLiveSession} className="space-y-6">
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Topic / Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Intro to Supabase Auth" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Agenda (Description)</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="What will be covered?" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="provider" className="text-foreground font-bold ml-1">Platform</Label>
                  <div className="relative">
                    <select 
                      id="provider" 
                      name="provider" 
                      className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="zoom" className="bg-gray-900 text-white">Zoom</option>
                      <option value="google_meet" className="bg-gray-900 text-white">Google Meet</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="duration" className="text-foreground font-bold ml-1">Duration (mins)</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    defaultValue="60" 
                    required 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="startsAt" className="text-foreground font-bold ml-1">Start Date & Time</Label>
                <Input 
                  id="startsAt" 
                  name="startsAt" 
                  type="datetime-local" 
                  required 
                  className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm cursor-pointer"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="meetingUrl" className="text-foreground font-bold ml-1">Meeting Link (URL)</Label>
                <Input 
                  id="meetingUrl" 
                  name="meetingUrl" 
                  type="url" 
                  placeholder="https://zoom.us/j/..." 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Visibility</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="draft"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="published" className="bg-gray-900 text-emerald-400">Published (Live)</option>
                    <option value="draft" className="bg-gray-900 text-[#E2D1FE]">Draft (Hidden)</option>
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
                <Plus className="w-4 h-4 mr-2" /> Schedule Session
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Sessions Table - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Session History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[600px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Topic</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Platform</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4 whitespace-nowrap">Schedule</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status (Click to toggle)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions && sessions.length > 0 ? (
                  sessions.map((session, index) => {
                    const animationDelay = `${(index + 4) * 100}ms`;
                    const isPublished = session.status === 'published';

                    return (
                      <TableRow 
                        key={session.id} 
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 font-bold text-foreground drop-shadow-sm">
                          <div className="line-clamp-2 max-w-[200px]">{session.title}</div>
                          <a 
                            href={session.meeting_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent mt-1 hover:underline drop-shadow-sm"
                          >
                            <LinkIcon className="w-3 h-3" /> Join Link
                          </a>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold bg-white/5 border-white/10 text-[#E2D1FE] px-2.5 py-1 whitespace-nowrap">
                            {session.provider.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-sm font-medium text-[#E2D1FE]/70 bg-black/40 w-fit px-3 py-1.5 rounded-lg border border-white/5 shadow-inner">
                            <Calendar className="w-4 h-4 text-accent" />
                            {new Date(session.starts_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-8">
                          {/* Toggle Form mapped directly to the Badge */}
                          <form action={toggleSessionStatus} className="inline-block">
                            <input type="hidden" name="sessionId" value={session.id} />
                            <input type="hidden" name="currentStatus" value={session.status} />
                            <button type="submit" className="transition-transform hover:scale-105 active:scale-95" title="Click to toggle status">
                              <Badge 
                                variant="outline" 
                                className={`capitalize px-3 py-1 font-bold backdrop-blur-md border cursor-pointer ${
                                  isPublished 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                    : 'bg-white/5 text-[#E2D1FE]/60 border-white/10'
                                }`}
                              >
                                {session.status}
                              </Badge>
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No live sessions found. Schedule your first class!
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
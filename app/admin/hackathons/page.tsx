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
import { Rocket, Plus, Calendar, Users, ShieldAlert } from "lucide-react";

export default async function AdminHackathonsPage() {
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

  // 2. Fetch all profiles to map member UUIDs to their actual names/emails
  const { data: profilesData } = await supabase
    .from("profiles")
    .select("id, full_name, email");
    
  const profileMap = new Map();
  profilesData?.forEach(p => profileMap.set(p.id, p));

  // 3. Fetch existing Hackathons along with registered teams and their leaders
  const { data: hackathons, error } = await supabase
    .from("hackathons")
    .select(`
      *,
      teams:hackathon_teams(
        id, 
        name, 
        members,
        leader:profiles!leader_id(full_name, email)
      )
    `)
    .order("starts_at", { ascending: false });

  if (error) {
    console.error("Supabase error fetching hackathons:", error.message);
  }

  // 4. Bulletproof Server Action for Creating a Hackathon
  async function createHackathon(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const startsAtStr = formData.get("startsAt") as string;
    const endsAtStr = formData.get("endsAt") as string;
    const bannerUrl = formData.get("bannerUrl") as string;
    const status = formData.get("status") as "draft" | "announced" | "open" | "judging" | "completed";
    const teamMinSize = parseInt(formData.get("teamMinSize") as string) || 1;
    const teamMaxSize = parseInt(formData.get("teamMaxSize") as string) || 4;

    // Auto-generate a clean URL-friendly slug
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

    const { error: insertError } = await supabaseServer
      .from("hackathons")
      .insert([
        {
          title: title,
          slug: slug,
          description: description,
          starts_at: new Date(startsAtStr).toISOString(),
          ends_at: new Date(endsAtStr).toISOString(),
          banner_url: bannerUrl || null,
          status: status,
          team_min_size: teamMinSize,
          team_max_size: teamMaxSize,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to create hackathon:", insertError.message);
      return;
    }

    revalidatePath(`/admin/hackathons`);
  }

  // 5. Server Action to Rotate Status on Click
  async function rotateHackathonStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const hackathonId = formData.get("hackathonId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    
    // State machine for status rotation according to schema constraints
    let newStatus = "draft";
    if (currentStatus === "draft") newStatus = "announced";
    else if (currentStatus === "announced") newStatus = "open";
    else if (currentStatus === "open") newStatus = "judging";
    else if (currentStatus === "judging") newStatus = "completed";
    else if (currentStatus === "completed") newStatus = "draft";

    const { error } = await supabaseServer
      .from("hackathons")
      .update({ status: newStatus })
      .eq("id", hackathonId);

    if (error) {
      console.error("Failed to update status:", error.message);
      return;
    }

    revalidatePath(`/admin/hackathons`);
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Open (Live)</Badge>;
      case 'announced':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]">Announced</Badge>;
      case 'judging':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]">Judging</Badge>;
      case 'completed':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Completed</Badge>;
      default:
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/50 border-white/10">Draft</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Rocket className="w-7 h-7 text-accent" />
            </div>
            <div>
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Hackathons</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Create events, monitor team registrations, and update live status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Create Hackathon Form */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards xl:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Launch New Event</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Setup a new hackathon for the students.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={createHackathon} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Event Title</Label>
                <Input id="title" name="title" placeholder="e.g., Summer Web3 Buildathon" required className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"/>
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Brief Description</Label>
                <Textarea id="description" name="description" placeholder="What are we building?" required className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="teamMinSize" className="text-foreground font-bold ml-1">Min Team Size</Label>
                  <Input id="teamMinSize" name="teamMinSize" type="number" min="1" defaultValue="1" required className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 backdrop-blur-sm" />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="teamMaxSize" className="text-foreground font-bold ml-1">Max Team Size</Label>
                  <Input id="teamMaxSize" name="teamMaxSize" type="number" min="1" defaultValue="4" required className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 backdrop-blur-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="startsAt" className="text-foreground font-bold ml-1">Starts At</Label>
                  <Input id="startsAt" name="startsAt" type="datetime-local" required className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 text-xs backdrop-blur-sm cursor-pointer"/>
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="endsAt" className="text-foreground font-bold ml-1">Ends At</Label>
                  <Input id="endsAt" name="endsAt" type="datetime-local" required className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 text-xs backdrop-blur-sm cursor-pointer"/>
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="bannerUrl" className="text-foreground font-bold ml-1">Banner URL (Optional)</Label>
                <Input id="bannerUrl" name="bannerUrl" placeholder="https://..." type="url" className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"/>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Event Status</Label>
                <div className="relative">
                  <select id="status" name="status" defaultValue="draft" className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer">
                    <option value="draft" className="bg-gray-900 text-white">Draft (Hidden)</option>
                    <option value="announced" className="bg-gray-900 text-blue-400">Announced (Visible)</option>
                    <option value="open" className="bg-gray-900 text-emerald-400">Open (Live)</option>
                    <option value="judging" className="bg-gray-900 text-amber-400">Judging</option>
                    <option value="completed" className="bg-gray-900 text-white">Completed</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg">
                <Plus className="w-4 h-4 mr-2" /> Launch Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Event History & Registrations */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards xl:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Event History & Registrations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Event</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4 whitespace-nowrap">Timeline</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Registered Teams</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hackathons && hackathons.length > 0 ? (
                  hackathons.map((hackathon, index) => {
                    const animationDelay = `${(index + 4) * 100}ms`;
                    const teams = Array.isArray(hackathon.teams) ? hackathon.teams : (hackathon.teams ? [hackathon.teams] : []);
                    const teamCount = teams.length;

                    return (
                      <TableRow 
                        key={hackathon.id}
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 align-top">
                          <div className="font-bold text-foreground drop-shadow-sm flex items-center gap-3 mb-1">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden relative">
                              {hackathon.banner_url ? (
                                <img src={hackathon.banner_url} alt={hackathon.title} className="w-full h-full object-cover opacity-80" />
                              ) : (
                                <Rocket className="w-4 h-4 text-accent" />
                              )}
                            </div>
                            <span className="line-clamp-2 max-w-[200px]">{hackathon.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap align-top">
                          <div className="flex items-center gap-2 text-[11px] font-medium text-[#E2D1FE]/70 bg-black/40 w-fit px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {new Date(hackathon.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                            <span className="text-white/20 mx-1">→</span> 
                            {new Date(hackathon.ends_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4 align-top">
                          <div className="flex flex-col gap-2.5">
                            <Badge variant="outline" className="w-fit bg-accent/10 text-accent border-accent/20 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1">
                              <Users className="w-3 h-3" /> {teamCount} {teamCount === 1 ? 'Team' : 'Teams'}
                            </Badge>
                            
                            {teamCount > 0 ? (
                              <div className="flex flex-col gap-2 mt-1 max-w-[280px]">
                                {teams.map((t: any) => (
                                  <div key={t.id} className="text-xs bg-black/20 p-2.5 rounded-md border border-white/5">
                                    <span className="font-bold text-[#E2D1FE] block mb-1.5">{t.name}</span>
                                    
                                    <div className="text-white/70 text-[11px] space-y-1">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-accent font-semibold">Lead:</span> 
                                        <span className="truncate">{t.leader?.full_name || t.leader?.email || "Unknown"}</span>
                                      </div>
                                      
                                      {t.members?.length > 0 && (
                                        <div className="flex flex-col gap-0.5 mt-1 pl-2 border-l border-white/10">
                                          {t.members.map((memberId: string) => {
                                            const member = profileMap.get(memberId);
                                            return (
                                              <span key={memberId} className="text-white/50 text-[10px] truncate">
                                                • {member?.full_name || member?.email || "Unknown Member"}
                                              </span>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs italic text-[#E2D1FE]/30 flex items-center gap-1.5 mt-1">
                                <ShieldAlert className="w-3.5 h-3.5 opacity-50" /> No registrations yet
                              </div>
                            )}
                          </div>
                        </TableCell>

                        <TableCell className="text-right pr-8 py-4 align-top">
                          <form action={rotateHackathonStatus} className="inline-block mt-1">
                            <input type="hidden" name="hackathonId" value={hackathon.id} />
                            <input type="hidden" name="currentStatus" value={hackathon.status} />
                            <button type="submit" className="transition-transform hover:scale-105 active:scale-95" title="Click to rotate status">
                              {getStatusBadge(hackathon.status)}
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No events found. Start planning a hackathon!
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
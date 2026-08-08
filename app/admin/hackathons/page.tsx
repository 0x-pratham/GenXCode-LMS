import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Rocket, Plus, Image as ImageIcon, Calendar } from "lucide-react";
import { createHackathon } from "@/app/actions/adminActions";

export default async function AdminHackathonsPage() {
  const supabase = await createClient();
  
  // Backend Logic Remains Unchanged[cite: 28]
  // Use "starts_at" instead of start_date to match your schema[cite: 28]
  const { data: hackathons, error } = await supabase
    .from("hackathons")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error) {
    // This will now print the actual helpful error if any occurs[cite: 28]
    console.error("Supabase error fetching hackathons:", error.message);
  }

  // Refined Status Badges for Glass Theme
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
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Rocket className="w-7 h-7 text-accent" />
            </div>
            <div>
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Hackathons</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Create, manage, and monitor competitive coding hackathons and student events.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Hackathon Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col">
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
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Summer Web3 Buildathon" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Brief Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="What are we building?" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="startsAt" className="text-foreground font-bold ml-1">Starts At</Label>
                  <Input 
                    id="startsAt" 
                    name="startsAt" 
                    type="datetime-local" 
                    required 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="endsAt" className="text-foreground font-bold ml-1">Ends At</Label>
                  <Input 
                    id="endsAt" 
                    name="endsAt" 
                    type="datetime-local" 
                    required 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="bannerUrl" className="text-foreground font-bold ml-1">Banner URL (Optional)</Label>
                <Input 
                  id="bannerUrl" 
                  name="bannerUrl" 
                  placeholder="https://..." 
                  type="url" 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Event Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none"
                >
                  <option value="draft" className="bg-[#1a0b2e] text-white">Draft (Hidden)</option>
                  <option value="announced" className="bg-[#1a0b2e] text-white">Announced (Visible)</option>
                  <option value="open" className="bg-[#1a0b2e] text-white">Open (Live)</option>
                  <option value="judging" className="bg-[#1a0b2e] text-white">Judging</option>
                  <option value="completed" className="bg-[#1a0b2e] text-white">Completed</option>
                </select>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Launch Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Hackathons Table - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Event History</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Table>
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Event</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Timeline</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hackathons && hackathons.length > 0 ? (
                  hackathons.map((hackathon, index) => {
                    const animationDelay = `${(index + 4) * 100}ms`;

                    return (
                      <TableRow 
                        key={hackathon.id}
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4">
                          <div className="font-bold text-foreground drop-shadow-sm flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              {hackathon.banner_url ? <ImageIcon className="w-4 h-4 text-accent" /> : <Rocket className="w-4 h-4 text-accent" />}
                            </div>
                            <span className="line-clamp-1">{hackathon.title}</span>
                          </div>
                          <div className="text-xs font-medium text-[#E2D1FE]/50 ml-10.5">Slug: {hackathon.slug}</div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-[#E2D1FE]/70 bg-black/40 w-fit px-3 py-1.5 rounded-lg border border-white/5">
                            <Calendar className="w-3.5 h-3.5 text-accent" />
                            {new Date(hackathon.starts_at).toLocaleDateString()} - {new Date(hackathon.ends_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4">
                          {getStatusBadge(hackathon.status)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={3} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
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
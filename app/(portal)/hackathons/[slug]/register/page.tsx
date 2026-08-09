import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Code, Plus, ArrowLeft } from "lucide-react";

export default async function RegisterTeamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const supabase = await createClient();
  const { slug } = await params;

  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 2. Fetch Hackathon Details
  const { data: hackathon, error: hackathonError } = await supabase
    .from("hackathons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (hackathonError || !hackathon) {
    redirect("/hackathons");
  }

  // 3. Fetch All Eligible Students (excluding the current user so they don't select themselves as a member)
  const { data: students, error: studentsError } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "student")
    .neq("id", user.id)
    .order("full_name", { ascending: true });

  if (studentsError) console.error("Error fetching students:", studentsError.message);

  // 4. Server Action to Register Team
  async function registerHackathonTeam(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const teamName = formData.get("teamName") as string;
    
    // Extract all member selections. Since we dynamically render member slots, we grab them by name prefix.
    const memberIds: string[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("member_") && value && value !== "none") {
        memberIds.push(value as string);
      }
    }

    // Insert into hackathon_teams schema
    const { error: insertError } = await supabaseServer
      .from("hackathon_teams")
      .insert([
        {
          hackathon_id: hackathon.id,
          name: teamName,
          leader_id: currentUser.id,
          members: memberIds // Storing as uuid[] exactly as schema demands
        }
      ]);

    if (insertError) {
      console.error("Failed to register team:", insertError.message);
      // In a real scenario, you might return an error string to display in UI.
      return;
    }

    // Redirect to the hackathon's workspace/details page after successful registration
    revalidatePath("/hackathons");
    redirect(`/hackathons`); 
  }

  // Calculate how many member selection dropdowns to show.
  // team_max_size includes the leader. So additional members = max_size - 1.
  const additionalMemberSlots = Math.max(0, hackathon.team_max_size - 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Back Navigation & Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
        <Link href="/hackathons" className="inline-flex items-center text-sm font-bold text-[#E2D1FE]/70 hover:text-accent transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Hackathons
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
            <Code className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground drop-shadow-lg">
              Register <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Team</span>
            </h1>
            <p className="text-[#E2D1FE]/80 mt-2 text-sm font-medium drop-shadow-md max-w-xl">
              Entering <span className="text-white font-bold">{hackathon.title}</span>. You will automatically be set as the Team Leader.
            </p>
          </div>
        </div>
      </div>

      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" /> Team Composition
          </CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Pick your squad. Team size must be between {hackathon.team_min_size} and {hackathon.team_max_size} members.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-8 pb-8">
          <form action={registerHackathonTeam} className="space-y-8">
            
            {/* Team Name Input */}
            <div className="space-y-3">
              <Label htmlFor="teamName" className="text-foreground font-bold ml-1 text-base">Squad Name</Label>
              <Input 
                id="teamName" 
                name="teamName" 
                placeholder="e.g., The Code Architects" 
                required 
                className="bg-black/40 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-14 text-lg backdrop-blur-sm shadow-inner"
              />
              <p className="text-[11px] font-medium text-[#E2D1FE]/50 ml-1">Make it unique and memorable.</p>
            </div>

            {/* Dynamic Member Dropdowns */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <Label className="text-foreground font-bold ml-1 text-base">Select Members (Optional)</Label>
              <p className="text-xs font-medium text-[#E2D1FE]/60 ml-1 mb-4">Choose registered students to join your team. You are already included as the leader.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: additionalMemberSlots }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`member_${index}`} className="text-xs font-bold text-[#E2D1FE]/70 ml-1">Member {index + 2}</Label>
                    <div className="relative">
                      <select 
                        id={`member_${index}`} 
                        name={`member_${index}`} 
                        defaultValue="none"
                        className="w-full appearance-none bg-black/40 border border-white/10 text-foreground text-sm font-medium rounded-xl h-12 px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                      >
                        <option value="none" className="bg-gray-900 text-[#E2D1FE]/50">-- Select a Student --</option>
                        {students?.map(st => (
                          <option key={st.id} value={st.id} className="bg-gray-900 text-white">
                            {st.full_name || st.email}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-white/5">
              <Button 
                type="submit" 
                className="w-full sm:w-auto h-14 px-10 rounded-xl bg-brand-gradient text-foreground border-none font-bold text-lg accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-xl"
              >
                <Plus className="w-5 h-5 mr-2" /> Complete Registration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
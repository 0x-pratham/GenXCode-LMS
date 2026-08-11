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
import { Trophy, Plus, Flame, Crown, Medal, Award } from "lucide-react";

export default async function LeaderboardAdminPage() {
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

  // 2. Fetch active season
  const { data: activeSeason } = await supabase
    .from("leaderboard_seasons")
    .select("id, name")
    .eq("is_active", true)
    .maybeSingle();

  // 3. Fetch all active student profiles and all xp_events to compute accurate total XP dynamically
  const [{ data: profiles }, { data: xpEvents }, { data: memberships }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, role").eq("is_active", true),
    supabase.from("xp_events").select("user_id, amount"),
    supabase.from("league_memberships").select("user_id, league")
  ]);

  // Calculate total XP per user from xp_events table for absolute reliability
  const xpMap = new Map<string, number>();
  xpEvents?.forEach(ev => {
    const current = xpMap.get(ev.user_id) || 0;
    xpMap.set(ev.user_id, current + Number(ev.amount));
  });

  // Map memberships for league badges
  const leagueMap = new Map<string, string>();
  memberships?.forEach(m => {
    leagueMap.set(m.user_id, m.league);
  });

  // Combine and sort rankings descending by total XP
  const rankings = profiles?.map(profile => {
    const totalXp = xpMap.get(profile.id) || 0;
    const league = leagueMap.get(profile.id) || "code_starter";
    return {
      id: profile.id,
      user_id: profile.id,
      user: { full_name: profile.full_name, email: profile.email },
      league: league,
      xp_total: totalXp,
    };
  }).sort((a, b) => b.xp_total - a.xp_total) || [];

  // Filter students dropdown list for manual XP assignment
  const students = profiles?.filter(p => p.role === 'student' || p.role === 'mentor') || [];

  // 4. Server Action for Manual XP Assignment (Using Admin Client)
  async function markManualXP(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const studentId = formData.get("studentId") as string;
    const amountStr = formData.get("amount") as string;
    const isPenalty = formData.get("type") === "penalty";
    
    let amount = parseInt(amountStr) || 0;
    if (amount <= 0) return; 
    if (isPenalty) amount = -Math.abs(amount); 

    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // A. Insert into xp_events table (Source of truth for all XP)[cite: 14]
    const { error: eventError } = await supabaseAdmin
      .from("xp_events")
      .insert([
        {
          user_id: studentId,
          season_id: activeSeason ? activeSeason.id : null,
          source_type: "manual",
          amount: amount,
          awarded_by: currentUser.id
        }
      ]);

    if (eventError) {
      console.error("Failed to log XP event:", eventError.message);
      return;
    }

    // B. Recalculate total XP from all events for this user and sync league_memberships
    const { data: userEvents } = await supabaseAdmin
      .from("xp_events")
      .select("amount")
      .eq("user_id", studentId);

    const calculatedTotalXp = userEvents?.reduce((sum, ev) => sum + Number(ev.amount), 0) || 0;

    // Upsert into league_memberships so the total reflects everywhere instantly
    await supabaseAdmin
      .from("league_memberships")
      .upsert({
        user_id: studentId,
        season_id: activeSeason ? activeSeason.id : null,
        xp_total: Math.max(0, calculatedTotalXp),
        league: calculatedTotalXp > 500 ? "code_champion" : calculatedTotalXp > 200 ? "code_builder" : "code_starter"
      }, { onConflict: 'season_id, user_id' });

    revalidatePath("/admin/leaderboard");
    revalidatePath("/leaderboard");
    revalidatePath("/dashboard");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Trophy className="w-7 h-7 text-accent" />
            </div>
            <div>
              XP & <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Leaderboard</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Manage active seasons, grant manual experience points, and view global rankings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Manual XP Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" /> Grant Manual XP
            </CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Add bonus points or apply penalty deductions.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={markManualXP} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="studentId" className="text-foreground font-bold ml-1">Student</Label>
                <div className="relative">
                  <select 
                    id="studentId" 
                    name="studentId" 
                    defaultValue=""
                    required
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-gray-900 text-[#E2D1FE]/50">Select Student...</option>
                    {students.map(st => (
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="type" className="text-foreground font-bold ml-1">Action Type</Label>
                  <div className="relative">
                    <select 
                      id="type" 
                      name="type" 
                      defaultValue="bonus"
                      className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="bonus" className="bg-gray-900 text-emerald-400">Add Bonus</option>
                      <option value="penalty" className="bg-gray-900 text-red-400">Deduct XP</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="amount" className="text-foreground font-bold ml-1">XP Amount</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number" 
                    placeholder="e.g. 100" 
                    min="1"
                    required 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" /> Apply Manual Action
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Global Rankings Table Card */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground flex items-center justify-between">
              Global Rankings
              {activeSeason && (
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20 px-3 py-1 font-bold text-xs uppercase tracking-wider">
                  Active: {activeSeason.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4 w-20">Rank</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Student</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">League</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Total XP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings && rankings.length > 0 ? (
                  rankings.map((entry, index) => {
                    const userName = entry.user?.full_name;
                    const email = entry.user?.email;
                    const rank = index + 1;
                    const animationDelay = `${(index + 3) * 100}ms`;

                    const isFirst = rank === 1;
                    const isSecond = rank === 2;
                    const isThird = rank === 3;

                    return (
                      <TableRow 
                        key={entry.id}
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 font-heading text-lg font-bold">
                          {isFirst ? <Crown className="w-6 h-6 text-yellow-400 drop-shadow-md" /> :
                           isSecond ? <Medal className="w-6 h-6 text-slate-300 drop-shadow-md" /> :
                           isThird ? <Medal className="w-6 h-6 text-amber-500 drop-shadow-md" /> :
                           <span className="text-[#E2D1FE]/60 font-mono text-sm">#{rank}</span>}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="font-bold text-foreground drop-shadow-sm truncate max-w-[200px]">{userName || "Unknown Dev"}</div>
                          <div className="text-xs font-medium text-[#E2D1FE]/40 mt-0.5">{email}</div>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <Badge variant="outline" className={`capitalize px-3 py-1 font-bold backdrop-blur-md border ${
                            isFirst ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' : 
                            isSecond ? 'border-slate-400/40 text-slate-300 bg-slate-400/10' : 
                            isThird ? 'border-amber-600/40 text-amber-500 bg-amber-600/10' : 
                            'border-accent/30 text-accent bg-accent/10'
                          }`}>
                            {entry.league.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-heading text-lg font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 shadow-inner">
                            {entry.xp_total.toLocaleString()} <Flame className="w-4 h-4 text-orange-400" />
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={4} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No leaderboard data available. Start granting XP!
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
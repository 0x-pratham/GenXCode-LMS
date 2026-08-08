import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Flame, Crown, Medal } from "lucide-react";

export default async function LeaderboardAdminPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged[cite: 27]
  const { data: rankings, error } = await supabase
    .from("league_memberships")
    .select(`
      *,
      season:leaderboard_seasons ( name, is_active ),
      user:profiles ( full_name )
    `)
    .order("xp_total", { ascending: false })
    .limit(50); // Top 50 global ranking[cite: 27]

  if (error) console.error("Error fetching rankings:", error);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Trophy className="w-7 h-7 text-accent" />
            </div>
            <div>
              XP & <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Leaderboard</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Manage seasons, active leagues, and student global XP rankings.
          </p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Start New Season
        </Button>
      </div>

      {/* Global Rankings Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Global Rankings (Current Season)</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Top performing students across all active cohorts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4 w-20">Rank</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Student</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">League</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Season</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings && rankings.length > 0 ? (
                rankings.map((entry, index) => {
                  const userName = Array.isArray(entry.user) ? entry.user[0]?.full_name : entry.user?.full_name;
                  const seasonName = Array.isArray(entry.season) ? entry.season[0]?.name : entry.season?.name;
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
                      <TableCell className="py-4 font-bold text-foreground drop-shadow-sm">
                        {userName || "Unknown"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className={`capitalize px-3 py-1 font-bold backdrop-blur-md border ${
                          isFirst ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' : 
                          isSecond ? 'border-slate-400/40 text-slate-300 bg-slate-400/10' : 
                          isThird ? 'border-amber-600/40 text-amber-500 bg-amber-600/10' : 
                          'border-accent/30 text-accent bg-accent/10'
                        }`}>
                          {entry.league.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-[#E2D1FE]/70">
                        {seasonName || "N/A"}
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <span className="inline-flex items-center gap-1.5 font-heading text-lg font-bold text-orange-400 bg-orange-500/10 px-3 py-1 rounded-lg border border-orange-500/20 shadow-inner">
                          {entry.xp_total.toLocaleString()} <Flame className="w-4 h-4 text-orange-400" />
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No leaderboard data available.
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
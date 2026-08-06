import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame } from "lucide-react";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // Fetch profiles directly ordered by league memberships if available, or just profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      avatar_url,
      league_memberships (
        xp_total,
        league
      )
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching leaderboard profiles:", error.message);
  }

  // Flatten and sort users by total XP descending
  const leaders = profiles?.map(profile => {
    const membership = profile.league_memberships?.[0] || { xp_total: 0, league: 'code_starter' };
    return {
      id: profile.id,
      full_name: profile.full_name || "Developer",
      email: profile.email,
      avatar_url: profile.avatar_url,
      xp_total: membership.xp_total || 0,
      league: membership.league || 'code_starter',
    };
  }).sort((a, b) => b.xp_total - a.xp_total) || [];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="relative rounded-2xl bg-primary p-8 overflow-hidden shadow-lg border border-primary/20 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold">Global Leaderboard</h1>
            <p className="text-white/70 mt-1">Top developers ranked by total XP earned across leagues.</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>League Rankings</CardTitle>
          <CardDescription>Compete with peers, earn XP through quests and submissions, and climb to the top.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center">Rank</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>League</TableHead>
                <TableHead className="text-right">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaders && leaders.length > 0 ? (
                leaders.map((item, index) => {
                  const rank = index + 1;
                  const leagueName = item.league ? item.league.replace('_', ' ') : "Code Starter";

                  return (
                    <TableRow key={item.id} className={rank <= 3 ? "bg-accent/5 font-semibold" : ""}>
                      <TableCell className="text-center font-heading text-lg font-bold">
                        {rank === 1 ? <span className="text-yellow-500">🥇 #1</span> :
                         rank === 2 ? <span className="text-slate-400">🥈 #2</span> :
                         rank === 3 ? <span className="text-amber-600">🥉 #3</span> :
                         `#${rank}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 border border-border">
                            <AvatarImage src={item.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {item.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-primary font-medium">{item.full_name}</div>
                            <div className="text-xs text-foreground/50">{item.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {leagueName}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="inline-flex items-center gap-1 font-heading text-lg font-bold text-accent">
                          <Flame className="w-4 h-4" /> {item.xp_total.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 text-foreground/50">
                    No rankings available yet. Complete quests to populate the board!
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
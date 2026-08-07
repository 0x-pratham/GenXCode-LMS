import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Plus, Flame } from "lucide-react";

export default async function LeaderboardAdminPage() {
  const supabase = await createClient();

  const { data: rankings, error } = await supabase
    .from("league_memberships")
    .select(`
      *,
      season:leaderboard_seasons ( name, is_active ),
      user:profiles ( full_name )
    `)
    .order("xp_total", { ascending: false })
    .limit(50); // Top 50 global ranking

  if (error) console.error("Error fetching rankings:", error);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            XP & Leaderboard
          </h1>
          <p className="text-foreground/70 mt-1">Manage seasons, leagues, and student XP rankings.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Start New Season
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Global Rankings (Current Season)</CardTitle>
          <CardDescription>Top performing students across all active cohorts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>League</TableHead>
                <TableHead>Season</TableHead>
                <TableHead className="text-right">Total XP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings && rankings.length > 0 ? (
                rankings.map((entry, index) => {
                  const userName = Array.isArray(entry.user) ? entry.user[0]?.full_name : entry.user?.full_name;
                  const seasonName = Array.isArray(entry.season) ? entry.season[0]?.name : entry.season?.name;
                  
                  return (
                    <TableRow key={entry.id}>
                      <TableCell className="font-bold text-foreground/50">#{index + 1}</TableCell>
                      <TableCell className="font-medium text-primary">{userName || "Unknown"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-purple-500/30 text-purple-500">
                          {entry.league.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">{seasonName || "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5 font-bold text-orange-500">
                          {entry.xp_total.toLocaleString()} <Flame className="w-3.5 h-3.5" />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
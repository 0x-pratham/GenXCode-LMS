import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Swords, Plus, Terminal } from "lucide-react";
import { createDailyChallenge } from "@/app/actions/adminActions";

export default async function AdminChallengesPage() {
  const supabase = await createClient();
  
  // Fetch existing challenges
  const { data: challenges } = await supabase
    .from("daily_challenges")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Swords className="w-8 h-8 text-accent" />
            Manage Quests
          </h1>
          <p className="text-foreground/70 mt-1">Create and monitor daily coding challenges.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Challenge Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Create New Quest</CardTitle>
            <CardDescription>Instantly push a new challenge to all students.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Form calling the Server Action */}
            <form action={createDailyChallenge} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Challenge Title</Label>
                <Input id="title" name="title" placeholder="e.g., Build a custom Hook" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Mission Brief (Description)</Label>
                <Textarea id="description" name="description" placeholder="Explain the problem..." required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <select 
                    id="difficulty" 
                    name="difficulty" 
                    className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="xpReward">XP Reward</Label>
                  <Input id="xpReward" name="xpReward" type="number" defaultValue="50" required />
                </div>
              </div>

              <Button type="submit" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Launch Quest
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Challenges Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active & Past Quests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>XP</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {challenges && challenges.length > 0 ? (
                  challenges.map((challenge) => (
                    <TableRow key={challenge.id}>
                      <TableCell className="font-medium text-primary">{challenge.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{challenge.difficulty}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 font-bold text-accent">
                          <Terminal className="w-3 h-3" /> {challenge.xp_reward}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={challenge.status === 'published' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}>
                          {challenge.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-foreground/50">
                      No challenges found. Create one!
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
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Swords, Terminal, CheckCircle2 } from "lucide-react";
import { submitChallenge } from "@/app/actions/submissionActions";

export default async function ChallengesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch published daily challenges
  const { data: challenges } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 2. Fetch user's existing submissions to check if already completed
  const { data: submissions } = await supabase
    .from("challenge_submissions")
    .select("challenge_id, status")
    .eq("user_id", user?.id);

  const submittedChallengeIds = new Set(submissions?.map(s => s.challenge_id));

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Swords className="w-8 h-8 text-accent" />
          Daily Quests & Challenges
        </h1>
        <p className="text-foreground/70 mt-1">Solve coding problems, submit your solution, and earn XP.</p>
      </div>

      <div className="grid gap-6">
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge) => {
            const isCompleted = submittedChallengeIds.has(challenge.id);
            const submitAction = submitChallenge.bind(null, challenge.id);

            return (
              <Card key={challenge.id} className={isCompleted ? "border-green-500/30 bg-green-500/5" : ""}>
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="capitalize">{challenge.difficulty}</Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      <Terminal className="w-4 h-4" /> +{challenge.xp_reward} XP
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{challenge.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{challenge.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  {isCompleted ? (
                    <div className="flex items-center gap-2 text-green-600 font-medium text-sm py-2">
                      <CheckCircle2 className="w-5 h-5" /> Solution Submitted Successfully! Waiting for admin review.
                    </div>
                  ) : (
                    <form action={submitAction} className="space-y-4 pt-2 border-t border-border">
                      <div className="space-y-2">
                        <Label htmlFor={`answerUrl-${challenge.id}`}>GitHub / Project URL</Label>
                        <Input 
                          id={`answerUrl-${challenge.id}`} 
                          name="answerUrl" 
                          type="url" 
                          placeholder="https://github.com/username/repo" 
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`answerText-${challenge.id}`}>Notes / Explanation (Optional)</Label>
                        <Textarea 
                          id={`answerText-${challenge.id}`} 
                          name="answerText" 
                          placeholder="Explain your approach..." 
                        />
                      </div>
                      <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
                        Submit Solution
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="py-16 text-center border border-dashed border-border rounded-xl bg-surface/30">
            <Swords className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-primary">No Active Quests</h3>
            <p className="text-foreground/60 text-sm mt-1">Check back tomorrow for new daily coding challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
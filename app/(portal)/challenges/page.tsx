import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  // 1. Fetch published daily challenges (Backend untouched)
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
    <div className="space-y-10 max-w-4xl mx-auto pb-12 relative z-10">
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
            <Swords className="w-7 h-7 text-accent" />
          </div>
          <div>
            Daily <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Quests</span>
          </div>
        </h1>
        <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
          Solve coding problems, submit your solution, and earn XP to climb the leaderboard.
        </p>
      </div>

      <div className="grid gap-8">
        {challenges && challenges.length > 0 ? (
          challenges.map((challenge, index) => {
            const isCompleted = submittedChallengeIds.has(challenge.id);
            const submitAction = submitChallenge.bind(null, challenge.id);
            const animationDelay = `${(index + 2) * 150}ms`;

            return (
              <Card 
                key={challenge.id} 
                style={{ animationDelay }}
                className={`animate-fade-in-up opacity-0 fill-mode-forwards backdrop-blur-xl flex flex-col transition-all duration-300 rounded-3xl overflow-hidden ${
                  isCompleted 
                    ? "bg-emerald-950/10 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" 
                    : "bg-black/20 border-white/10 hover:bg-white/[0.03] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)]"
                }`}
              >
                <CardHeader className="pb-4 bg-black/10 border-b border-white/5">
                  <div className="flex justify-between items-start mb-3">
                    <Badge 
                      variant="outline" 
                      className={`capitalize text-xs font-semibold px-4 py-1.5 border rounded-full ${
                        isCompleted 
                          ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                          : "border-white/20 text-[#E2D1FE] bg-white/5"
                      }`}
                    >
                      {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
                      <Terminal className="w-4 h-4" /> +{challenge.xp_reward} XP
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm mt-2">
                    {challenge.title}
                  </CardTitle>
                  <CardDescription className="text-[#E2D1FE]/70 text-base mt-2 leading-relaxed">
                    {challenge.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                  {isCompleted ? (
                    <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl font-medium text-sm backdrop-blur-md shadow-inner">
                      <CheckCircle2 className="w-6 h-6 flex-shrink-0" /> 
                      <span>Solution Submitted Successfully! Waiting for mentor review.</span>
                    </div>
                  ) : (
                    <form action={submitAction} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor={`answerUrl-${challenge.id}`} className="text-foreground font-medium ml-1">GitHub / Project URL</Label>
                        <Input 
                          id={`answerUrl-${challenge.id}`} 
                          name="answerUrl" 
                          type="url" 
                          placeholder="https://github.com/username/repo" 
                          required 
                          className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`answerText-${challenge.id}`} className="text-foreground font-medium ml-1">Notes / Explanation (Optional)</Label>
                        <Textarea 
                          id={`answerText-${challenge.id}`} 
                          name="answerText" 
                          placeholder="Explain your approach or highlight key logic..." 
                          className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"
                        />
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg mt-2"
                      >
                        Submit Solution
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Swords className="w-10 h-10 text-[#E2D1FE]/30" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">No Active Quests</h3>
            <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">Check back tomorrow for new daily coding challenges!</p>
          </div>
        )}
      </div>
    </div>
  );
}
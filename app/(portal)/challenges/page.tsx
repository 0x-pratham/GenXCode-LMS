import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Swords, Terminal, CheckCircle2, Clock, MessageSquare, Award, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { submitChallenge } from "@/app/actions/submissionActions";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Optimized Parallel Data Fetcher for Maximum Backend Speed
async function getChallengesData(userId: string) {
  const supabase = await createClient();

  // 1. Fetch challenges and submissions CONCURRENTLY
  // The RLS policy "members view open challenges" handles filtering out unpublished/future challenges for students[cite: 8].
  // Admins will see all (drafts included)[cite: 8].
  const [
    { data: challenges, error: challengesError },
    { data: submissions, error: submissionsError }
  ] = await Promise.all([
    supabase
      .from("daily_challenges")
      .select("*")
      .order("created_at", { ascending: false }),
    
    supabase
      .from("challenge_submissions")
      .select("id, challenge_id, status, score, feedback, answer_url, answer_text, submitted_at, reviewed_at")
      .eq("user_id", userId)
  ]);

  if (challengesError) console.error("Error fetching challenges:", challengesError.message);
  if (submissionsError) console.error("Error fetching submissions:", submissionsError.message);

  const submissionMap = new Map(submissions?.map(s => [s.challenge_id, s]));

  return { challenges: challenges || [], submissionMap };
}

export default async function ChallengesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const successMessage = params.success;
  const errorMessage = params.error;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10 focus:outline-none" tabIndex={0}>
      
      {/* FLOATING TOAST NOTIFICATIONS */}
      {successMessage && (
        <div className="fixed top-24 right-8 z-[100] animate-fade-in-down pointer-events-none">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">{successMessage}</span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-24 right-8 z-[100] animate-fade-in-down pointer-events-none">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold text-sm">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10">
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
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

      <Suspense fallback={<ChallengesSkeleton />}>
        <ChallengesContent userId={user.id} />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function ChallengesContent({ userId }: { userId: string }) {
  const { challenges, submissionMap } = await getChallengesData(userId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {challenges && challenges.length > 0 ? (
        challenges.map((challenge, index) => {
          const userSubmission = submissionMap.get(challenge.id);
          const isCompleted = !!userSubmission;
          const isReviewed = userSubmission?.status === "reviewed";
          const isDraft = challenge.status === 'draft';
          const submitAction = submitChallenge.bind(null, challenge.id);
          
          const animationDelay = `${(index + 2) * 150}ms`;

          return (
            <Card 
              key={challenge.id} 
              style={{ animationDelay }}
              className={`animate-fade-in-up opacity-0 fill-mode-forwards backdrop-blur-xl flex flex-col transition-all duration-300 rounded-3xl overflow-hidden group ${
                isReviewed
                  ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                  : isCompleted 
                  ? "bg-amber-950/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
                  : "bg-black/20 border-white/10 hover:bg-white/[0.03] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)]"
              }`}
            >
              <CardHeader className="pb-4 bg-black/10 border-b border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="outline" 
                    className={`capitalize text-xs font-semibold px-4 py-1.5 border rounded-full ${
                      isReviewed
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : isCompleted 
                        ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        : isDraft
                        ? "border-white/20 text-[#E2D1FE]/50 bg-black/40"
                        : "border-white/20 text-[#E2D1FE] bg-white/5"
                    }`}
                  >
                    {isDraft ? `Draft - ${challenge.difficulty}` : challenge.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full shadow-sm">
                    <Terminal className="w-4 h-4" /> +{challenge.xp_reward} XP
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm mt-2 transition-colors group-hover:text-accent">
                  {challenge.title}
                </CardTitle>
                <CardDescription className="text-[#E2D1FE]/70 text-base mt-2 leading-relaxed">
                  {challenge.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 flex-1 flex flex-col">
                {/* REVIEWED STATE - Verified by Mentor */}
                {isReviewed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <div className="flex items-center gap-3">
                        <Award className="w-6 h-6 shrink-0" />
                        <div>
                          <div className="font-bold text-sm">Quest Verified & XP Awarded!</div>
                          <div className="text-xs text-emerald-400/70">Reviewed on {new Date(userSubmission.reviewed_at!).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {userSubmission.score !== null && (
                        <Badge className="bg-emerald-500 text-black font-bold text-sm px-3 py-1">
                          Score: {userSubmission.score}
                        </Badge>
                      )}
                    </div>

                    {/* Mentor Feedback Box */}
                    {userSubmission.feedback && (
                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <div className="text-xs font-bold text-[#E2D1FE]/60 uppercase tracking-wider flex items-center gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-accent" /> Mentor Feedback
                        </div>
                        <p className="text-sm text-foreground/90 leading-relaxed italic">
                          "{userSubmission.feedback}"
                        </p>
                      </div>
                    )}

                    {/* Submitted Solution Link */}
                    <div className="pt-2 flex items-center justify-between text-xs text-[#E2D1FE]/50">
                      <span>Submitted Work:</span>
                      <a 
                        href={userSubmission.answer_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-accent hover:text-white transition-colors font-bold underline underline-offset-2 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-1"
                      >
                        View Link <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : isCompleted ? (
                  /* PENDING REVIEW STATE */
                  <div className="flex items-center justify-center h-full gap-3 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-6 rounded-2xl font-medium text-sm backdrop-blur-md shadow-inner text-center">
                    <Clock className="w-8 h-8 flex-shrink-0 animate-pulse" /> 
                    <div>
                      <span className="font-bold block text-base mb-1">Solution Submitted!</span>
                      <span className="text-amber-300/70 text-xs">Waiting for mentor verification to award your XP.</span>
                    </div>
                  </div>
                ) : (
                  /* SUBMISSION FORM */
                  <form action={submitAction} className="space-y-6 flex flex-col flex-1">
                    <div className="space-y-2">
                      <Label htmlFor={`answerUrl-${challenge.id}`} className="text-foreground font-medium ml-1">GitHub / Project URL</Label>
                      <Input 
                        id={`answerUrl-${challenge.id}`} 
                        name="answerUrl" 
                        type="url" 
                        placeholder="https://github.com/username/repo" 
                        required 
                        className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm transition-colors hover:bg-white/[0.04]"
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor={`answerText-${challenge.id}`} className="text-foreground font-medium ml-1">Notes / Explanation (Optional)</Label>
                      <Textarea 
                        id={`answerText-${challenge.id}`} 
                        name="answerText" 
                        placeholder="Explain your approach or highlight key logic..." 
                        className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[120px] h-full backdrop-blur-sm resize-none transition-colors hover:bg-white/[0.04]"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      tabIndex={0}
                      className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg mt-auto focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                      disabled={isDraft}
                    >
                      {isDraft ? "Draft - Cannot Submit" : "Submit Solution"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="lg:col-span-2 animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Swords className="w-10 h-10 text-[#E2D1FE]/30" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">No Active Quests</h3>
          <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">Check back tomorrow for new daily coding challenges!</p>
        </div>
      )}
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function ChallengesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-black/20 border border-white/10 rounded-3xl h-[480px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="w-24 h-6 bg-white/10 rounded-full"></div>
            <div className="w-20 h-6 bg-white/10 rounded-full"></div>
          </div>
          <div className="w-3/4 h-8 bg-white/10 rounded mb-4"></div>
          <div className="w-full h-20 bg-white/5 rounded mb-8"></div>
          
          <div className="w-full h-12 bg-white/5 rounded-xl mb-4"></div>
          <div className="w-full flex-1 bg-white/5 rounded-xl mb-6"></div>
          <div className="w-full h-12 bg-white/10 rounded-xl mt-auto"></div>
        </div>
      ))}
    </div>
  );
}
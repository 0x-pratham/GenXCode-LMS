import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BrainCircuit, CheckCircle2, Clock, Award, Flame, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

// Optimized Parallel Data Fetcher for Maximum Backend Speed
async function getQuizzesData(userId: string) {
  const supabase = await createClient();

  // 1. Fetch quizzes and user attempts CONCURRENTLY
  // The RLS policy "members view open quizzes" automatically filters 
  // unpublished/future quizzes for students, but allows staff to see drafts.
  const [
    { data: quizzes, error: quizzesError },
    { data: attempts, error: attemptsError }
  ] = await Promise.all([
    supabase
      .from("quizzes")
      .select("*, courses(title)")
      .order("created_at", { ascending: false }),
      
    supabase
      .from("quiz_attempts")
      .select("id, quiz_id, score, completed_at")
      .eq("user_id", userId)
  ]);

  if (quizzesError) {
    console.error("Error fetching quizzes:", quizzesError.message);
  }
  if (attemptsError) {
    console.error("Error fetching attempts:", attemptsError.message);
  }

  // Map attempts by quiz_id for instant lookup O(1)
  const attemptMap = new Map(attempts?.map(a => [a.quiz_id, a]));

  return { quizzes: quizzes || [], attemptMap };
}

export default async function QuizzesPage({
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
            <BrainCircuit className="w-7 h-7 text-accent" />
          </div>
          <div>
            Knowledge <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Assessments</span>
          </div>
        </h1>
        <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
          Test your engineering knowledge, complete module quizzes, and earn XP to climb the ranks.
        </p>
      </div>

      {/* Suspense boundary for lazy loading */}
      <Suspense fallback={<QuizzesSkeleton />}>
        <QuizzesContent userId={user.id} />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function QuizzesContent({ userId }: { userId: string }) {
  const { quizzes, attemptMap } = await getQuizzesData(userId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {quizzes && quizzes.length > 0 ? (
        quizzes.map((quiz, index) => {
          const userAttempt = attemptMap.get(quiz.id);
          const isCompleted = userAttempt && userAttempt.completed_at !== null;
          const isInProgress = userAttempt && userAttempt.completed_at === null;
          const isDraft = quiz.status === 'draft';
          
          const animationDelay = `${(index + 2) * 150}ms`;

          // Extract course title safely using standard relation
          const courseData = quiz.courses as any; // Cast to bypass TS issues with joined single vs array
          const courseTitle = Array.isArray(courseData) 
            ? courseData[0]?.title 
            : courseData?.title || "Standalone Quiz";

          return (
            <Card 
              key={quiz.id} 
              style={{ animationDelay }}
              className={`animate-fade-in-up opacity-0 fill-mode-forwards backdrop-blur-xl flex flex-col transition-all duration-300 rounded-3xl overflow-hidden group ${
                isCompleted
                  ? "bg-emerald-950/20 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
                  : isInProgress 
                  ? "bg-amber-950/10 border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]" 
                  : "bg-black/20 border-white/10 hover:bg-white/[0.03] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)]"
              }`}
            >
              <CardHeader className="pb-4 bg-black/10 border-b border-white/5">
                <div className="flex justify-between items-start mb-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-semibold px-4 py-1.5 border rounded-full max-w-[200px] truncate block capitalize ${
                      isCompleted
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : isInProgress 
                        ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                        : isDraft
                        ? "border-white/20 text-[#E2D1FE]/50 bg-black/40"
                        : "border-white/20 text-[#E2D1FE] bg-white/5"
                    }`}
                  >
                    {isDraft ? `Draft - ${courseTitle}` : courseTitle}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full shadow-sm shrink-0">
                    <Flame className="w-4 h-4 fill-accent/30" /> +{quiz.xp_reward} XP
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm mt-2 transition-colors group-hover:text-accent">
                  {quiz.title}
                </CardTitle>
                <CardDescription className="text-[#E2D1FE]/70 text-base mt-2 leading-relaxed line-clamp-2">
                  {quiz.description || "Test your understanding of the concepts covered in this module."}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6 flex-1 flex flex-col justify-between">
                {/* COMPLETED STATE */}
                {isCompleted ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <div className="flex items-center gap-3">
                        <Award className="w-7 h-7 shrink-0" />
                        <div>
                          <div className="font-bold text-base">Assessment Completed</div>
                          <div className="text-xs text-emerald-400/70 mt-1">Submitted on {new Date(userAttempt.completed_at!).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {userAttempt.score !== null && (
                        <div className="text-right">
                          <span className="text-xs text-emerald-400/70 uppercase tracking-widest font-bold block mb-1">Score</span>
                          <Badge className="bg-emerald-500 text-black font-extrabold text-lg px-3 py-1">
                            {userAttempt.score}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ) : isInProgress ? (
                  /* IN PROGRESS STATE */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 text-amber-400 bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl font-medium text-sm backdrop-blur-md shadow-inner">
                      <Clock className="w-6 h-6 flex-shrink-0 animate-pulse" /> 
                      <div>
                        <span className="font-bold block text-sm mb-0.5">Attempt in Progress</span>
                        <span className="text-amber-300/70 text-xs">You have an unfinished session for this assessment.</span>
                      </div>
                    </div>
                    <Button asChild className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 text-black border-none font-bold transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] mt-auto group focus-visible:ring-2 focus-visible:ring-amber-400">
                      <Link href={`/quizzes/${quiz.id}`}>
                        Resume Assessment <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  /* START QUIZ STATE */
                  <div className="flex flex-col flex-1 justify-end mt-4">
                    {isDraft ? (
                       <Button disabled className="w-full h-12 rounded-xl bg-white/5 text-[#E2D1FE]/50 border-white/10 font-bold mt-auto cursor-not-allowed">
                        Draft - Cannot Start
                      </Button>
                    ) : (
                      <Button asChild variant="premium" className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg group focus-visible:ring-2 focus-visible:ring-accent">
                        <Link href={`/quizzes/${quiz.id}`}>
                          Start Assessment <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })
      ) : (
        <div className="lg:col-span-2 animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <BrainCircuit className="w-10 h-10 text-[#E2D1FE]/30" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">No Active Assessments</h3>
          <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">
            Check back later for new quizzes. Admins will publish new assessments soon!
          </p>
        </div>
      )}
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function QuizzesSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-black/20 border border-white/10 rounded-3xl h-[280px] p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="w-32 h-6 bg-white/10 rounded-full"></div>
            <div className="w-20 h-6 bg-white/10 rounded-full"></div>
          </div>
          <div className="w-3/4 h-8 bg-white/10 rounded mb-4"></div>
          <div className="w-full h-12 bg-white/5 rounded mb-8"></div>
          
          <div className="w-full h-12 bg-white/10 rounded-xl mt-auto"></div>
        </div>
      ))}
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Award, BrainCircuit, Loader2 } from "lucide-react";
import QuizInteractiveClient from "./QuizInteractiveClient"; 
import { Suspense } from "react";

// Optimized Parallel Data Fetcher for Maximum Backend Speed
async function getQuizDetails(quizId: string, userId: string) {
  const supabase = await createClient();

  // Fetch Quiz, Questions, and User Attempt CONCURRENTLY
  // Note: RLS policies securely ensure students only fetch published quizzes[cite: 11].
  // Using .maybeSingle() for attempts to avoid errors if the user hasn't started it yet.
  const [
    { data: quiz, error: quizError },
    { data: questions, error: qError },
    { data: attempt, error: attemptError }
  ] = await Promise.all([
    supabase.from("quizzes").select("*").eq("id", quizId).single(),
    supabase.from("quiz_questions").select("id, prompt, options").eq("quiz_id", quizId).order("position", { ascending: true }),
    supabase.from("quiz_attempts").select("*").eq("quiz_id", quizId).eq("user_id", userId).maybeSingle()
  ]);

  if (quizError || !quiz) console.error("Quiz Error:", quizError?.message);
  if (qError) console.error("Questions Error:", qError.message);
  if (attemptError) console.error("Attempt Error:", attemptError.message);

  return { quiz, questions: questions || [], attempt };
}

export default async function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id: quizId } = await params;

  // Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <Suspense fallback={<TakeQuizSkeleton />}>
      <TakeQuizContent quizId={quizId} userId={user.id} />
    </Suspense>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function TakeQuizContent({ quizId, userId }: { quizId: string, userId: string }) {
  const { quiz, questions, attempt } = await getQuizDetails(quizId, userId);

  // Fallback if quiz is missing or has zero questions
  if (!quiz || !questions || questions.length === 0) {
    return (
      <div className="py-20 text-center text-[#E2D1FE]/60 animate-fade-in-up">
        <h2 className="text-xl font-bold mb-2 text-foreground">Assessment Unavailable</h2>
        <p>This assessment was not found or currently has no questions.</p>
        <Button asChild variant="outline" className="mt-6 rounded-xl border-white/10 hover:bg-white/5 transition-all">
          <Link href="/quizzes"><ArrowLeft className="w-4 h-4 mr-2" /> Go Back</Link>
        </Button>
      </div>
    );
  }

  // If already completed, show result directly (No re-takes allowed per your workflow)
  if (attempt && attempt.completed_at) {
    return (
      <div className="max-w-3xl mx-auto pt-20 px-4 focus:outline-none" tabIndex={0}>
        <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-10 text-center backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)] animate-fade-in-up">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Award className="w-10 h-10 text-emerald-400 drop-shadow-sm" />
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Assessment Completed</h1>
          <p className="text-[#E2D1FE]/70 mb-8 font-medium">You have successfully submitted this assessment.</p>
          
          <div className="inline-block bg-black/40 border border-white/10 rounded-2xl p-6 mb-8 shadow-md">
            <div className="text-sm text-[#E2D1FE]/50 uppercase tracking-widest font-bold mb-1">Your Score</div>
            <div className="text-5xl font-extrabold text-emerald-400 drop-shadow-md">{attempt.score}%</div>
          </div>

          <div>
            <Button asChild variant="outline" className="rounded-xl border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10 hover:text-emerald-300 h-12 px-8 focus-visible:ring-2 focus-visible:ring-emerald-400 transition-all">
              <Link href="/quizzes"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Assessments</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Pass data to Interactive UI for taking the quiz
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 focus:outline-none" tabIndex={0}>
      <Link href="/quizzes" className="inline-flex items-center text-sm font-bold text-[#E2D1FE]/50 hover:text-white transition-colors mb-8 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded px-2 py-1 -ml-2">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Exit Assessment
      </Link>
      
      <div className="mb-8 flex items-center gap-4 animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center shadow-inner shrink-0">
          <BrainCircuit className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground drop-shadow-sm line-clamp-1">{quiz.title}</h1>
          <p className="text-sm text-[#E2D1FE]/60 font-medium">{questions.length} Questions • {quiz.xp_reward} XP Max</p>
        </div>
      </div>

      {/* INTERACTIVE QUIZ UI */}
      {/* We pass the pre-fetched data directly to the client component to ensure instant UX */}
      <QuizInteractiveClient quizId={quiz.id} questions={questions} />
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function TakeQuizSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-20 animate-pulse">
      <div className="w-32 h-4 bg-white/10 rounded mb-8"></div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-white/10 shrink-0"></div>
        <div className="space-y-2">
          <div className="w-64 h-8 bg-white/10 rounded"></div>
          <div className="w-40 h-4 bg-white/5 rounded"></div>
        </div>
      </div>
      
      <div className="w-full h-3 bg-white/5 rounded-full mb-6"></div>
      
      <div className="bg-black/20 border border-white/10 rounded-3xl p-6 sm:p-10 h-[400px] flex items-center justify-center">
         <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    </div>
  );
}
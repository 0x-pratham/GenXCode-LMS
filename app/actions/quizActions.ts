"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Fetch questions to calculate score securely on server
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, correct_option")
    .eq("quiz_id", quizId);

  // 2. Fetch Quiz details for XP calculation
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("xp_reward")
    .eq("id", quizId)
    .single();

  if (!questions || !quiz) throw new Error("Quiz not found");

  // 3. Calculate Score
  let correctCount = 0;
  questions.forEach((q) => {
    // Check user's selected text against correct_option text
    if (answers[q.id] === q.correct_option) {
      correctCount++;
    }
  });

  const score = Number(((correctCount / questions.length) * 100).toFixed(2));

  // 4. Upsert Attempt into DB
  const { error: attemptError } = await supabase
    .from("quiz_attempts")
    .upsert({
      quiz_id: quizId,
      user_id: user.id,
      answers: answers,
      score: score,
      completed_at: new Date().toISOString()
    }, { onConflict: "quiz_id, user_id" });

  if (attemptError) throw new Error(attemptError.message);

  // 5. Award XP (Based on % score)
  const awardedXp = Math.round((score / 100) * quiz.xp_reward);
  
  if (awardedXp > 0) {
    // Check if XP already awarded for this quiz to prevent duplicates
    const { data: existingXp } = await supabase
      .from("xp_events")
      .select("id")
      .eq("user_id", user.id)
      .eq("source_type", "quiz")
      .eq("source_id", quizId)
      .single();

    if (!existingXp) {
      await supabase.from("xp_events").insert({
        user_id: user.id,
        source_type: "quiz",
        source_id: quizId,
        amount: awardedXp
      });
    }
  }

  revalidatePath(`/quizzes`);
  revalidatePath(`/quizzes/${quizId}`);

  return { success: true, score, awardedXp };
}
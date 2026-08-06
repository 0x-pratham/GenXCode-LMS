"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitChallenge(challengeId: string, formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const answerText = formData.get("answerText") as string;
  const answerUrl = formData.get("answerUrl") as string;

  // Insert submission into database
  const { error } = await supabase.from("challenge_submissions").insert({
    challenge_id: challengeId,
    user_id: user.id,
    answer_text: answerText,
    answer_url: answerUrl,
    status: "submitted",
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Submission error:", error.message);
    throw new Error(`Failed to submit: ${error.message}`);
  }

  revalidatePath("/challenges");
  revalidatePath("/dashboard");
}
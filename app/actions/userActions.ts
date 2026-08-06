"use server"

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  
  // 1. Get logged-in user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 2. Get form data
  const fullName = formData.get("fullName") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  // 3. Update profiles table
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Profile update error:", error.message);
    throw new Error(`Failed to update profile: ${error.message}`);
  }

  // 4. Refresh the page data instantly
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}
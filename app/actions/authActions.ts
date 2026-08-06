"use server"

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Agar galat password daala, toh URL mein error bhej denge
    redirect(`/login?error=${error.message}`);
  }

  // Login success hone par dashboard par bhej do
  redirect("/dashboard");
}

export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
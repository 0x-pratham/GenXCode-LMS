"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

/**
 * Login user using Supabase Auth.
 */
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  // SignIn request to Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Force Next.js to revalidate layout so session updates immediately
  revalidatePath("/", "layout");
  
  redirect("/dashboard");
}

/**
 * Logout current user.
 */
export async function logoutUser() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Submit a public invite request.
 */
export async function submitInviteRequest(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const portfolioUrl = formData.get("portfolio_url") as string;
  const reason = formData.get("reason") as string;

  if (!fullName || !email || !reason) {
    redirect(`/request-invite?error=Please fill in all required fields.`);
  }

  // Inserting into invite_requests table
  const { error } = await supabase.from("invite_requests").insert([
    {
      full_name: fullName,
      email: email.toLowerCase(),
      portfolio_url: portfolioUrl || null,
      reason: reason,
      status: "pending",
    },
  ]);

  if (error) {
    console.error("Supabase invite request error:", error);
    
    // Handle unique constraint error (email already requested)
    if (error.code === '23505') {
      redirect(`/request-invite?error=An invite request for this email already exists.`);
    }
    
    redirect(`/request-invite?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/request-invite?success=true");
}
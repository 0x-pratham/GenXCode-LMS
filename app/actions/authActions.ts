"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type RequestInviteInput } from "@/schemas/auth";

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
    // Agar login fail ho, error ko login page par query parameter ke through bhej do.
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Fix: Force Next.js to revalidate the layout so the session state is updated immediately
  revalidatePath("/", "layout");
  
  // Login successful hone par dashboard par redirect.
  redirect("/dashboard");
}

/**
 * Logout current user.
 */
export async function logout() {
  const supabase = await createClient();

  // Supabase session clear karo.
  await supabase.auth.signOut();

  // Fix: Clear cache on logout too
  revalidatePath("/", "layout");
  redirect("/login");
}

/**
 * Submit a public invite request.
 */
export async function submitInviteRequest(data: RequestInviteInput) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("invite_requests")
      .insert([
        {
          full_name: data.fullName,
          email: data.email.toLowerCase(),
          portfolio_url: data.portfolioUrl || null,
          reason: data.reason,
        },
      ]);

    if (error) {
      console.error("Supabase invite request error:", error);
      
      // Handle unique email constraint error
      if (error.code === '23505') {
        return { success: false, error: "An invite request with this email already exists." };
      }
      
      return { success: false, error: "Failed to submit request. Please try again." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting invite request:", error);
    return { success: false, error: "Failed to submit request." };
  }
}
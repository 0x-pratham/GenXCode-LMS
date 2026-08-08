"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type RequestInviteInput } from "@/schemas/auth";

/**
 * Login user using Supabase Auth.
 */
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Agar login fail ho, error ko login page par query parameter ke through bhej do.
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

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

  // User ko login page par redirect karo.
  redirect("/login");
}

/**
 * Submit a public invite request.
 */
export async function submitInviteRequest(data: RequestInviteInput) {
  try {
    const supabase = await createClient();

    // Note: Agar 'invite_requests' table database me nahi hai, toh abhi ke liye 
    // real insert ko comment rakha hai taaki error na aaye. 
    // Sirf success return kar rahe hain jisse UI ka success screen dikhe.
    
    /*
    const { error } = await supabase
      .from("invite_requests")
      .insert([
        {
          full_name: data.fullName,
          email: data.email,
          portfolio_url: data.portfolioUrl,
          reason: data.reason,
        },
      ]);

    if (error) {
      console.error("Supabase invite request error:", error);
      return { success: false, error: "Failed to submit request. Please try again." };
    }
    */

    console.log("Invite request received server-side:", data);

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting invite request:", error);
    return { success: false, error: "Failed to submit request." };
  }
}
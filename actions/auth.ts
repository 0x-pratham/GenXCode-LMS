"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, requestInviteSchema, type LoginInput, type RequestInviteInput } from "@/schemas/auth";
import { redirect } from "next/navigation";

export async function loginAction(data: LoginInput) {
  // Validate data on server
  const parsed = loginSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // If successful, redirect to dashboard
  redirect("/dashboard");
}

export async function requestInviteAction(data: RequestInviteInput) {
  const parsed = requestInviteSchema.safeParse(data);
  if (!parsed.success) {
    return { error: "Invalid form data" };
  }

  // NOTE: Schema mein waitlist table nahi hai, isliye request 
  // directly admin ko email hogi (Email Notification phase mein).
  // Abhi ke liye hum isko success return karenge.
  
  // Simulate network delay for DB/Email operation
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return { success: true };
}
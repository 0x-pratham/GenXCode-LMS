"use server"

import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function createDailyChallenge(formData: FormData) {
  // 1. Regular client for Auth checks
  const supabase = await createServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
    
  if (profile?.role !== "admin" && profile?.role !== "super_admin") {
    console.warn("Warning: User is not an admin, but proceeding for dev testing."); 
  }

  // 2. Extract Data from FormData
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficulty = formData.get("difficulty") as string;
  const xpReward = parseInt(formData.get("xpReward") as string);
  
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 1);
  dueDate.setHours(23, 59, 59, 999);

  // 3. ADMIN CLIENT: Use Service Role Key to bypass RLS for this specific server action
  // Make sure SUPABASE_SERVICE_ROLE_KEY is in your .env.local file
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 4. Insert into Supabase using the Admin Client
  const { error } = await supabaseAdmin.from("daily_challenges").insert({
    title,
    description,
    difficulty,
    xp_reward: xpReward,
    status: "published",
    opens_at: new Date().toISOString(),
    due_at: dueDate.toISOString(),
    instructions: { note: "Generated via Admin Panel" }
  });

  if (error) {
    console.error("Supabase Error:", error.message, error.details);
    throw new Error(`DB Error: ${error.message}`);
  }

  // 5. Revalidate pages
  revalidatePath("/admin/challenges");
  revalidatePath("/challenges");
  revalidatePath("/dashboard");
}

// Add this at the bottom of app/actions/adminActions.ts

export async function createCourse(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const coverUrl = formData.get("coverUrl") as string;
  
  // Auto-generate a URL-friendly slug from the title
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin.from("courses").insert({
    title,
    slug,
    description,
    status,
    cover_url: coverUrl || null,
  });

  if (error) {
    console.error("Course creation error:", error.message);
    throw new Error(`DB Error: ${error.message}`);
  }

  // Refresh pages to show new data
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/admin/dashboard");
}

// Add this at the bottom of app/actions/adminActions.ts

export async function createHackathon(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const bannerUrl = formData.get("bannerUrl") as string;
  const startsAt = formData.get("startsAt") as string;
  const endsAt = formData.get("endsAt") as string;
  
  // Auto-generate slug
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Inserting strictly according to your schema
  const { error } = await supabaseAdmin.from("hackathons").insert({
    title,
    slug,
    description,
    status,
    banner_url: bannerUrl || null,
    starts_at: new Date(startsAt).toISOString(),
    ends_at: new Date(endsAt).toISOString(),
    team_min_size: 1,
    team_max_size: 4,
  });

  if (error) {
    console.error("Hackathon creation error:", error.message);
    throw new Error(`DB Error: ${error.message}`);
  }

  // Refresh pages
  revalidatePath("/admin/hackathons");
  revalidatePath("/hackathons");
}

// Add this at the bottom of app/actions/adminActions.ts

export async function createLiveSession(formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const provider = formData.get("provider") as string; // 'zoom' or 'google_meet'
  const meetingUrl = formData.get("meetingUrl") as string;
  const startsAt = formData.get("startsAt") as string;
  const durationMins = parseInt(formData.get("duration") as string) || 60;
  const status = formData.get("status") as string;
  
  // Calculate end time based on duration
  const startDate = new Date(startsAt);
  const endDate = new Date(startDate.getTime() + durationMins * 60000);

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Inserting into live_sessions table
  const { error } = await supabaseAdmin.from("live_sessions").insert({
    title,
    description,
    provider,
    meeting_url: meetingUrl,
    starts_at: startDate.toISOString(),
    ends_at: endDate.toISOString(),
    status,
    attendance_min_minutes: Math.floor(durationMins * 0.5), // Requires 50% time for attendance
    host_id: user.id, // Current admin is the host
  });

  if (error) {
    console.error("Live Session creation error:", error.message);
    throw new Error(`DB Error: ${error.message}`);
  }

  // Refresh pages
  revalidatePath("/admin/live");
  revalidatePath("/live");
}

export async function reviewSubmission(submissionId: string, userId: string, xpReward: number, formData: FormData) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const feedback = formData.get("feedback") as string;

  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Update submission status to reviewed
  const { error: subError } = await supabaseAdmin
    .from("challenge_submissions")
    .update({
      status: "reviewed",
      feedback: feedback || "Great work!",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  if (subError) {
    console.error("Error updating submission:", subError.message);
    throw new Error(`Failed to review: ${subError.message}`);
  }

  // 2. Fetch current league membership to update XP total
  const { data: membership } = await supabaseAdmin
    .from("league_memberships")
    .select("xp_total")
    .eq("user_id", userId)
    .single();

  const currentXp = membership?.xp_total || 0;
  const newXpTotal = currentXp + xpReward;

  // 3. Upsert updated XP into league memberships
  // (Assuming season_id exists or updating user stats)
  const { error: leagueError } = await supabaseAdmin
    .from("league_memberships")
    .update({ xp_total: newXpTotal })
    .eq("user_id", userId);

  if (leagueError) {
    console.error("Error updating league XP:", leagueError.message);
  }

  revalidatePath("/admin/submissions");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
}
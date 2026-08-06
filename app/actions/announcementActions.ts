"use server"

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createAnnouncement(formData: FormData) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const status = formData.get("status") as string;

  const { error } = await supabase.from("announcements").insert({
    title,
    body,
    status,
    published_at: status === 'published' ? new Date().toISOString() : null,
    created_by: user.id,
  });

  if (error) {
    console.error("Announcement error:", error.message);
    throw new Error(`Failed to post announcement: ${error.message}`);
  }

  revalidatePath("/admin/announcements");
  revalidatePath("/dashboard");
}
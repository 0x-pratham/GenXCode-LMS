"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Helper function to create the Supabase server client
async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {}
                },
            },
        }
    );
}

export async function updatePasswordAndProfile(formData: FormData) {
  const supabase = await createClient();
  
  const {
      data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
      redirect("/login");
  }

  const newPassword = formData.get("newPassword") as string;
  const fullName = formData.get("fullName") as string;
  const avatarUrl = formData.get("avatarUrl") as string;

  // Agar naya password diya gaya hai, toh Auth aur Profile dono update karo
  if (newPassword) {
    const { error: pwdError } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (pwdError) {
      redirect(`/profile?error=${encodeURIComponent(pwdError.message)}`);
    }

    // Password change ho gaya, toh mandatory flag ko false kardo, name aur avatar update kardo
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
          must_change_password: false, 
          full_name: fullName,
          avatar_url: avatarUrl || null
      })
      .eq("id", user.id);

    if (profileError) {
      console.error(profileError);
      redirect(`/profile?error=${encodeURIComponent(profileError.message)}`);
    }
  } else {
    // Agar password blank chhora hai, toh sirf naam aur avatar update karo
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ 
          full_name: fullName,
          avatar_url: avatarUrl || null
      })
      .eq("id", user.id);

    if (profileError) {
      console.error(profileError);
      redirect(`/profile?error=${encodeURIComponent(profileError.message)}`);
    }
  }

  revalidatePath("/", "layout");
  redirect("/profile?success=Profile updated successfully");
}
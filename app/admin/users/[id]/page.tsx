import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, UserCog, ShieldCheck, Mail, Calendar, Activity, Save, CheckCircle2, AlertCircle } from "lucide-react";

export default async function AdminUserDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const supabase = await createServerClient();
  const { id: targetUserId } = await params;
  
  // Extract toast messages from URL
  const { success: successMessage, error: errorMessage } = await searchParams;

  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // 2. Fetch the target user's details
  const { data: targetUser, error: fetchError } = await supabase
    .from("profiles")
    .select(`
      *,
      league_memberships ( xp_total, league )
    `)
    .eq("id", targetUserId)
    .single();

  if (fetchError || !targetUser) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center space-y-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">User Not Found</h2>
        <p className="text-[#E2D1FE]/60">The requested user does not exist in the database.</p>
        <Button asChild className="bg-brand-gradient border-none font-bold accent-glow hover:brightness-110">
          <Link href="/admin/users">Return to Directory</Link>
        </Button>
      </div>
    );
  }

  // 3. Inline Server Action for updating the user using ADMIN CLIENT
  async function updateUserAdmin(formData: FormData) {
    "use server";
    
    // Auth Check
    const supabaseServer = await createServerClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");
    
    const role = formData.get("role") as string;
    const isActiveStr = formData.get("is_active") as string;
    const isActive = isActiveStr === "true";
    const userId = formData.get("targetUserId") as string;

    // Use Admin Client to bypass RLS when editing another user's profile
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Update the profile using the admin client
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        role: role, 
        is_active: isActive 
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update user:", updateError);
      redirect(`/admin/users/${userId}?error=${encodeURIComponent(updateError.message)}`);
    }

    // Refresh the page data and show success toast
    revalidatePath(`/admin/users/${userId}`);
    revalidatePath(`/admin/users`);
    redirect(`/admin/users/${userId}?success=User identity updated successfully`);
  }

  const membership = targetUser.league_memberships?.[0];
  const totalXp = membership?.xp_total || 0;
  const currentLeague = membership?.league?.replace('_', ' ') || "Code Starter";
  const joinedDate = new Date(targetUser.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* FLOATING TOAST NOTIFICATIONS */}
      {successMessage && (
        <div className="fixed top-24 right-8 z-[100] animate-fade-in-down pointer-events-none">
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">{successMessage}</span>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="fixed top-24 right-8 z-[100] animate-fade-in-down pointer-events-none">
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(239,68,68,0.2)] flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold text-sm">{errorMessage}</span>
          </div>
        </div>
      )}

      {/* Back Navigation & Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards">
        <Link href="/admin/users" className="inline-flex items-center text-sm font-bold text-[#E2D1FE]/70 hover:text-accent transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" /> Back to Directory
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
            <UserCog className="w-7 h-7 text-accent" />
          </div>
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground drop-shadow-lg">
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Identity</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: User Identity Card */}
        <div className="md:col-span-1 space-y-6">
          <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards text-center overflow-hidden bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="h-28 w-full bg-gradient-to-br from-accent/40 via-[#22044B]/60 to-black/80 relative">
              <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
            </div>
            
            <CardContent className="pt-0 relative px-6 pb-8">
              <Avatar className="w-24 h-24 border-[4px] border-black/80 shadow-xl mx-auto -mt-12 mb-4 bg-background relative z-10">
                <AvatarImage src={targetUser.avatar_url || ""} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-white/5 text-[#E2D1FE]">
                  {targetUser.full_name ? targetUser.full_name.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="font-heading text-xl font-bold text-foreground drop-shadow-md">{targetUser.full_name || "Unknown User"}</h2>
              <div className="flex items-center justify-center gap-2 mt-1 mb-5">
                <Mail className="w-3.5 h-3.5 text-[#E2D1FE]/40" />
                <p className="text-xs text-[#E2D1FE]/60 font-medium truncate">{targetUser.email}</p>
              </div>
              
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="uppercase font-bold tracking-widest text-[10px] px-3 py-1 rounded-full bg-white/5 text-[#E2D1FE] border-white/10">
                  {targetUser.role.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className={`uppercase font-bold tracking-widest text-[10px] px-3 py-1 rounded-full ${
                  targetUser.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'
                }`}>
                  {targetUser.is_active ? 'Active' : 'Disabled'}
                </Badge>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 text-left">
                <div>
                  <div className="text-[10px] font-bold text-[#E2D1FE]/40 uppercase mb-1 flex items-center gap-1"><Activity className="w-3 h-3"/> XP Total</div>
                  <div className="font-heading text-lg font-bold text-orange-400">{totalXp.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#E2D1FE]/40 uppercase mb-1 flex items-center gap-1"><Calendar className="w-3 h-3"/> Joined</div>
                  <div className="font-bold text-sm text-foreground">{joinedDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Admin Controls */}
        <div className="md:col-span-2 space-y-6">
          <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl h-full">
            <CardHeader className="pb-6 border-b border-white/5 pt-8 px-8">
              <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" /> Security & Access
              </CardTitle>
              <CardDescription className="text-[#E2D1FE]/70 text-sm mt-2">
                Modify platform privileges and account status for this user. Changes take effect immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8">
              <form action={updateUserAdmin} className="space-y-8">
                
                {/* Hidden input to pass targetUserId safely */}
                <input type="hidden" name="targetUserId" value={targetUserId} />
                
                {/* Role Selection */}
                <div className="space-y-3">
                  <label htmlFor="role" className="text-sm text-foreground font-bold ml-1 block">Platform Role</label>
                  <div className="relative">
                    <select 
                      id="role" 
                      name="role" 
                      defaultValue={targetUser.role}
                      className="w-full appearance-none bg-black/40 border border-white/10 text-foreground text-sm font-medium rounded-xl h-12 px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="student" className="bg-gray-900 text-white">Student (Default)</option>
                      <option value="mentor" className="bg-gray-900 text-white">Mentor (Can review submissions)</option>
                      <option value="admin" className="bg-gray-900 text-white">Admin (Full platform access)</option>
                      {/* Only allow super_admin to see/set super_admin to prevent accidental lockouts */}
                      {adminProfile.role === 'super_admin' && (
                        <option value="super_admin" className="bg-gray-900 text-accent font-bold">Super Admin (System Owner)</option>
                      )}
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-[#E2D1FE]/50 ml-1">Assigning an Admin role grants access to the Control Center.</p>
                </div>

                {/* Account Status Selection */}
                <div className="space-y-3">
                  <label htmlFor="is_active" className="text-sm text-foreground font-bold ml-1 block">Account Status</label>
                  <div className="relative">
                    <select 
                      id="is_active" 
                      name="is_active" 
                      defaultValue={targetUser.is_active ? "true" : "false"}
                      className="w-full appearance-none bg-black/40 border border-white/10 text-foreground text-sm font-medium rounded-xl h-12 px-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="true" className="bg-gray-900 text-emerald-400">Active (Can log in & participate)</option>
                      <option value="false" className="bg-gray-900 text-red-400">Disabled (Cannot log in)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-amber-400/70 ml-1">Disabling an account immediately revokes the user's access to the platform.</p>
                </div>

                {/* Save Button */}
                <div className="pt-8 border-t border-white/5 flex justify-end">
                  <Button 
                    type="submit" 
                    className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" /> Apply Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
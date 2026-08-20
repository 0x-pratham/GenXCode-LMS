import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Save, Flame, Trophy, Sparkles, ShieldCheck, AlertTriangle, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { updatePasswordAndProfile } from "@/app/actions/profileActions";
import { Suspense } from "react";

// Optimized Parallel Data Fetcher for Maximum Backend Speed
async function getProfileData(userId: string) {
  const supabase = await createClient();

  // Fetch Profile, League, and XP Events CONCURRENTLY
  // Schema states xp_events is the ultimate source of truth for points[cite: 19].
  const [
    { data: profile, error: profileError },
    { data: league, error: leagueError },
    { data: xpEvents, error: xpError }
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("league_memberships").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("xp_events").select("amount").eq("user_id", userId)
  ]);

  if (profileError) console.error("Error fetching profile:", profileError.message);
  if (leagueError) console.error("Error fetching league:", leagueError.message);
  if (xpError) console.error("Error fetching XP:", xpError.message);

  return { profile, league, xpEvents };
}

// Next 15+ searchParams Promise mapping
export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const params = await searchParams;
  const successMessage = params.success;
  const errorMessage = params.error;

  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6 pb-12 relative z-10 focus:outline-none" tabIndex={0}>
      
      {/* FLOATING TOAST NOTIFICATIONS (Rendered Instantly) */}
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

      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <User className="w-7 h-7 text-accent" />
            </div>
            <div>
              Developer <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Profile</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Manage your personal credentials, identity, and track your global league statistics.
          </p>
        </div>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent userId={user.id} userEmail={user.email || ""} />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function ProfileContent({ userId, userEmail }: { userId: string, userEmail: string }) {
  const { profile, league, xpEvents } = await getProfileData(userId);

  // Calculate actual total XP dynamically from the raw events table[cite: 19]
  const calculatedXp = xpEvents?.reduce((sum, ev) => sum + Number(ev.amount), 0) || 0;

  const fullName = profile?.full_name || "";
  const email = profile?.email || userEmail;
  const avatarUrl = profile?.avatar_url || "";
  const role = profile?.role || "student";
  const mustChangePassword = profile?.must_change_password || false;
  
  // Use calculated XP. If it's 0 but league has XP, use league XP as fallback.
  const totalXp = calculatedXp > 0 ? calculatedXp : (league?.xp_total || 0);
  
  // Dynamic League assignment based on actual XP
  let currentLeagueName = "code starter";
  if (totalXp > 500) currentLeagueName = "code champion";
  else if (totalXp > 200) currentLeagueName = "code builder";
  
  const currentLeague = league?.league?.replace('_', ' ') || currentLeagueName.replace('_', ' ');
  const xpProgress = Math.min((totalXp % 1000) / 10, 100) || 5;

  return (
    <>
      {/* MANDATORY PASSWORD CHANGE POPUP MODAL */}
      {mustChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0C0224] border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
              <h2 className="font-heading text-2xl font-bold">Action Required</h2>
            </div>
            <p className="text-sm text-[#E2D1FE]/80 mb-6 leading-relaxed">
              You are currently logged in with a temporary default password (<span className="text-foreground font-mono font-bold">Welcome2GenXCode</span>). For security reasons, you must change your password before accessing the portal.
            </p>

            <form action={updatePasswordAndProfile} className="space-y-4">
              <input type="hidden" name="fullName" value={fullName} />
              <input type="hidden" name="avatarUrl" value={avatarUrl} />
              
              <div className="space-y-2">
                <Label className="text-foreground font-bold text-xs">New Secure Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2D1FE]/40" />
                  <Input 
                    name="newPassword" 
                    type="password" 
                    placeholder="Enter new secure password" 
                    required 
                    minLength={6}
                    className="pl-10 bg-black/40 border-amber-500/30 text-foreground rounded-xl h-12 focus-visible:ring-amber-500"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-500 text-foreground font-bold shadow-lg hover:brightness-110 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Update Password & Continue
              </Button>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Display */}
        <div className="md:col-span-1 space-y-6">
          <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards text-center overflow-hidden bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="h-32 w-full bg-gradient-to-br from-accent/40 via-[#22044B]/60 to-black/80 relative">
              <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
            </div>
            <CardContent className="pt-0 relative px-6 pb-8">
              <Avatar className="w-28 h-28 border-[4px] border-black/80 shadow-[0_0_30px_rgba(134,56,205,0.4)] mx-auto -mt-14 mb-4 bg-background relative z-10">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="text-4xl font-bold bg-white/5 text-[#E2D1FE]">
                  {fullName ? fullName.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="font-heading text-2xl font-bold text-foreground drop-shadow-md truncate">{fullName || "Unknown Dev"}</h2>
              <p className="text-sm text-[#E2D1FE]/50 truncate mb-5 font-medium">{email}</p>
              
              <Badge variant="outline" className="uppercase font-bold tracking-widest text-[10px] px-4 py-1.5 rounded-full bg-accent/10 text-accent border-accent/20 shadow-inner">
                {role} <ShieldCheck className="w-3 h-3 ml-1.5 inline-block" />
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-sm text-[#E2D1FE]/60 uppercase tracking-widest font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Combat Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#E2D1FE]/80">
                    <Flame className="w-4 h-4 text-orange-400" /> Total XP
                  </div>
                  <div className="font-heading text-xl font-bold text-orange-400 drop-shadow-sm">
                    {totalXp.toLocaleString()}
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 transition-all duration-1000"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="flex items-center gap-2 text-sm font-bold text-[#E2D1FE]/80">
                  <Trophy className="w-4 h-4 text-accent" /> Current League
                </div>
                <div className="font-bold text-accent capitalize text-base drop-shadow-sm">
                  {currentLeague}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Settings Form */}
        <div className="md:col-span-2 animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl h-full shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <CardHeader className="pb-6 border-b border-white/5 pt-8 px-8">
              <CardTitle className="text-2xl font-bold text-foreground">Profile Settings</CardTitle>
              <CardDescription className="text-[#E2D1FE]/70 text-base mt-2">
                Update your identity and account security credentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8">
              <form action={updatePasswordAndProfile} className="space-y-7">
                
                <div className="space-y-2.5">
                  <Label className="text-foreground/80 font-bold ml-1">Email Address (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2D1FE]/40" />
                    <Input value={email} disabled className="pl-11 bg-black/40 border-white/5 text-[#E2D1FE]/50 rounded-xl h-12 shadow-inner" />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="fullName" className="text-foreground font-bold ml-1">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    defaultValue={fullName} 
                    required 
                    className="bg-black/20 border-white/10 text-foreground rounded-xl h-12 backdrop-blur-sm focus-visible:ring-accent"
                  />
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="avatarUrl" className="text-foreground font-bold ml-1">Avatar URL (Optional)</Label>
                  <Input 
                    id="avatarUrl" 
                    name="avatarUrl" 
                    type="url"
                    defaultValue={avatarUrl} 
                    placeholder="https://example.com/my-photo.jpg" 
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                  <p className="text-[11px] font-medium text-[#E2D1FE]/50 ml-1">Provide a direct link to an image (e.g., from Imgur, GitHub, or LinkedIn).</p>
                </div>

                <div className="space-y-2.5 border-t border-white/10 pt-6">
                  <Label htmlFor="newPassword" className="text-foreground font-bold ml-1">Change Password (Optional)</Label>
                  <Input 
                    id="newPassword" 
                    name="newPassword" 
                    type="password" 
                    placeholder="Enter new password to update" 
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 rounded-xl h-12 backdrop-blur-sm focus-visible:ring-accent"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button 
                    type="submit" 
                    className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow shadow-lg w-full sm:w-auto hover:brightness-110 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
      {/* Left Column Skeleton */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-black/20 border border-white/10 rounded-3xl h-[340px] flex flex-col items-center pt-24 pb-8 px-6 relative overflow-hidden">
          <div className="absolute top-0 w-full h-32 bg-white/5"></div>
          <div className="w-28 h-28 rounded-full bg-white/10 border-4 border-black/80 absolute top-16 shadow-inner"></div>
          <div className="h-6 w-3/4 bg-white/10 rounded mt-8 mb-2"></div>
          <div className="h-4 w-1/2 bg-white/5 rounded mb-4"></div>
          <div className="h-6 w-1/3 bg-white/5 rounded-full"></div>
        </div>
        <div className="bg-black/20 border border-white/10 rounded-3xl h-[200px] p-6">
          <div className="h-5 w-1/3 bg-white/10 rounded mb-6"></div>
          <div className="h-16 w-full bg-white/5 rounded-2xl mb-4"></div>
          <div className="h-16 w-full bg-white/5 rounded-2xl"></div>
        </div>
      </div>
      
      {/* Right Column Skeleton */}
      <div className="md:col-span-2">
        <div className="bg-black/20 border border-white/10 rounded-3xl h-full min-h-[500px] p-8">
          <div className="h-8 w-1/3 bg-white/10 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-white/5 rounded mb-8"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 w-1/4 bg-white/10 rounded mb-2"></div>
              <div className="h-12 w-full bg-white/5 rounded-xl"></div>
            </div>
            <div>
              <div className="h-4 w-1/4 bg-white/10 rounded mb-2"></div>
              <div className="h-12 w-full bg-white/5 rounded-xl"></div>
            </div>
            <div>
              <div className="h-4 w-1/4 bg-white/10 rounded mb-2"></div>
              <div className="h-12 w-full bg-white/5 rounded-xl mb-1"></div>
              <div className="h-3 w-1/3 bg-white/5 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
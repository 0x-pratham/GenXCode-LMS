import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Save, Flame, Trophy, Sparkles, ShieldCheck } from "lucide-react";
import { updateProfile } from "@/app/actions/profileActions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Profile & League Stats (Backend Logic Untouched)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const { data: league } = await supabase
    .from("league_memberships")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const fullName = profile?.full_name || "";
  const email = profile?.email || "";
  const avatarUrl = profile?.avatar_url || "";
  const role = profile?.role || "student";
  
  const totalXp = league?.xp_total || 0;
  const currentLeague = league?.league?.replace('_', ' ') || "Code Starter";

  // Visual Only Logic: Calculate a mock progress percentage based on XP for the new UI add-on
  const xpProgress = Math.min((totalXp % 1000) / 10, 100) || 5;

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Display */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Identity Card */}
          <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards text-center overflow-hidden bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            {/* Premium Banner */}
            <div className="h-32 w-full bg-gradient-to-br from-accent/40 via-[#22044B]/60 to-black/80 relative">
              <div className="absolute inset-0 bg-[url('/assets/grid-pattern.svg')] opacity-20"></div>
            </div>
            
            <CardContent className="pt-0 relative px-6 pb-8">
              {/* Glowing Avatar */}
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

          {/* New Add-on: Advanced Stats Card */}
          <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl rounded-3xl shadow-xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-sm text-[#E2D1FE]/60 uppercase tracking-widest font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Combat Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              
              {/* XP Progress Block */}
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-black/40 border border-white/5 shadow-inner">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#E2D1FE]/80">
                    <Flame className="w-4 h-4 text-orange-400" /> Total XP
                  </div>
                  <div className="font-heading text-xl font-bold text-orange-400 drop-shadow-sm">
                    {totalXp.toLocaleString()}
                  </div>
                </div>
                {/* Visual Progress Bar to Next Tier */}
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-400 shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <div className="text-[10px] font-bold text-[#E2D1FE]/40 text-right uppercase tracking-wider">
                  Next Tier Progress
                </div>
              </div>

              {/* League Block */}
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
                Update how you appear on the leaderboard and in the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8">
              <form action={updateProfile} className="space-y-7">
                
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-foreground/80 font-bold ml-1">Email Address (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#E2D1FE]/40" />
                    <Input 
                      id="email" 
                      value={email} 
                      disabled 
                      className="pl-11 bg-black/40 border-white/5 text-[#E2D1FE]/50 rounded-xl h-12 shadow-inner" 
                    />
                  </div>
                  <p className="text-[11px] font-medium text-amber-400/70 ml-1">To change your registered email, please contact a platform administrator.</p>
                </div>

                <div className="space-y-2.5">
                  <Label htmlFor="fullName" className="text-foreground font-bold ml-1">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    defaultValue={fullName} 
                    placeholder="Enter your full name" 
                    required 
                    className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
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

                <div className="pt-8 flex justify-end">
                  <Button 
                    type="submit" 
                    className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg w-full sm:w-auto"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save Changes
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
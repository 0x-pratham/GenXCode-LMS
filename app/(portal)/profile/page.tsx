import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Shield, Save, Flame, Trophy } from "lucide-react";
import { updateProfile } from "@/app/actions/profileActions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch Profile & League Stats
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

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <User className="w-8 h-8 text-accent" />
          My Profile
        </h1>
        <p className="text-foreground/70 mt-1">Manage your personal information and view your stats.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Stats & Display */}
        <div className="md:col-span-1 space-y-6">
          <Card className="text-center overflow-hidden">
            <div className="h-24 bg-primary/10 w-full"></div>
            <CardContent className="pt-0 relative px-4 pb-6">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg mx-auto -mt-12 mb-4 bg-surface">
                <AvatarImage src={avatarUrl} className="object-cover" />
                <AvatarFallback className="text-3xl font-bold bg-primary/5 text-primary">
                  {fullName ? fullName.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <h2 className="font-heading text-xl font-bold text-primary truncate">{fullName || "Developer"}</h2>
              <p className="text-sm text-foreground/60 truncate mb-4">{email}</p>
              <Badge variant="outline" className="uppercase font-bold tracking-widest text-[10px]">
                {role}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-foreground/60 uppercase tracking-wider">Current Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Flame className="w-4 h-4 text-orange-500" /> Total XP
                </div>
                <div className="font-bold text-orange-500">{totalXp.toLocaleString()}</div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/50">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Trophy className="w-4 h-4 text-purple-500" /> League
                </div>
                <div className="font-bold text-purple-500 capitalize">{currentLeague}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Edit Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update how you appear on the leaderboard and in the community.</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateProfile} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/70">Email Address (Read-only)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input id="email" value={email} disabled className="pl-9 bg-surface/50" />
                  </div>
                  <p className="text-[11px] text-foreground/50">To change your email, please contact an admin.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    name="fullName" 
                    defaultValue={fullName} 
                    placeholder="Enter your full name" 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                  <Input 
                    id="avatarUrl" 
                    name="avatarUrl" 
                    type="url"
                    defaultValue={avatarUrl} 
                    placeholder="https://example.com/my-photo.jpg" 
                  />
                  <p className="text-[11px] text-foreground/50">Provide a direct link to an image (e.g., from Imgur, GitHub, or LinkedIn).</p>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                  <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
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
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Shield, Globe, Bell, Save } from "lucide-react";

export default async function SettingsAdminPage() {
  const supabase = await createClient();

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

  // 2. Fetch current system settings (Singleton Row: 'global')
  const { data: settings, error } = await supabase
    .from("system_settings")
    .select("*")
    .eq("id", "global")
    .single();

  if (error) {
    console.error("Error fetching system settings:", error.message);
  }

  // 3. Server Action: Save Configurations
  async function saveSettings(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const platform_name = formData.get("platformName") as string;
    const support_email = formData.get("supportEmail") as string;
    const base_xp = parseInt(formData.get("baseXp") as string) || 10;
    const attendance_xp = parseInt(formData.get("attendanceXp") as string) || 2;

    const { error: updateError } = await supabaseServer
      .from("system_settings")
      .update({
        platform_name,
        support_email,
        base_xp,
        attendance_xp,
        updated_by: currentUser.id
      })
      .eq("id", "global");

    if (updateError) {
      console.error("Failed to update settings:", updateError.message);
      return;
    }

    revalidatePath("/admin/settings");
  }

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Settings className="w-7 h-7 text-accent" />
            </div>
            <div>
              System <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Settings</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Configure platform rules, branding identity, security parameters, and gamification engines.
          </p>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 items-start">
        
        {/* Navigation / Tabs Placeholder Column */}
        <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards md:col-span-1 space-y-3 bg-black/20 border border-white/10 backdrop-blur-xl p-4 rounded-3xl shadow-xl">
          <Button variant="secondary" className="w-full justify-start h-12 rounded-2xl bg-white/10 text-foreground font-bold shadow-inner border border-white/10">
            <Globe className="w-4 h-4 mr-3 text-accent" /> General
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl text-[#E2D1FE]/70 hover:text-foreground hover:bg-white/[0.04] transition-all font-medium">
            <Shield className="w-4 h-4 mr-3 text-purple-400" /> Security & Auth
          </Button>
          <Button variant="ghost" className="w-full justify-start h-12 rounded-2xl text-[#E2D1FE]/70 hover:text-foreground hover:bg-white/[0.04] transition-all font-medium">
            <Bell className="w-4 h-4 mr-3 text-amber-400" /> Notifications (SMTP)
          </Button>
        </div>

        {/* Right Content Column - Wrapped in Form */}
        <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards md:col-span-2">
          <form action={saveSettings} className="space-y-8">
            
            {/* Platform Branding Card */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Platform Branding</CardTitle>
                <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
                  Update the core visual identity and contact info of the LMS.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-8 space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="platformName" className="text-foreground font-bold ml-1">Platform Name</Label>
                  <Input 
                    id="platformName" 
                    name="platformName"
                    defaultValue={settings?.platform_name || "GenXCode"} 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="supportEmail" className="text-foreground font-bold ml-1">Support Contact Email</Label>
                  <Input 
                    id="supportEmail" 
                    name="supportEmail"
                    type="email" 
                    defaultValue={settings?.support_email || "ofc.genxcode@gmail.com"} 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Gamification Engine Card */}
            <Card className="bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">Gamification Engine</CardTitle>
                <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
                  Configure XP rewards, lesson milestones, and leaderboard resets.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 px-8 pb-8 space-y-6">
                <div className="space-y-2.5">
                  <Label htmlFor="baseXp" className="text-foreground font-bold ml-1">Base XP (Lesson Completion)</Label>
                  <Input 
                    id="baseXp" 
                    name="baseXp"
                    type="number" 
                    defaultValue={settings?.base_xp || "10"} 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="attendanceXp" className="text-foreground font-bold ml-1">Live Session XP (Per Min)</Label>
                  <Input 
                    id="attendanceXp" 
                    name="attendanceXp"
                    type="number" 
                    defaultValue={settings?.attendance_xp || "2"} 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Configuration Button */}
            <div className="flex justify-end pt-2">
              <Button type="submit" className="h-12 px-8 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg w-full sm:w-auto">
                <Save className="w-4 h-4 mr-2" /> Save Configurations
              </Button>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
}
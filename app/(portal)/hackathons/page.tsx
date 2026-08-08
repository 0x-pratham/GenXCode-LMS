import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Code, Lock } from "lucide-react";

export default async function HackathonsPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
  // Fetch real hackathons from Supabase
  const { data: hackathons, error } = await supabase
    .from("hackathons")
    .select("*")
    .neq("status", "draft") // Don't show drafts to students
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Error fetching hackathons:", error.message);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Code className="w-7 h-7 text-accent" />
            </div>
            <div>
              Global <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Hackathons</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Form teams, build ambitious projects, and win massive XP rewards to dominate the league.
          </p>
        </div>
      </div>

      {/* Grid Layout for Real Data */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hackathons && hackathons.length > 0 ? (
          hackathons.map((hackathon, index) => {
            // Formatting Date
            const startDate = new Date(hackathon.starts_at).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            });

            // UI Logic Mapped to Elite Glassmorphism Theme
            let badgeClass = "uppercase text-xs font-bold px-3 py-1 rounded-full border ";
            let buttonText = "View Event";
            let buttonStyle = "bg-transparent border border-white/20 text-foreground hover:bg-white/10";
            let buttonDisabled = false;

            if (hackathon.status === "open") {
              badgeClass += "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
              buttonText = "Register Team";
              buttonStyle = "bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover hover:brightness-110";
            } else if (hackathon.status === "announced") {
              badgeClass += "border-amber-500/30 text-amber-400 bg-amber-500/10";
              buttonText = "Coming Soon";
              buttonStyle = "bg-white/5 text-[#E2D1FE]/50 border-white/10 cursor-not-allowed hover:bg-white/5";
              buttonDisabled = true;
            } else if (hackathon.status === "completed") {
              badgeClass += "border-white/20 text-[#E2D1FE]/70 bg-white/5";
              buttonText = "View Winners";
            } else if (hackathon.status === "judging") {
              badgeClass += "border-accent/30 text-accent bg-accent/10";
              buttonText = "Judging in Progress";
              buttonStyle = "bg-white/5 text-[#E2D1FE]/50 border-white/10 cursor-not-allowed hover:bg-white/5";
              buttonDisabled = true;
            }

            // Team size formatting based on schema
            const teamText = hackathon.team_min_size === hackathon.team_max_size
              ? (hackathon.team_min_size === 1 ? "Individual" : `${hackathon.team_min_size} members`)
              : `${hackathon.team_min_size}-${hackathon.team_max_size} members`;

            const animationDelay = `${(index + 2) * 150}ms`;

            return (
              <Card 
                key={hackathon.id} 
                style={{ animationDelay }}
                className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl"
              >
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant="outline" className={badgeClass}>
                      {hackathon.status}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-black/40 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                      <Trophy className="w-4 h-4" /> Massive XP
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm leading-snug">
                    {hackathon.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-5">
                  <p className="text-base text-[#E2D1FE]/70 line-clamp-3 leading-relaxed">
                    {hackathon.description || "Compete with the best. Build something extraordinary."}
                  </p>
                  
                  {/* Detailed Meta Info Block */}
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Users className="w-4 h-4 text-accent" />
                      </div>
                      <span>{teamText}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-accent" />
                      </div>
                      <span>Starts: {startDate}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-2 pb-6 px-6">
                  <Button
                    className={`w-full h-12 rounded-xl transition-all shadow-md ${buttonStyle}`}
                    disabled={buttonDisabled}
                  >
                    {buttonDisabled && <Lock className="w-4 h-4 mr-2 opacity-50" />}
                    {buttonText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <Code className="w-10 h-10 text-[#E2D1FE]/30" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-foreground">No Events Available</h3>
            <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-md mx-auto">
              Admins haven't published any hackathons yet. Sharpen your skills and check back soon for your chance to win XP!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
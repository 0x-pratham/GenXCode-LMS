import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Code } from "lucide-react";

export default async function HackathonsPage() {
  const supabase = await createClient();

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
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Code className="w-8 h-8 text-accent" />
          Hackathons
        </h1>
        <p className="text-foreground/70 mt-1">
          Form teams, build projects, and win massive XP rewards.
        </p>
      </div>

      {/* Grid Layout for Real Data */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hackathons && hackathons.length > 0 ? (
          hackathons.map((hackathon) => {
            // Formatting Date
            const startDate = new Date(hackathon.starts_at).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric', year: 'numeric' 
            });

            // UI Logic based on schema status: 'announced', 'open', 'judging', 'completed'
            let badgeVariant = "secondary";
            let buttonText = "View Event";
            let buttonVariant = "outline";
            let buttonDisabled = false;
            let badgeClass = "uppercase text-xs font-bold";

            if (hackathon.status === "open") {
              badgeClass += " bg-green-500 hover:bg-green-600 text-white border-none";
              buttonText = "Register Team";
              buttonVariant = "default";
            } else if (hackathon.status === "announced") {
              buttonText = "Coming Soon";
              buttonDisabled = true;
            } else if (hackathon.status === "completed") {
              badgeClass += " bg-slate-800 text-white";
              buttonText = "View Winners";
            } else if (hackathon.status === "judging") {
              buttonText = "Judging in Progress";
              buttonDisabled = true;
            }

            // Team size formatting based on schema
            const teamText = hackathon.team_min_size === hackathon.team_max_size
              ? (hackathon.team_min_size === 1 ? "Individual" : `${hackathon.team_min_size} members`)
              : `${hackathon.team_min_size}-${hackathon.team_max_size} members`;

            return (
              <Card key={hackathon.id} className="flex flex-col h-full hover:shadow-md transition-shadow hover:border-primary/20">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={badgeVariant as any} className={badgeClass}>
                      {hackathon.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-accent">
                      <Trophy className="w-4 h-4" /> Massive XP
                    </div>
                  </div>
                  <CardTitle className="text-xl leading-snug">{hackathon.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 space-y-4">
                  <p className="text-sm text-foreground/70 line-clamp-3">
                    {hackathon.description || "No description provided."}
                  </p>
                  
                  <div className="space-y-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-sm text-foreground/70 mt-2">
                      <Users className="w-4 h-4" />
                      <span>{teamText}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Calendar className="w-4 h-4" />
                      <span>Starts: {startDate}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button
                    className={`w-full ${hackathon.status === 'open' ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
                    variant={buttonVariant as any}
                    disabled={buttonDisabled}
                  >
                    {buttonText}
                  </Button>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full py-16 text-center border border-dashed border-border rounded-xl bg-surface/30">
            <Code className="w-16 h-16 text-primary/20 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-primary">No Events Available</h3>
            <p className="text-foreground/60 text-sm mt-1 max-w-sm mx-auto">
              Admins haven't published any hackathons yet. Check back soon for your chance to win XP!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
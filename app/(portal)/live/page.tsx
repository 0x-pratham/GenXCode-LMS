import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export default async function LiveSessionsPage() {
  const supabase = await createClient();

  // 1. Fetch real published sessions
  const { data: sessions, error } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("Error fetching sessions:", error.message);
  }

  // 2. Split sessions into Upcoming and Past based on current time
  const now = new Date();
  const upcomingSessions = sessions?.filter(s => new Date(s.starts_at) >= now) || [];
  const pastSessions = sessions?.filter(s => new Date(s.starts_at) < now) || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Video className="w-8 h-8 text-accent" />
          Live Sessions
        </h1>
        <p className="text-foreground/70 mt-1">Join expert-led masterclasses. Attendance is tracked automatically.</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming Classes</TabsTrigger>
          <TabsTrigger value="past">Attendance History</TabsTrigger>
        </TabsList>

        {/* UPCOMING SESSIONS TAB */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => {
                const startDate = new Date(session.starts_at);
                const dateFormatted = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const timeFormatted = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                return (
                  <Card key={session.id} className="flex flex-col hover:border-primary/30 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={session.provider === 'zoom' ? 'default' : 'secondary'} className="uppercase">
                          {session.provider.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-medium text-foreground/70">
                          <Clock className="w-4 h-4" /> {timeFormatted}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{session.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-sm text-foreground/70 line-clamp-2">
                        {session.description || "Join us for this upcoming live session."}
                      </p>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <div className="flex items-center gap-1.5 text-primary">
                          <Calendar className="w-4 h-4" />
                          {dateFormatted}
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="pt-0 bg-surface/30 p-4 border-t border-border/50">
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm" asChild>
                        <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                          Join Session <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-surface/30">
                <Video className="w-12 h-12 text-primary/20 mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-primary">No Upcoming Sessions</h3>
                <p className="text-foreground/60 text-sm mt-1">Check back later for new masterclasses!</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* PAST SESSIONS & ATTENDANCE TAB */}
        <TabsContent value="past">
          <Card>
            <div className="divide-y divide-border">
              {pastSessions.length > 0 ? (
                pastSessions.map((session) => {
                  const dateFormatted = new Date(session.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 hover:bg-surface/30 transition-colors">
                      <div className="space-y-1 mb-4 sm:mb-0">
                        <h3 className="font-heading text-lg font-bold text-primary">{session.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-foreground/70">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {dateFormatted}</span>
                          <span className="uppercase text-xs font-bold border border-border px-2 py-0.5 rounded-full">{session.provider.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-2">
                        {/* Note: Attendance verification logic will come later, defaulting to pending/absent for now */}
                        <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 px-3 py-1">
                          <Clock className="w-4 h-4 mr-1.5" /> Pending Verification
                        </Badge>
                        <span className="text-xs font-medium text-foreground/50">
                          Recording processing...
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center text-foreground/50">
                  No past sessions found.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
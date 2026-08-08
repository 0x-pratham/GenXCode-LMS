import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Calendar, Clock, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

export default async function LiveSessionsPage() {
  const supabase = await createClient();

  // 1. Fetch real published sessions (Backend untouch)
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
    <div className="space-y-10 max-w-6xl mx-auto pb-12 relative z-10">
      
      {/* Page Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Video className="w-7 h-7 text-accent" />
            </div>
            <div>
              Live <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Sessions</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Join expert-led masterclasses. Attendance is tracked automatically to boost your XP.
          </p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        {/* Glass Styled Tabs List */}
        <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards mb-8 inline-block">
          <TabsList className="bg-black/40 border border-white/10 p-1.5 rounded-2xl backdrop-blur-xl h-auto">
            <TabsTrigger 
              value="upcoming" 
              className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-md text-[#E2D1FE]/60 transition-all"
            >
              Upcoming Classes
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              className="rounded-xl px-6 py-2.5 text-sm font-bold data-[state=active]:bg-white/10 data-[state=active]:text-foreground data-[state=active]:shadow-md text-[#E2D1FE]/60 transition-all"
            >
              Attendance History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* UPCOMING SESSIONS TAB */}
        <TabsContent value="upcoming" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map((session, index) => {
                const startDate = new Date(session.starts_at);
                const dateFormatted = startDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
                const timeFormatted = startDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                const animationDelay = `${(index + 3) * 150}ms`;

                return (
                  <Card 
                    key={session.id} 
                    style={{ animationDelay }}
                    className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start mb-3">
                        <Badge variant="outline" className="uppercase text-xs font-bold px-3 py-1 border-white/20 text-[#E2D1FE] bg-white/5 rounded-full">
                          {session.provider.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-black/40 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                          <Clock className="w-4 h-4" /> {timeFormatted}
                        </div>
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm leading-snug">
                        {session.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 space-y-4">
                      <p className="text-base text-[#E2D1FE]/70 line-clamp-2 leading-relaxed">
                        {session.description || "Join us for this upcoming live masterclass and interact directly with industry experts."}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-semibold bg-white/5 border border-white/5 w-fit px-4 py-2 rounded-xl text-foreground">
                        <Calendar className="w-4 h-4 text-accent" />
                        {dateFormatted}
                      </div>
                    </CardContent>

                    <CardFooter className="pt-5 pb-5 px-6 bg-black/40 border-t border-white/5 mt-auto">
                      <Button className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg" asChild>
                        <a href={session.meeting_url} target="_blank" rel="noopener noreferrer">
                          Join Session <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })
            ) : (
              <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-16 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <Video className="w-10 h-10 text-[#E2D1FE]/30" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">No Upcoming Sessions</h3>
                <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-sm mx-auto">Check back later for new masterclasses and live coding events!</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* PAST SESSIONS & ATTENDANCE TAB */}
        <TabsContent value="past" className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {pastSessions.length > 0 ? (
                pastSessions.map((session) => {
                  const dateFormatted = new Date(session.starts_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  
                  return (
                    <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 sm:px-8 hover:bg-white/[0.03] transition-colors">
                      <div className="space-y-2 mb-4 sm:mb-0">
                        <h3 className="font-heading text-xl font-bold text-foreground drop-shadow-sm">{session.title}</h3>
                        <div className="flex items-center gap-3 text-sm font-medium text-[#E2D1FE]/70">
                          <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#E2D1FE]/50" /> {dateFormatted}</span>
                          <span className="text-white/20">•</span>
                          <span className="uppercase text-xs font-bold border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-full">{session.provider.replace('_', ' ')}</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:items-end gap-2">
                        {/* Premium Pending Verification Badge */}
                        <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 backdrop-blur-md rounded-full font-bold shadow-inner">
                          <Clock className="w-4 h-4 mr-1.5" /> Pending Verification
                        </Badge>
                        <span className="text-xs font-medium text-[#E2D1FE]/50">
                          Recording processing...
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center text-[#E2D1FE]/50 font-medium text-lg">
                  No past sessions found in your history.
                </div>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
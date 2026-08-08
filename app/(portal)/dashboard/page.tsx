import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Swords, BookOpen, Video, ArrowRight, Activity, Flame, Terminal, Clock, Megaphone } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Used .maybeSingle() instead of .single() to prevent crashes if a new user has no profile/league yet
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
  const { data: league } = await supabase.from("league_memberships").select("*").eq("user_id", user.id).maybeSingle();

  const { data: quests } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(2);

  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(2);

  const now = new Date().toISOString();
  const { data: nextSession } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", now)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: announcements } = await supabase
    .from("announcements")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  const totalXp = league?.xp_total || 0;
  const currentLeague = league?.league?.replace('_', ' ') || "Code Starter";
  const fullName = profile?.full_name || "Developer";
  const firstName = fullName.split(' ')[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Premium Glass Welcome Banner with Slow Fade In */}
      <div className="animate-fade-in-up opacity-0 fill-mode-forwards relative rounded-3xl bg-black/20 p-6 sm:p-10 overflow-hidden shadow-2xl border border-white/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 backdrop-blur-2xl">
        {/* Subtle Orchid Glow behind text */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3 mix-blend-screen"></div>
        
        <div className="relative z-10 space-y-3 text-left">
          {/* Welcome Tag removed as requested */}
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground tracking-tight drop-shadow-lg">
            Welcome back, <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">{firstName}</span>!
          </h1>
          <p className="text-[#E2D1FE]/90 text-sm sm:text-lg max-w-xl font-medium drop-shadow-md">
            Ready to crush some code today? Complete your daily quests and join live masterclasses to rank up.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap gap-4 w-full lg:w-auto">
          <div className="flex-1 sm:flex-none bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center min-w-[150px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="text-[#E2D1FE]/70 text-xs font-bold uppercase tracking-wider mb-2">Total XP</div>
            <div className="flex justify-center items-center gap-2 font-heading text-3xl font-bold text-foreground drop-shadow-md">
              <Flame className="w-6 h-6 text-orange-400" /> {totalXp.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 sm:flex-none bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center min-w-[150px] shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="text-[#E2D1FE]/70 text-xs font-bold uppercase tracking-wider mb-2">League</div>
            <div className="font-heading text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-silver-gradient capitalize truncate max-w-[140px] mx-auto drop-shadow-md">{currentLeague}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Column (Quests & Courses) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Quests Section with Staggered Animation */}
          <section className="space-y-5 animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 drop-shadow-md">
                <Swords className="w-6 h-6 text-accent" />
                Today's Quests
              </h2>
              <Link href="/challenges" className="text-sm font-bold text-[#E2D1FE] hover:text-white flex items-center gap-1 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {quests && quests.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {quests.map(quest => (
                  <Card key={quest.id} className="bg-black/20 border-white/10 backdrop-blur-xl flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] transition-all duration-300 rounded-2xl">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-start gap-2 mb-3">
                        <Badge variant="outline" className="capitalize text-xs font-semibold border-white/20 text-[#E2D1FE] bg-white/5 px-3 py-1">{quest.difficulty}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-3 py-1 rounded-full shadow-sm">
                          <Terminal className="w-3 h-3" /> +{quest.xp_reward} XP
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-snug text-foreground font-bold drop-shadow-sm">{quest.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full font-bold bg-white/10 hover:bg-white/20 text-foreground border-transparent backdrop-blur-md transition-all rounded-xl h-11" asChild>
                        <Link href="/challenges">Start Quest</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl rounded-2xl border-dashed">
                <CardContent className="py-12 text-center space-y-3">
                  <Swords className="w-12 h-12 text-[#E2D1FE]/30 mx-auto" />
                  <p className="font-bold text-foreground text-lg">No active quests right now</p>
                  <p className="text-sm text-[#E2D1FE]/60 max-w-xs mx-auto">Take a break or check back later when new challenges are published by admins.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Recent Courses Section with Staggered Animation */}
          <section className="space-y-5 animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2 drop-shadow-md">
                <BookOpen className="w-6 h-6 text-accent" />
                Latest Modules
              </h2>
              <Link href="/courses" className="text-sm font-bold text-[#E2D1FE] hover:text-white flex items-center gap-1 transition-all">
                Library <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {courses && courses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {courses.map(course => (
                  <Card key={course.id} className="bg-black/20 border-white/10 backdrop-blur-xl flex flex-col justify-between hover:bg-white/[0.05] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] transition-all duration-300 rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl leading-snug text-foreground font-bold drop-shadow-sm">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-sm mt-2 text-[#E2D1FE]/80 leading-relaxed">
                        {course.description || "Explore comprehensive learning modules."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full font-bold bg-transparent border border-white/20 hover:bg-white/10 text-foreground transition-all rounded-xl h-11" asChild>
                        <Link href="/courses">View Course</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-black/20 border-white/10 backdrop-blur-xl rounded-2xl border-dashed">
                <CardContent className="py-12 text-center space-y-3">
                  <BookOpen className="w-12 h-12 text-[#E2D1FE]/30 mx-auto" />
                  <p className="font-bold text-foreground text-lg">No modules found</p>
                  <p className="text-sm text-[#E2D1FE]/60 max-w-xs mx-auto">New courses will appear here as soon as they are published.</p>
                </CardContent>
              </Card>
            )}
          </section>

        </div>

        {/* Sidebar Column (Announcements, Next Masterclass & Activity) */}
        <div className="space-y-6">
          
          {/* Announcements Card - Delayed Animation */}
          <Card className="animate-fade-in-up [animation-delay:600ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground drop-shadow-sm">
                <Megaphone className="w-5 h-5 text-accent" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4 divide-y divide-white/10">
                  {announcements.map((item) => (
                    <div key={item.id} className="pt-4 first:pt-0 space-y-1.5">
                      <h5 className="font-bold text-foreground text-sm">{item.title}</h5>
                      <p className="text-xs text-[#E2D1FE]/80 line-clamp-2 leading-relaxed">{item.body}</p>
                      <span className="text-[10px] text-[#E2D1FE]/50 font-medium block pt-1">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-[#E2D1FE]/60 font-medium">
                  No active announcements right now.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Masterclass Card - Delayed Animation */}
          <Card className="animate-fade-in-up [animation-delay:800ms] opacity-0 fill-mode-forwards bg-accent/10 border-accent/20 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="pb-4 border-b border-accent/10">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground drop-shadow-sm">
                <Video className="w-5 h-5 text-accent animate-pulse" />
                Next Masterclass
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              {nextSession ? (
                <div className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="font-bold text-foreground text-base leading-snug drop-shadow-sm">{nextSession.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-[#E2D1FE]/90 font-medium bg-black/20 p-2 rounded-lg border border-white/5">
                      <Clock className="w-4 h-4 text-accent shrink-0" />
                      <span>{new Date(nextSession.starts_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <Button className="w-full h-11 bg-brand-gradient hover:brightness-110 text-foreground border-none font-bold shadow-lg transition-all rounded-xl accent-glow" asChild>
                    <a href={nextSession.meeting_url} target="_blank" rel="noopener noreferrer">Join Link</a>
                  </Button>
                </div>
              ) : (
                <div className="py-8 text-center space-y-2">
                  <p className="text-sm text-foreground font-bold">No upcoming classes scheduled</p>
                  <p className="text-xs text-[#E2D1FE]/60 font-medium">Check back later for live mentorship links.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Card - Delayed Animation */}
          <Card className="animate-fade-in-up [animation-delay:1000ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-2xl">
            <CardHeader className="pb-4 border-b border-white/5">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-foreground drop-shadow-sm">
                <Activity className="w-5 h-5 text-accent" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-xs text-[#E2D1FE]/70 text-center py-10 border border-dashed border-white/20 rounded-xl bg-white/5 px-6 font-medium leading-relaxed">
                Activity feed will update automatically as you complete lessons, quizzes, and quests.
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Swords, BookOpen, Video, ArrowRight, Activity, Flame, Terminal, Clock, Sparkles, Megaphone } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Fetch User Data & XP
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single();
  const { data: league } = await supabase.from("league_memberships").select("*").eq("user_id", user?.id).single();

  // 2. Fetch Latest 2 Active Quests
  const { data: quests } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(2);

  // 3. Fetch Latest 2 Published Courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(2);

  // 4. Fetch Next Upcoming Live Session
  const now = new Date().toISOString();
  const { data: nextSession } = await supabase
    .from("live_sessions")
    .select("*")
    .eq("status", "published")
    .gte("starts_at", now)
    .order("starts_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  // 5. Fetch Latest Published Announcements
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
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl bg-primary p-6 sm:p-8 overflow-hidden shadow-xl border border-primary/20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/15 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        
        <div className="relative z-10 space-y-2 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium backdrop-blur-md border border-white/10 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" /> Elite Developer Portal
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-accent">{firstName}</span>!
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl">
            Ready to crush some code today? Complete your daily quests and join live masterclasses to rank up.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
          <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center min-w-[130px] shadow-inner">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">Total XP</div>
            <div className="flex justify-center items-center gap-1.5 font-heading text-2xl font-bold text-orange-400">
              <Flame className="w-5 h-5 fill-orange-400/20" /> {totalXp.toLocaleString()}
            </div>
          </div>
          <div className="flex-1 sm:flex-none bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 text-center min-w-[130px] shadow-inner">
            <div className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-1">League</div>
            <div className="font-heading text-lg sm:text-xl font-bold text-purple-300 capitalize truncate max-w-[140px] mx-auto">{currentLeague}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Content Column (Quests & Courses) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Quests Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
                <Swords className="w-5 h-5 text-accent" />
                Today's Quests
              </h2>
              <Link href="/challenges" className="text-sm font-semibold text-accent hover:underline flex items-center gap-1 transition-all">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {quests && quests.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {quests.map(quest => (
                  <Card key={quest.id} className="flex flex-col justify-between hover:border-accent/40 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <Badge variant="outline" className="capitalize text-xs font-medium">{quest.difficulty}</Badge>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-2.5 py-1 rounded-full">
                          <Terminal className="w-3 h-3" /> +{quest.xp_reward} XP
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-snug">{quest.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full font-medium" variant="secondary" asChild>
                        <Link href="/challenges">Start Quest</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed bg-surface/50">
                <CardContent className="py-10 text-center space-y-2">
                  <Swords className="w-10 h-10 text-primary/20 mx-auto" />
                  <p className="font-medium text-primary text-sm">No active quests right now</p>
                  <p className="text-xs text-foreground/60 max-w-xs mx-auto">Take a break or check back later when new challenges are published by admins.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Recent Courses Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-primary flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Latest Modules
              </h2>
              <Link href="/courses" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 transition-all">
                Library <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {courses && courses.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {courses.map(course => (
                  <Card key={course.id} className="flex flex-col justify-between hover:border-primary/30 hover:shadow-md transition-all">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs mt-1 text-foreground/70">
                        {course.description || "Explore comprehensive learning modules."}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full font-medium" variant="outline" asChild>
                        <Link href="/courses">View Course</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-dashed bg-surface/50">
                <CardContent className="py-10 text-center space-y-2">
                  <BookOpen className="w-10 h-10 text-primary/20 mx-auto" />
                  <p className="font-medium text-primary text-sm">No modules found</p>
                  <p className="text-xs text-foreground/60 max-w-xs mx-auto">New courses will appear here as soon as they are published.</p>
                </CardContent>
              </Card>
            )}
          </section>

        </div>

        {/* Sidebar Column (Announcements, Next Masterclass & Activity) */}
        <div className="space-y-6">
          
          {/* Announcements Card */}
          <Card className="shadow-sm border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Megaphone className="w-4 h-4 text-primary" />
                Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {announcements && announcements.length > 0 ? (
                <div className="space-y-4 divide-y divide-border/50">
                  {announcements.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 space-y-1">
                      <h5 className="font-bold text-primary text-xs">{item.title}</h5>
                      <p className="text-xs text-foreground/70 line-clamp-2">{item.body}</p>
                      <span className="text-[10px] text-foreground/40 block pt-0.5">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-xs text-foreground/50">
                  No active announcements right now.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Masterclass Card */}
          <Card className="border-accent/30 bg-accent/5 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Video className="w-4 h-4 text-accent" />
                Next Masterclass
              </CardTitle>
            </CardHeader>
            <CardContent>
              {nextSession ? (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-primary text-sm leading-snug">{nextSession.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-foreground/70 pt-1">
                      <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{new Date(nextSession.starts_at).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-sm shadow-sm" asChild>
                    <a href={nextSession.meeting_url} target="_blank" rel="noopener noreferrer">Join Link</a>
                  </Button>
                </div>
              ) : (
                <div className="py-6 text-center space-y-1">
                  <p className="text-xs text-foreground/60 font-medium">No upcoming classes scheduled</p>
                  <p className="text-[11px] text-foreground/40">Check back later for live mentorship links.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-primary">
                <Activity className="w-4 h-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-foreground/60 text-center py-8 border border-dashed border-border rounded-lg bg-surface/30 px-4">
                Activity feed will update automatically as you complete lessons, quizzes, and quests.
              </div>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}
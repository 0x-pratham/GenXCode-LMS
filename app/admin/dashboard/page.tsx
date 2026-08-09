import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mailbox, Activity, ArrowRight, Megaphone, Swords, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // FIXED: High-Performance Concurrent Data Fetching
  // Now querying `invite_requests` for pending count instead of manual invitations
  const [
    { count: studentCount, error: studentError },
    { count: courseCount, error: courseError },
    { count: questCount, error: questError },
    { count: pendingRequestsCount, error: requestsError },
    { data: recentUsers, error: recentUsersError }
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("role", "student"),
    supabase.from("courses").select("*", { count: 'exact', head: true }).eq("status", "published"),
    supabase.from("daily_challenges").select("*", { count: 'exact', head: true }).eq("status", "published"),
    supabase.from("invite_requests").select("*", { count: 'exact', head: true }).eq("status", "pending"), // Correct Table
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5)
  ]);

  if (studentError || courseError || questError || requestsError || recentUsersError) {
    console.error("Admin Dashboard Fetch Errors:", { studentError, courseError, questError, requestsError, recentUsersError });
  }

  // Dynamic KPIs Array
  const KPIS = [
    { title: "Total Students", value: studentCount || 0, change: "Registered users", icon: Users },
    { title: "Active Quests", value: questCount || 0, change: "Currently published", icon: Swords },
    { title: "Published Courses", value: courseCount || 0, change: "Available to learn", icon: Activity },
    { title: "Pending Invites", value: pendingRequestsCount || 0, change: "Applications awaiting review", icon: Mailbox },
  ];

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <ShieldAlert className="w-7 h-7 text-accent" />
            </div>
            <div>
              Platform <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Overview</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Live database metrics, platform analytics, and administrative controls.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          const animationDelay = `${(i + 2) * 100}ms`;

          return (
            <Card 
              key={i} 
              style={{ animationDelay }}
              className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
                <CardTitle className="text-sm font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
                  {kpi.title}
                </CardTitle>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                  <Icon className="h-4 w-4 text-accent" />
                </div>
              </CardHeader>
              <CardContent className="pt-6 px-6 pb-6">
                <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{kpi.value}</div>
                <p className="text-sm font-medium text-[#E2D1FE]/50 mt-2">{kpi.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="animate-fade-in-up [animation-delay:600ms] opacity-0 fill-mode-forwards flex flex-col bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Recently Joined</CardTitle>
              <p className="text-sm font-medium text-[#E2D1FE]/60 mt-1">Latest members added to the platform.</p>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="hidden sm:flex text-foreground hover:bg-white/10 hover:text-white rounded-xl font-bold transition-all group px-4">
                View All <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <Table>
              <TableHeader className="bg-black/20 border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8">User</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs">Role</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10 border border-white/10 shadow-inner">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback className="bg-white/5 text-foreground font-bold text-sm">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground text-base drop-shadow-sm">{user.full_name || "Unknown"}</div>
                            <div className="text-xs font-medium text-[#E2D1FE]/50">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="capitalize bg-white/5 border-white/10 text-[#E2D1FE] px-3 py-1 font-bold">
                          {user.role?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-12 text-[#E2D1FE]/50 font-medium">
                      No recent users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:700ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl h-fit">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6 px-6 pb-6">
            <Button variant="outline" className="w-full justify-start h-20 px-6 bg-black/40 border-white/5 hover:bg-white/[0.04] hover:border-accent/40 hover:text-foreground transition-all duration-300 rounded-2xl group shadow-inner" asChild>
              <Link href="/admin/challenges">
                <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Swords className="w-5 h-5 text-accent" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base text-foreground drop-shadow-sm">Create Daily Challenge</div>
                  <div className="text-xs font-medium text-[#E2D1FE]/50 mt-0.5">Draft a new coding task</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-20 px-6 bg-black/40 border-white/5 hover:bg-white/[0.04] hover:border-[#E2D1FE]/40 hover:text-foreground transition-all duration-300 rounded-2xl group shadow-inner" asChild>
              <Link href="/admin/announcements">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Megaphone className="w-5 h-5 text-[#E2D1FE]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base text-foreground drop-shadow-sm">Post Announcement</div>
                  <div className="text-xs font-medium text-[#E2D1FE]/50 mt-0.5">Notify all active cohorts</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-20 px-6 bg-black/40 border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/40 hover:text-foreground transition-all duration-300 rounded-2xl group shadow-inner" asChild>
              <Link href="/admin/users">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-base text-foreground drop-shadow-sm">Manage Users</div>
                  <div className="text-xs font-medium text-[#E2D1FE]/50 mt-0.5">View all registered students</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
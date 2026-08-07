import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Mailbox, Activity, Code2, ArrowRight, Megaphone, Swords } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch Total Students Count
  const { count: studentCount, error: studentError } = await supabase
    .from("profiles")
    .select("*", { count: 'exact', head: true })
    .eq("role", "student");

  // 2. Fetch Active Courses Count
  const { count: courseCount, error: courseError } = await supabase
    .from("courses")
    .select("*", { count: 'exact', head: true })
    .eq("status", "published");

  // 3. Fetch Active Quests (Challenges) Count
  const { count: questCount, error: questError } = await supabase
    .from("daily_challenges")
    .select("*", { count: 'exact', head: true })
    .eq("status", "published");

  // 4. Fetch Pending Invitations Count (New Dynamic Fetch!)
  const { count: inviteCount, error: inviteError } = await supabase
    .from("invitations")
    .select("*", { count: 'exact', head: true })
    .eq("status", "sent");

  // Log errors to server console if any (for easy debugging)
  if (studentError || courseError || questError || inviteError) {
    console.error("Admin Dashboard Fetch Errors:", { studentError, courseError, questError, inviteError });
  }

  // 5. Fetch 5 Most Recent Users for the table
  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Dynamic KPIs Array
  const KPIS = [
    { title: "Total Students", value: studentCount || 0, change: "Registered users", icon: Users },
    { title: "Active Quests", value: questCount || 0, change: "Currently published", icon: Swords },
    { title: "Published Courses", value: courseCount || 0, change: "Available to learn", icon: Activity },
    { title: "Pending Invites", value: inviteCount || 0, change: "Awaiting acceptance", icon: Mailbox },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary">Admin Overview</h1>
        <p className="text-foreground/70 mt-1">Platform analytics and live database metrics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">
                  {kpi.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{kpi.value}</div>
                <p className="text-xs text-foreground/50 mt-1">{kpi.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Users Table */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recently Joined Students</CardTitle>
              <p className="text-sm text-foreground/70 mt-1">Latest members added to the platform.</p>
            </div>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers && recentUsers.length > 0 ? (
                  recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium text-primary">{user.full_name || "Unknown"}</div>
                            <div className="text-xs text-foreground/50">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {user.role?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm text-foreground/70">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-foreground/50">
                      No recent users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start h-14 transition-colors hover:border-accent hover:text-accent" asChild>
              <Link href="/admin/challenges">
                <Swords className="mr-3 w-5 h-5 text-accent" />
                <div className="text-left">
                  <div className="font-medium">Create Daily Challenge</div>
                  <div className="text-xs text-foreground/50">Draft a new coding task</div>
                </div>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 transition-colors hover:border-primary hover:text-primary">
              <Megaphone className="mr-3 w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">Post Announcement</div>
                <div className="text-xs text-foreground/50">Notify all active cohorts</div>
              </div>
            </Button>
            <Button variant="outline" className="w-full justify-start h-14 transition-colors hover:border-green-500 hover:text-green-500" asChild>
              <Link href="/admin/users">
                <Users className="mr-3 w-5 h-5 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Manage Users</div>
                  <div className="text-xs text-foreground/50">View all registered students</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
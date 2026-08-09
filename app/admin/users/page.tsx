import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MailPlus, ShieldAlert, MoreVertical } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const { data: currentUserProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // Redirect unauthorized users back to the student portal
  if (!currentUserProfile || (currentUserProfile.role !== "admin" && currentUserProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // 2. Fetch all user profiles from the database
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error.message);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Users className="w-7 h-7 text-accent" />
            </div>
            <div>
              User <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Management</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Manage student access, assign administrative roles, and generate platform invitations.
          </p>
        </div>
        {/* Made button functional by wrapping with Link */}
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0" asChild>
          <Link href="/admin/invitations">
            <MailPlus className="w-4 h-4 mr-2" /> Generate Invite Link
          </Link>
        </Button>
      </div>

      {/* Users Table Card */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Registered Members</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            All users currently authenticated on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-black/20 border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">User</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Role</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Joined Date</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;
                  const isAdmin = user.role === 'admin' || user.role === 'super_admin';

                  return (
                    <TableRow 
                      key={user.id} 
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                    >
                      <TableCell className="pl-8 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className={`w-10 h-10 border shadow-inner ${isAdmin ? 'border-accent/40 shadow-[0_0_15px_rgba(134,56,205,0.2)]' : 'border-white/10'}`}>
                            <AvatarImage src={user.avatar_url || ""} />
                            <AvatarFallback className="bg-white/5 text-foreground font-bold text-sm">
                              {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-bold text-foreground text-base drop-shadow-sm">
                              {user.full_name || "Unknown User"}
                            </div>
                            <div className="text-xs font-medium text-[#E2D1FE]/50">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant="outline" 
                          className={`capitalize px-3 py-1 font-bold ${
                            isAdmin 
                              ? 'bg-accent/10 text-accent border-accent/30 shadow-[0_0_10px_rgba(134,56,205,0.15)]' 
                              : 'bg-white/5 text-[#E2D1FE] border-white/20'
                          }`}
                        >
                          {user.role === 'super_admin' && <ShieldAlert className="w-3.5 h-3.5 mr-1.5" />}
                          {user.role?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant="outline"
                          className={`capitalize px-3 py-1 font-bold ${
                            user.is_active 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                              : 'bg-white/5 text-[#E2D1FE]/50 border-white/10'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          {new Date(user.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        {/* Made action button functional to navigate to specific user details */}
                        <Button variant="ghost" size="icon" className="text-[#E2D1FE]/50 hover:text-foreground hover:bg-white/10 rounded-xl transition-all" asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <MoreVertical className="w-5 h-5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-16 text-[#E2D1FE]/50 font-medium">
                    No users found in the database.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
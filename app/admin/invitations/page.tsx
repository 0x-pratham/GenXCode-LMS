import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MailOpen, Plus } from "lucide-react";

export default async function InvitationsPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
  // Fetch invitations with a join on profiles to see who sent the invite
  const { data: invitations, error } = await supabase
    .from("invitations")
    .select(`
      *,
      inviter:profiles!invited_by ( full_name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching invitations:", error);
  }

  // Refined Status Colors for Glass Theme
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]';
      case 'sent': return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
      case 'revoked': return 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]';
      case 'expired': return 'bg-white/5 text-[#E2D1FE]/60 border-white/10';
      default: return 'bg-white/5 text-[#E2D1FE]/80 border-white/20';
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <MailOpen className="w-7 h-7 text-accent" />
            </div>
            <div>
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Invitations</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Control platform access, issue new links, and view all pending system invites.
          </p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Send New Invite
        </Button>
      </div>

      {/* Invitations Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Invitation History</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            A complete log of all system invitations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Email</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Role</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Invited By</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Expires At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations && invitations.length > 0 ? (
                invitations.map((invite, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;

                  return (
                    <TableRow 
                      key={invite.id} 
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4 font-bold text-foreground drop-shadow-sm">
                        {invite.email}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold bg-white/5 border-white/5 text-[#E2D1FE]/70 px-2.5 py-1">
                          {invite.role?.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className={`capitalize border px-3 py-1 font-bold backdrop-blur-md ${getStatusColor(invite.status)}`}>
                          {invite.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-[#E2D1FE]/70">
                        {Array.isArray(invite.inviter) ? invite.inviter[0]?.full_name : invite.inviter?.full_name || "System"}
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                          {new Date(invite.expires_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No invitations found.
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
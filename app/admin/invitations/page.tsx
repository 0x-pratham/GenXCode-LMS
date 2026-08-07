import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MailOpen, Plus, Send } from "lucide-react";

export default async function InvitationsPage() {
  const supabase = await createClient();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'sent': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
      case 'revoked': return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      case 'expired': return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <MailOpen className="w-8 h-8 text-accent" />
            Manage Invitations
          </h1>
          <p className="text-foreground/70 mt-1">Control platform access and view pending invites.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Send New Invite
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invitation History</CardTitle>
          <CardDescription>A complete log of all system invitations.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead className="text-right">Expires At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations && invitations.length > 0 ? (
                invitations.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                        {invite.role?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`capitalize border-none ${getStatusColor(invite.status)}`}>
                        {invite.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {Array.isArray(invite.inviter) ? invite.inviter[0]?.full_name : invite.inviter?.full_name || "System"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-foreground/70">
                      {new Date(invite.expires_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
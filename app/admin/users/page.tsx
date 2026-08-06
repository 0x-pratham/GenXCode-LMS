import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, MailPlus, ShieldAlert, MoreVertical } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  
  // Fetch all user profiles from the database
  const { data: users, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Users className="w-8 h-8 text-accent" />
            User Management
          </h1>
          <p className="text-foreground/70 mt-1">Manage student access, roles, and platform invitations.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <MailPlus className="w-4 h-4 mr-2" /> Generate Invite Link
        </Button>
      </div>

      {/* Users Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Members</CardTitle>
          <CardDescription>All users currently authenticated on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar_url || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {user.full_name ? user.full_name.charAt(0) : "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-primary">
                            {user.full_name || "Unknown User"}
                          </div>
                          <div className="text-xs text-foreground/50">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === 'admin' || user.role === 'super_admin' 
                            ? 'bg-purple-500/10 text-purple-600 border-purple-500/20 capitalize' 
                            : 'capitalize'
                        }
                      >
                        {user.role === 'super_admin' && <ShieldAlert className="w-3 h-3 mr-1" />}
                        {user.role?.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.is_active ? 'bg-green-500' : 'bg-gray-500'}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4 text-foreground/50" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MailOpen, UserCheck, XCircle, ExternalLink } from "lucide-react";

export default async function InvitationsPage() {
  const supabase = await createClient();

  // 1. Safe Auth & Strict Admin Role Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: adminProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!adminProfile || (adminProfile.role !== "admin" && adminProfile.role !== "super_admin")) {
    redirect("/dashboard");
  }

  // 2. Fetch Public Invite Requests (From the landing page form)
  const { data: inviteRequests, error: requestsError } = await supabase
    .from("invite_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (requestsError) {
    console.error("Error fetching invite requests:", requestsError.message);
  }

  // 3. Server Action: Approve an Invite Request & Create User Account with Default Password
  async function approveRequest(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) return;

    const requestId = formData.get("requestId") as string;
    const email = formData.get("email") as string;
    const fullName = formData.get("fullName") as string;

    // A. Create Supabase Admin Client using Service Role Key to bypass signup blocks and create user
    const supabaseAdmin = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // B. Check if user already exists in auth.users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!userExists) {
      // Create user with requested email and default password "Welcome2GenXCode"
      const { error: createUserError } = await supabaseAdmin.auth.admin.createUser({
        email: email.toLowerCase(),
        password: "Welcome2GenXCode",
        email_confirm: true, // Auto confirm email since admin approved it
        user_metadata: { full_name: fullName }
      });

      if (createUserError) {
        console.error("Failed to create user account in auth:", createUserError.message);
        return;
      }
    }

    // C. Update request status to 'approved'
    const { error: updateError } = await supabaseServer
      .from("invite_requests")
      .update({ status: 'approved' })
      .eq("id", requestId);

    if (updateError) {
      console.error("Failed to update invite request status:", updateError.message);
      return;
    }

    // D. Insert into actual invitations table to track system invite
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await supabaseServer
      .from("invitations")
      .upsert([{
        email: email.toLowerCase(),
        full_name: fullName,
        role: "student",
        invited_by: currentUser.id,
        expires_at: expiresAt.toISOString(),
        status: "accepted" // Automatically accepted since account is created
      }], { onConflict: 'email' });

    revalidatePath("/admin/invitations");
  }

  // 4. Server Action: Reject an Invite Request
  async function rejectRequest(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const requestId = formData.get("requestId") as string;

    const { error: updateError } = await supabaseServer
      .from("invite_requests")
      .update({ status: 'rejected' })
      .eq("id", requestId);

    if (updateError) {
      console.error("Failed to reject request:", updateError.message);
      return;
    }

    revalidatePath("/admin/invitations");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <MailOpen className="w-7 h-7 text-accent" />
            </div>
            <div>
              Access <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Requests</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Review and approve public requests to join the platform. Approving instantly provisions their account with the default password.
          </p>
        </div>
      </div>

      {/* Public Requests Table Card */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Pending Applications</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Users who have requested an invite via the landing page.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Applicant</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Portfolio</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4 w-[250px]">Reason</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inviteRequests && inviteRequests.length > 0 ? (
                inviteRequests.map((req, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;

                  return (
                    <TableRow 
                      key={req.id} 
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4">
                        <div className="font-bold text-foreground drop-shadow-sm truncate max-w-[200px]">{req.full_name}</div>
                        <div className="text-xs text-[#E2D1FE]/60">{req.email}</div>
                      </TableCell>
                      
                      <TableCell className="py-4">
                        {req.portfolio_url ? (
                          <a href={req.portfolio_url} target="_blank" rel="noreferrer" className="text-accent hover:text-white transition-colors text-xs font-bold underline underline-offset-2 flex items-center gap-1 w-fit">
                            View Work <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-xs text-[#E2D1FE]/40 italic">None Provided</span>
                        )}
                      </TableCell>

                      <TableCell className="py-4 text-xs text-[#E2D1FE]/80 line-clamp-2 mt-2 leading-relaxed">
                        {req.reason}
                      </TableCell>

                      <TableCell className="py-4">
                        <Badge 
                          variant="outline" 
                          className={`capitalize text-[10px] tracking-wider font-bold px-2.5 py-1 ${
                            req.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                            req.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                          }`}
                        >
                          {req.status}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-right pr-8 py-4">
                        {req.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            {/* Approve Action */}
                            <form action={approveRequest}>
                              <input type="hidden" name="requestId" value={req.id} />
                              <input type="hidden" name="email" value={req.email} />
                              <input type="hidden" name="fullName" value={req.full_name} />
                              <Button type="submit" size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/20 transition-colors bg-emerald-500/10 border border-emerald-500/20" title="Approve & Create Account">
                                <UserCheck className="w-4 h-4" />
                              </Button>
                            </form>
                            {/* Reject Action */}
                            <form action={rejectRequest}>
                              <input type="hidden" name="requestId" value={req.id} />
                              <Button type="submit" size="sm" variant="ghost" className="h-9 w-9 p-0 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors bg-red-500/10 border border-red-500/20" title="Reject Request">
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </form>
                          </div>
                        ) : (
                          <span className="text-xs text-[#E2D1FE]/40 font-bold uppercase tracking-widest mr-2">Resolved</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No public invite requests currently pending.
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
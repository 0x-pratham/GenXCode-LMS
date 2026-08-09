import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, Filter, Download, ShieldCheck, AlertCircle } from "lucide-react";

// Centralized Helper to Log Actions across the Admin Panel
export async function logAdminAction(action: string, targetId: string, status: 'success' | 'failed' = 'success') {
  "use server";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("audit_logs").insert([{
        actor_id: user.id,
        action,
        target_id: targetId,
        status
      }]);
    }
  } catch (error) {
    console.error("Failed to write to audit log", error);
  }
}

export default async function LogsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;

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

  // 2. Build the Supabase query dynamically based on URL filters
  let query = supabase
    .from("audit_logs")
    .select(`
      id,
      created_at,
      action,
      target_id,
      status,
      actor:profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false })
    .limit(100);

  if (resolvedParams.status && resolvedParams.status !== 'all') {
    query = query.eq("status", resolvedParams.status);
  }

  const { data: auditLogs, error } = await query;

  if (error) {
    console.error("Error fetching audit logs:", error.message);
  }

  // 3. Filter Cycling Logic
  const currentFilter = resolvedParams.status || 'all';
  const nextFilter = currentFilter === 'all' ? 'success' : currentFilter === 'success' ? 'failed' : 'all';
  const filterLabel = currentFilter === 'all' ? 'Filter' : currentFilter === 'success' ? 'Success Only' : 'Failed Only';

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <ScrollText className="w-7 h-7 text-accent" />
            </div>
            <div>
              Audit <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Logs</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Trace administrative security actions and system automated event streams.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Server-Side URL Driven Filter Button */}
          <Button variant="outline" className={`h-12 px-5 rounded-xl border-white/10 transition-all font-bold backdrop-blur-md shadow-sm ${currentFilter !== 'all' ? 'bg-white/10 text-white border-accent/50' : 'bg-white/5 text-foreground hover:bg-white/10 hover:text-white'}`} asChild>
            <Link href={`/admin/logs?status=${nextFilter}`} scroll={false}>
              <Filter className={`w-4 h-4 mr-2 ${currentFilter !== 'all' ? 'text-white' : 'text-accent'}`} /> {filterLabel}
            </Link>
          </Button>

          {/* Simple Link approach to trigger a server-side route for CSV generation (Create `app/admin/logs/export/route.ts` to fully wire this, or leave as a placeholder) */}
          <Button variant="outline" className="h-12 px-5 rounded-xl bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-white transition-all font-bold backdrop-blur-md shadow-sm" asChild>
             <Link href="/admin/logs/export" prefetch={false} target="_blank">
               <Download className="w-4 h-4 mr-2 text-accent" /> Export CSV
             </Link>
          </Button>
          
        </div>
      </div>

      {/* System Activity Trail Card */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">System Activity Trail</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Showing recent security actions and platform content events.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-x-auto">
          <Table className="min-w-[800px]">
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Timestamp</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Actor</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Action</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Target ID</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs && auditLogs.length > 0 ? (
                auditLogs.map((log, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;
                  const isSuccess = log.status === 'success';

                  // Safe extraction of author info from join
                  const actorData = Array.isArray(log.actor) ? log.actor[0] : log.actor;
                  const actorDisplay = actorData?.email || actorData?.full_name || "System";

                  return (
                    <TableRow 
                      key={log.id}
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4 text-xs font-mono text-[#E2D1FE]/70 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("en-US", {
                          month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                        })}
                      </TableCell>
                      <TableCell className="py-4 font-bold text-foreground drop-shadow-sm truncate max-w-[200px]">
                        {actorDisplay}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase font-bold bg-white/5 border-white/10 text-[#E2D1FE] px-2.5 py-1">
                          {log.action.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-mono text-[#E2D1FE]/50 truncate max-w-[150px]">
                        {log.target_id || "N/A"}
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        {isSuccess ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] px-3 py-1 font-bold whitespace-nowrap">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline-block" /> Success
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] px-3 py-1 font-bold whitespace-nowrap">
                            <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline-block" /> Failed
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No system logs recorded matching this filter.
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
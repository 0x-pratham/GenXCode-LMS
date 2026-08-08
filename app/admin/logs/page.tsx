import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, Filter, Download, ShieldCheck, AlertCircle } from "lucide-react";

// Mock data representing System Audit Logs (Backend Logic Unchanged)
const AUDIT_LOGS = [
  {
    id: "log_1",
    timestamp: "2026-08-07T14:22:00Z",
    actor: "ofc.genxcode@gmail.com",
    action: "UPDATE_PROFILE_ROLE",
    target: "user_a1b2",
    status: "success",
  },
  {
    id: "log_2",
    timestamp: "2026-08-07T11:05:30Z",
    actor: "System",
    action: "LEADERBOARD_SEASON_END",
    target: "season_summer_26",
    status: "success",
  },
  {
    id: "log_3",
    timestamp: "2026-08-06T09:15:00Z",
    actor: "aryan@example.com",
    action: "PUBLISH_COURSE",
    target: "course_nextjs_mastery",
    status: "success",
  },
  {
    id: "log_4",
    timestamp: "2026-08-06T08:00:12Z",
    actor: "System API",
    action: "ZOOM_WEBHOOK_SYNC",
    target: "session_daily_standup",
    status: "failed",
  },
];

export default function LogsAdminPage() {
  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
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
          <Button variant="outline" className="h-12 px-5 rounded-xl bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-white transition-all font-bold backdrop-blur-md shadow-sm">
            <Filter className="w-4 h-4 mr-2 text-accent" /> Filter
          </Button>
          <Button variant="outline" className="h-12 px-5 rounded-xl bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-white transition-all font-bold backdrop-blur-md shadow-sm">
            <Download className="w-4 h-4 mr-2 text-accent" /> Export CSV
          </Button>
        </div>
      </div>

      {/* System Activity Trail Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">System Activity Trail</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Showing recent security actions and platform content events.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
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
              {AUDIT_LOGS.map((log, index) => {
                const animationDelay = `${(index + 3) * 100}ms`;
                const isSuccess = log.status === 'success';

                return (
                  <TableRow 
                    key={log.id}
                    style={{ animationDelay }}
                    className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <TableCell className="pl-8 py-4 text-xs font-mono text-[#E2D1FE]/70">
                      {new Date(log.timestamp).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                      })}
                    </TableCell>
                    <TableCell className="py-4 font-bold text-foreground drop-shadow-sm">
                      {log.actor}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase font-bold bg-white/5 border-white/10 text-[#E2D1FE] px-2.5 py-1">
                        {log.action.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-mono text-[#E2D1FE]/50 truncate max-w-[150px]">
                      {log.target}
                    </TableCell>
                    <TableCell className="text-right pr-8 py-4">
                      {isSuccess ? (
                        <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] px-3 py-1 font-bold">
                          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 inline-block" /> Success
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] px-3 py-1 font-bold">
                          <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline-block" /> Failed
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
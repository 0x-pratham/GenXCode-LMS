import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollText, Filter, Download } from "lucide-react";

// Mock data representing System Audit Logs
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <ScrollText className="w-8 h-8 text-accent" />
            Audit Logs
          </h1>
          <p className="text-foreground/70 mt-1">Trace administrative actions and system automated events.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity Trail</CardTitle>
          <CardDescription>Showing recent security and content events.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AUDIT_LOGS.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm text-foreground/70 font-mono">
                    {new Date(log.timestamp).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </TableCell>
                  <TableCell className="font-medium text-primary">{log.actor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] tracking-wider uppercase">
                      {log.action.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-foreground/50 font-mono truncate max-w-[150px]">
                    {log.target}
                  </TableCell>
                  <TableCell className="text-right">
                    {log.status === 'success' ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Success</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-none">Failed</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
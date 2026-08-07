import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck } from "lucide-react";

export default async function AttendancePage() {
  const supabase = await createClient();

  // Fetch attendance with joins for session details and user details
  const { data: attendanceLogs, error } = await supabase
    .from("session_attendance")
    .select(`
      *,
      session:live_sessions ( title, provider ),
      user:profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false })
    .limit(50); // Fetching last 50 records for performance

  if (error) {
    console.error("Error fetching attendance logs:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <ClipboardCheck className="w-8 h-8 text-accent" />
          Live Attendance Logs
        </h1>
        <p className="text-foreground/70 mt-1">Monitor student participation in Zoom and Google Meet sessions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Session Attendance</CardTitle>
          <CardDescription>Automated webhooks and manual logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceLogs && attendanceLogs.length > 0 ? (
                attendanceLogs.map((log) => {
                  const sessionTitle = Array.isArray(log.session) ? log.session[0]?.title : log.session?.title;
                  const userName = Array.isArray(log.user) ? log.user[0]?.full_name : log.user?.full_name;
                  
                  return (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="font-medium text-primary">{userName || "Unknown User"}</div>
                        <div className="text-xs text-foreground/50">{log.participant_email}</div>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">
                        {sessionTitle || "Deleted Session"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                          {log.source.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-foreground/70">
                        {log.minutes_attended ? `${log.minutes_attended} mins` : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        {log.is_present ? (
                          <Badge className="bg-green-500/10 text-green-500 border-none hover:bg-green-500/20">Present</Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-500 border-none hover:bg-red-500/20">Absent</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
                    No attendance logs found.
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
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Clock } from "lucide-react";

export default async function AttendancePage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged[cite: 26]
  // Fetch attendance with joins for session details and user details
  const { data: attendanceLogs, error } = await supabase
    .from("session_attendance")
    .select(`
      *,
      session:live_sessions ( title, provider ),
      user:profiles ( full_name, email )
    `)
    .order("created_at", { ascending: false })
    .limit(50); // Fetching last 50 records for performance[cite: 26]

  if (error) {
    console.error("Error fetching attendance logs:", error);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <ClipboardCheck className="w-7 h-7 text-accent" />
            </div>
            <div>
              Live <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Attendance</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Monitor real-time student participation and tracking in Zoom and Google Meet sessions.
          </p>
        </div>
      </div>

      {/* Attendance Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Recent Session Attendance</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Automated webhooks and manual participation logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Student</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Session</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Source</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Duration</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceLogs && attendanceLogs.length > 0 ? (
                attendanceLogs.map((log, index) => {
                  const sessionTitle = Array.isArray(log.session) ? log.session[0]?.title : log.session?.title;
                  const userName = Array.isArray(log.user) ? log.user[0]?.full_name : log.user?.full_name;
                  const animationDelay = `${(index + 3) * 100}ms`;
                  
                  return (
                    <TableRow 
                      key={log.id}
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4">
                        <div className="font-bold text-foreground drop-shadow-sm">{userName || "Unknown User"}</div>
                        <div className="text-xs font-medium text-[#E2D1FE]/50">{log.participant_email}</div>
                      </TableCell>
                      <TableCell className="py-4 text-sm font-medium text-[#E2D1FE]/80">
                        {sessionTitle || "Deleted Session"}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold bg-white/5 border-white/10 text-[#E2D1FE] px-2.5 py-1">
                          {log.source.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E2D1FE]/70 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                          <Clock className="w-3.5 h-3.5 text-accent" />
                          {log.minutes_attended ? `${log.minutes_attended} mins` : "N/A"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        {log.is_present ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] px-3 py-1 font-bold">
                            Present
                          </Badge>
                        ) : (
                          <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] px-3 py-1 font-bold">
                            Absent
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
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
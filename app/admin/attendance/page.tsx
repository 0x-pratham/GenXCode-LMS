import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClipboardCheck, Clock, Plus, LogIn, LogOut } from "lucide-react";

export default async function AttendancePage() {
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

  // 2. Fetch necessary data for form and table in parallel
  const [
    { data: attendanceLogs, error: attendanceError },
    { data: sessions, error: sessionsError },
    { data: students, error: studentsError }
  ] = await Promise.all([
    supabase
      .from("session_attendance")
      .select(`*, session:live_sessions ( title, provider ), user:profiles ( full_name, email )`)
      .order("created_at", { ascending: false })
      .limit(50),
    supabase
      .from("live_sessions")
      .select("id, title")
      .order("starts_at", { ascending: false })
      .limit(20),
    supabase
      .from("profiles")
      .select("id, full_name, email")
      .eq("role", "student")
      .order("full_name", { ascending: true })
  ]);

  if (attendanceError) console.error("Error fetching attendance logs:", attendanceError.message);

  // 3. Server Action for Marking Manual Attendance
  async function markManualAttendance(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    
    const sessionId = formData.get("sessionId") as string;
    const studentId = formData.get("studentId") as string;
    const joinedAtStr = formData.get("joinedAt") as string;
    const leftAtStr = formData.get("leftAt") as string;
    const status = formData.get("status") as string;
    const isPresent = status === "present";

    // Auto-calculate minutes attended if both times are provided
    let minutesAttended = null;
    let joinedAt = null;
    let leftAt = null;

    if (joinedAtStr) {
      joinedAt = new Date(joinedAtStr);
    }
    if (leftAtStr) {
      leftAt = new Date(leftAtStr);
    }

    if (joinedAt && leftAt) {
      const diffMs = leftAt.getTime() - joinedAt.getTime();
      minutesAttended = Math.max(0, Math.round(diffMs / 60000));
    }

    // Get the student's email to map it properly
    const { data: student } = await supabaseServer.from("profiles").select("email").eq("id", studentId).single();

    const { error: insertError } = await supabaseServer
      .from("session_attendance")
      .insert([
        {
          session_id: sessionId,
          user_id: studentId,
          participant_email: student?.email || "manual_entry",
          joined_at: joinedAt ? joinedAt.toISOString() : null,
          left_at: leftAt ? leftAt.toISOString() : null,
          minutes_attended: minutesAttended,
          is_present: isPresent,
          source: "manual" // Schema strictly allows 'manual' here
        }
      ]);

    if (insertError) {
      console.error("Failed to mark attendance manually:", insertError.message);
      return;
    }

    revalidatePath("/admin/attendance");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <ClipboardCheck className="w-7 h-7 text-accent" />
            </div>
            <div>
              Live <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Attendance</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Monitor real-time participation. Webhooks sync automatically, or log entries manually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Manual Log Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Log Manual Entry</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Add attendance if webhook syncing failed.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={markManualAttendance} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="sessionId" className="text-foreground font-bold ml-1">Live Session</Label>
                <div className="relative">
                  {/* FIX: Moved defaultValue="" here from the option tag */}
                  <select 
                    id="sessionId" 
                    name="sessionId" 
                    defaultValue=""
                    required
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-gray-900 text-[#E2D1FE]/50">Select Session...</option>
                    {sessions?.map(s => (
                      <option key={s.id} value={s.id} className="bg-gray-900 text-white">{s.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="studentId" className="text-foreground font-bold ml-1">Student</Label>
                <div className="relative">
                  {/* FIX: Moved defaultValue="" here from the option tag */}
                  <select 
                    id="studentId" 
                    name="studentId" 
                    defaultValue=""
                    required
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="" disabled className="bg-gray-900 text-[#E2D1FE]/50">Select Student...</option>
                    {students?.map(st => (
                      <option key={st.id} value={st.id} className="bg-gray-900 text-white">{st.full_name || st.email}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="joinedAt" className="text-foreground font-bold ml-1">Joined Time</Label>
                  <Input 
                    id="joinedAt" 
                    name="joinedAt" 
                    type="datetime-local" 
                    className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-11 px-3 text-xs"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="leftAt" className="text-foreground font-bold ml-1">Left Time</Label>
                  <Input 
                    id="leftAt" 
                    name="leftAt" 
                    type="datetime-local" 
                    className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-11 px-3 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-white/5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Participation Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="present"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="present" className="bg-gray-900 text-emerald-400">Present (Attended)</option>
                    <option value="absent" className="bg-gray-900 text-red-400">Absent (No Show)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Log Attendance
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Attendance Table Card - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Recent Participation Logs</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Student & Session</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Joined At</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Left At</TableHead>
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
                          <div className="font-bold text-foreground drop-shadow-sm truncate max-w-[200px]">{userName || log.participant_email}</div>
                          <div className="text-xs font-medium text-accent mt-0.5 truncate max-w-[200px]">{sessionTitle || "Unknown Session"}</div>
                        </TableCell>
                        
                        <TableCell className="py-4 whitespace-nowrap">
                          {log.joined_at ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                              <LogIn className="w-3 h-3" />
                              {new Date(log.joined_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className="text-xs text-[#E2D1FE]/30 italic">--</span>
                          )}
                        </TableCell>

                        <TableCell className="py-4 whitespace-nowrap">
                          {log.left_at ? (
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                              <LogOut className="w-3 h-3" />
                              {new Date(log.left_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          ) : (
                            <span className="text-xs text-[#E2D1FE]/30 italic">--</span>
                          )}
                        </TableCell>

                        <TableCell className="py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E2D1FE]/70 bg-black/40 px-2.5 py-1 rounded-lg border border-white/5">
                            <Clock className="w-3.5 h-3.5 text-[#E2D1FE]/50" />
                            {log.minutes_attended ? `${log.minutes_attended}m` : "--"}
                          </span>
                        </TableCell>
                        
                        <TableCell className="text-right pr-8 py-4 whitespace-nowrap">
                          {log.is_present ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)] px-3 py-1 font-bold tracking-wide">
                              Present
                            </Badge>
                          ) : (
                            <Badge className="bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)] px-3 py-1 font-bold tracking-wide">
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
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Code, ExternalLink, CheckCircle, AlertCircle, MessageSquare, Flame } from "lucide-react";

export default async function SubmissionsAdminPage() {
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

  // 2. Fetch all challenge submissions (Joined with Profiles & Challenges safely)
  const { data: submissions, error } = await supabase
    .from("challenge_submissions")
    .select(`
      id,
      answer_url,
      answer_text,
      status,
      score,
      feedback,
      submitted_at,
      user_id,
      student:profiles!challenge_submissions_user_id_fkey(full_name, email),
      challenge:daily_challenges(id, title, xp_reward)
    `)
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error.message);
  }

  // 3. Fully Self-Contained Server Action: Review, Grade, XP & Leaderboard Synchronization
  async function handleReviewSubmission(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const submissionId = formData.get("submissionId") as string;
    const studentId = formData.get("userId") as string;
    const challengeId = formData.get("challengeId") as string;
    const actionType = formData.get("actionType") as string; // 'reviewed' or 'returned'
    const feedback = formData.get("feedback") as string;
    const awardedXp = parseFloat(formData.get("score") as string) || 0;

    // Use Admin Client to bypass RLS restrictions safely during background updates
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // A. Update the submission table
    const { error: updateError } = await supabaseAdmin
      .from("challenge_submissions")
      .update({
        status: actionType,
        feedback,
        score: actionType === 'reviewed' ? awardedXp : 0,
        reviewed_by: currentUser.id,
        reviewed_at: new Date().toISOString()
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Failed to review submission:", updateError.message);
      return;
    }

    // B. If approved, record into xp_events and update student's league memberships XP total
    if (actionType === "reviewed" && awardedXp > 0) {
      // 1. Upsert into xp_events (Schema unique constraint: user_id, source_type, source_id)
      await supabaseAdmin.from("xp_events").upsert({
        user_id: studentId,
        source_type: 'challenge',
        source_id: challengeId,
        amount: awardedXp,
        awarded_by: currentUser.id
      }, { onConflict: 'user_id, source_type, source_id' });

      // 2. Fetch current league membership to calculate new cumulative xp_total
      const { data: membership } = await supabaseAdmin
        .from("league_memberships")
        .select("xp_total")
        .eq("user_id", studentId)
        .maybeSingle();

      const currentXpTotal = membership?.xp_total || 0;
      
      // Upsert cumulative XP into league memberships
      await supabaseAdmin.from("league_memberships").upsert({
        user_id: studentId,
        xp_total: currentXpTotal + awardedXp,
      }, { onConflict: 'season_id, user_id' }); // Fallback or direct update based on user_id
    }

    // C. Auto-record into Audit Logs
    await supabaseAdmin.from("audit_logs").insert([{
      actor_id: currentUser.id,
      action: actionType === "reviewed" ? "APPROVE_SUBMISSION" : "RETURN_SUBMISSION",
      target_id: submissionId,
      status: "success"
    }]);

    revalidatePath("/admin/submissions");
    revalidatePath("/challenges");
    revalidatePath("/leaderboard");
    revalidatePath("/dashboard");
  }

  // Visual Badges for Elite Theme
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reviewed':
        return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold px-3 py-1 text-xs uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]">Approved</Badge>;
      case 'returned':
        return <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30 font-bold px-3 py-1 text-xs uppercase shadow-[0_0_10px_rgba(239,68,68,0.1)]">Returned</Badge>;
      default:
        return <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold px-3 py-1 text-xs uppercase">Pending Review</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Code className="w-7 h-7 text-accent" />
            </div>
            <div>
              Student <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Submissions</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Review challenge answers, allocate XP rewards, and return actionable feedback.
          </p>
        </div>
      </div>

      {/* Submissions Data Table - 99% Transparent Glass Card */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Pending & Reviewed Works</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            All submitted projects and challenges from active cohorts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-x-auto">
          <Table className="min-w-[1100px]">
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4 w-[20%]">Student & Challenge</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4 w-[25%]">Submitted Answer</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4 w-[15%]">Status</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4 w-[40%]">Grading & Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length > 0 ? (
                submissions.map((sub, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;
                  
                  // Safe joins mapping
                  const studentData = Array.isArray(sub.student) ? sub.student[0] : sub.student;
                  const challengeData = Array.isArray(sub.challenge) ? sub.challenge[0] : sub.challenge;
                  const maxXP = challengeData?.xp_reward || 50;
                  const challengeId = challengeData?.id || "";

                  return (
                    <TableRow 
                      key={sub.id}
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      {/* Student & Challenge Identity */}
                      <TableCell className="pl-8 py-6 align-top">
                        <div className="space-y-4">
                          <div>
                            <div className="font-bold text-foreground text-base drop-shadow-sm truncate max-w-[200px]">
                              {studentData?.full_name || "Unknown Student"}
                            </div>
                            <div className="text-xs font-medium text-[#E2D1FE]/50 mt-0.5 truncate max-w-[200px]">
                              {studentData?.email}
                            </div>
                          </div>
                          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs text-[#E2D1FE]/80 shadow-inner">
                            <span className="font-semibold block text-white line-clamp-2">{challengeData?.title || "Deleted Challenge"}</span>
                            <span className="text-accent font-bold mt-1.5 flex items-center gap-1">
                              <Flame className="w-3.5 h-3.5" /> Max XP: {maxXP}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Submitted Answer Data */}
                      <TableCell className="py-6 align-top">
                        <div className="space-y-3 pr-4">
                          {sub.answer_url && (
                            <Button variant="outline" size="sm" className="h-9 px-4 bg-white/5 border-white/10 text-foreground hover:bg-white/10 rounded-xl shadow-sm w-fit font-bold" asChild>
                              <Link href={sub.answer_url} target="_blank">
                                <ExternalLink className="w-3.5 h-3.5 mr-2 text-accent" /> View Source Code
                              </Link>
                            </Button>
                          )}
                          {sub.answer_text && (
                            <div className="text-sm font-medium text-[#E2D1FE]/70 bg-black/20 p-3.5 rounded-xl border border-white/5 line-clamp-4 max-w-[300px]">
                              {sub.answer_text}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Status & Date */}
                      <TableCell className="py-6 align-top">
                        <div className="space-y-3">
                          {getStatusBadge(sub.status)}
                          <div className="text-xs text-[#E2D1FE]/50 font-medium bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 w-fit shadow-inner">
                            {new Date(sub.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>

                      {/* Review & Grading Panel */}
                      <TableCell className="text-right pr-8 py-6 align-top">
                        {sub.status === 'submitted' || sub.status === 'draft' ? (
                          <form action={handleReviewSubmission} className="flex flex-col gap-3 max-w-[350px] ml-auto bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
                            <input type="hidden" name="submissionId" value={sub.id} />
                            <input type="hidden" name="userId" value={sub.user_id} />
                            <input type="hidden" name="challengeId" value={challengeId} />
                            
                            <div className="flex gap-3 items-center justify-between">
                              <label className="text-xs font-bold text-[#E2D1FE]/70">Award XP:</label>
                              <Input 
                                name="score" 
                                type="number" 
                                max={maxXP}
                                defaultValue={maxXP} 
                                required 
                                className="h-10 w-28 text-center font-bold bg-black/40 border-white/10 text-accent placeholder:text-accent/30 focus-visible:ring-accent rounded-xl"
                              />
                            </div>
                            
                            <Textarea 
                              name="feedback" 
                              placeholder="Leave constructive feedback..." 
                              required 
                              className="min-h-[80px] text-sm bg-black/40 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent resize-none rounded-xl p-3"
                            />
                            
                            <div className="flex gap-3 w-full mt-1">
                              <button type="submit" name="actionType" value="reviewed" className="flex-1 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 font-bold transition-all shadow-md flex items-center justify-center text-xs cursor-pointer">
                                <CheckCircle className="w-4 h-4 mr-1.5" /> Approve
                              </button>
                              <button type="submit" name="actionType" value="returned" className="flex-1 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 font-bold transition-all shadow-md flex items-center justify-center text-xs cursor-pointer">
                                <AlertCircle className="w-4 h-4 mr-1.5" /> Return
                              </button>
                            </div>
                          </form>
                        ) : (
                          /* Read-Only State for Reviewed items */
                          <div className="flex flex-col items-end gap-3 max-w-[320px] ml-auto">
                            <div className="flex items-center gap-2.5 bg-black/40 px-4 py-2.5 rounded-xl border border-white/5 shadow-inner">
                              {sub.status === 'reviewed' ? <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-sm" /> : <AlertCircle className="w-5 h-5 text-red-400 drop-shadow-sm" />}
                              <span className="text-base font-bold text-foreground drop-shadow-sm">Awarded: <span className="text-accent">{sub.score} / {maxXP} XP</span></span>
                            </div>
                            {sub.feedback && (
                              <div className="text-sm font-medium text-left w-full text-[#E2D1FE]/80 bg-black/20 p-4 rounded-xl border border-white/5 flex items-start gap-3 shadow-inner">
                                <MessageSquare className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                                <span className="leading-relaxed whitespace-pre-wrap">{sub.feedback}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </TableCell>

                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No active submissions waiting for review. All caught up!
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
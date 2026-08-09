import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Plus, Flame, Settings2 } from "lucide-react";

export default async function QuizzesPage() {
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

  // 2. Fetch required data (Quizzes + Courses for dropdown)
  // Fetch quizzes with their question count
  const [
    { data: quizzes, error: quizzesError },
    { data: courses, error: coursesError }
  ] = await Promise.all([
    supabase
      .from("quizzes")
      .select(`*, course:courses ( title ), cohort:cohorts ( name ), quiz_questions ( count )`)
      .order("created_at", { ascending: false }),
    supabase
      .from("courses")
      .select("id, title")
      .order("created_at", { ascending: false })
  ]);

  if (quizzesError || coursesError) {
    console.error("Error fetching data:", { quizzesError, coursesError });
  }

  // 3. Server Action for Creating a Quiz
  async function createQuiz(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const courseId = formData.get("courseId") as string;
    const xpRewardStr = formData.get("xpReward") as string;
    const status = formData.get("status") as "draft" | "published";
    
    // Fallback logic
    const xpReward = parseInt(xpRewardStr) || 25;
    const finalCourseId = courseId === "none" ? null : courseId;

    const { error: insertError } = await supabaseServer
      .from("quizzes")
      .insert([
        {
          title: title,
          description: description,
          course_id: finalCourseId,
          xp_reward: xpReward,
          status: status,
          opens_at: new Date().toISOString(), // Default opens now
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to create quiz:", insertError.message);
      return;
    }

    revalidatePath(`/admin/quizzes`);
  }

  // 4. Server Action to toggle status (Publish <-> Draft)
  async function toggleQuizStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const quizId = formData.get("quizId") as string;
    const currentStatus = formData.get("currentStatus") as string;
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const { error } = await supabaseServer
      .from("quizzes")
      .update({ status: newStatus })
      .eq("id", quizId);

    if (error) {
      console.error("Failed to update status:", error.message);
      return;
    }

    revalidatePath(`/admin/quizzes`);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <HelpCircle className="w-7 h-7 text-accent" />
            </div>
            <div>
              Manage <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Quizzes</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Create and manage learning assessments, linked modules, and XP rewards.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create Quiz Form - Deep Glass Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards lg:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Create Assessment</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Setup a new quiz and link it to a course.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={createQuiz} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Quiz Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., React Fundamentals Quiz" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Instructions / Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Brief overview of the assessment..." 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[80px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="courseId" className="text-foreground font-bold ml-1">Link to Course</Label>
                <div className="relative">
                  <select 
                    id="courseId" 
                    name="courseId" 
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="none" className="bg-gray-900 text-[#E2D1FE]/50">Standalone (No link)</option>
                    {courses?.map(c => (
                      <option key={c.id} value={c.id} className="bg-gray-900 text-white">{c.title}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="xpReward" className="text-foreground font-bold ml-1">XP Reward</Label>
                  <Input 
                    id="xpReward" 
                    name="xpReward" 
                    type="number" 
                    defaultValue="25" 
                    required 
                    className="bg-black/20 border-white/10 text-foreground focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                  />
                </div>
                
                <div className="space-y-2.5">
                  <Label htmlFor="status" className="text-foreground font-bold ml-1">Visibility</Label>
                  <div className="relative">
                    <select 
                      id="status" 
                      name="status" 
                      defaultValue="draft"
                      className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                    >
                      <option value="draft" className="bg-gray-900 text-[#E2D1FE]">Draft</option>
                      <option value="published" className="bg-gray-900 text-emerald-400">Published</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#E2D1FE]/50">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Init Assessment
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Quizzes Table Card - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards lg:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">All Quizzes</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Review quiz details, add questions, and toggle visibility.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[750px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Title</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Linked Course</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Created On</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Questions</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quizzes && quizzes.length > 0 ? (
                  quizzes.map((quiz, index) => {
                    const animationDelay = `${(index + 3) * 100}ms`;
                    const isPublished = quiz.status === 'published';
                    // Extract question count from the join query safely
                    const qCount = Array.isArray(quiz.quiz_questions) ? quiz.quiz_questions[0]?.count || 0 : 0;

                    return (
                      <TableRow 
                        key={quiz.id} 
                        style={{ animationDelay }}
                        className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="pl-8 py-4 font-bold text-foreground drop-shadow-sm flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <HelpCircle className="w-4 h-4 text-accent" />
                          </div>
                          <span className="line-clamp-2 max-w-[200px]">{quiz.title}</span>
                        </TableCell>
                        
                        <TableCell className="py-4 text-xs font-medium text-[#E2D1FE]/60 max-w-[150px] truncate">
                          {Array.isArray(quiz.course) ? quiz.course[0]?.title : quiz.course?.title || "Standalone"}
                        </TableCell>
                        
                        {/* UI FIX: Added whitespace-nowrap to prevent date overlapping */}
                        <TableCell className="py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                            {new Date(quiz.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </span>
                        </TableCell>
                        
                        {/* FUNCTIONAL FIX: "Manage Questions" Button */}
                        <TableCell className="py-4">
                          <Link href={`/admin/quizzes/${quiz.id}/questions`}>
                            <Badge variant="outline" className="cursor-pointer hover:bg-white/10 transition-colors bg-white/5 border-white/10 text-[#E2D1FE] px-3 py-1 font-bold flex items-center gap-1.5 w-fit">
                              <Settings2 className="w-3.5 h-3.5" /> 
                              {qCount} Qs
                            </Badge>
                          </Link>
                        </TableCell>

                        <TableCell className="py-4 text-right pr-8">
                          {/* Toggle Form mapped directly to the Badge */}
                          <form action={toggleQuizStatus} className="inline-block">
                            <input type="hidden" name="quizId" value={quiz.id} />
                            <input type="hidden" name="currentStatus" value={quiz.status} />
                            <button type="submit" className="transition-transform hover:scale-105 active:scale-95" title="Click to toggle status">
                              <Badge 
                                variant="outline" 
                                className={`capitalize px-3 py-1 font-bold backdrop-blur-md border cursor-pointer ${
                                  isPublished 
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                    : 'bg-white/5 text-[#E2D1FE]/60 border-white/10'
                                }`}
                              >
                                {quiz.status}
                              </Badge>
                            </button>
                          </form>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="border-none hover:bg-transparent">
                    <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                      No quizzes created yet.
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
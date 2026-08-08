import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus, Flame } from "lucide-react";

export default async function QuizzesPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
  // Fetch quizzes with course and cohort names via Join
  const { data: quizzes, error } = await supabase
    .from("quizzes")
    .select(`
      *,
      course:courses ( title ),
      cohort:cohorts ( name )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching quizzes:", error);
  }

  // Refined Status Badges for Glass Theme
  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Published</Badge>
      : <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Draft</Badge>;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
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
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Create Quiz
        </Button>
      </div>

      {/* Quizzes Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">All Quizzes</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Review quiz details, linked courses, and visibility status.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Title</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Linked Course</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">XP Reward</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;

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
                        <span className="line-clamp-1">{quiz.title}</span>
                      </TableCell>
                      <TableCell className="py-4 text-xs font-medium text-[#E2D1FE]/60">
                        {Array.isArray(quiz.course) ? quiz.course[0]?.title : quiz.course?.title || "Standalone Assessment"}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="flex items-center gap-1.5 font-bold text-orange-400 bg-orange-500/10 w-fit px-2.5 py-1 rounded-md border border-orange-500/20 shadow-inner">
                          <Flame className="w-3.5 h-3.5" /> {quiz.xp_reward}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(quiz.status)}
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                          {new Date(quiz.created_at).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric"
                          })}
                        </span>
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
  );
}
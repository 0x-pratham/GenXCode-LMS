import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HelpCircle, Plus, Flame } from "lucide-react";

export default async function QuizzesPage() {
  const supabase = await createClient();

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

  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Published</Badge>
      : <Badge variant="outline" className="text-foreground/50">Draft</Badge>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <HelpCircle className="w-8 h-8 text-accent" />
            Quiz Management
          </h1>
          <p className="text-foreground/70 mt-1">Create and manage learning assessments and XP rewards.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Create Quiz
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quizzes</CardTitle>
          <CardDescription>Review quiz details, linked courses, and status.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Linked Course</TableHead>
                <TableHead>XP Reward</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizzes && quizzes.length > 0 ? (
                quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell className="font-medium text-primary">{quiz.title}</TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {Array.isArray(quiz.course) ? quiz.course[0]?.title : quiz.course?.title || "Standalone"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-bold text-orange-500">
                        <Flame className="w-3.5 h-3.5" /> {quiz.xp_reward}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(quiz.status)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-foreground/70">
                      {new Date(quiz.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
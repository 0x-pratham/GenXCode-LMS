import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CheckCircle2, ExternalLink, ShieldCheck, Terminal } from "lucide-react";
import { reviewSubmission } from "@/app/actions/adminActions";

export default async function AdminSubmissionsPage() {
  const supabase = await createClient();

  // FIXED: Added explicit relationship hint `:user_id` to resolve multiple foreign keys ambiguity
  const { data: submissions, error } = await supabase
    .from("challenge_submissions")
    .select(`
      id,
      answer_url,
      answer_text,
      status,
      submitted_at,
      user_id,
      profiles:user_id (
        full_name,
        email
      ),
      daily_challenges (
        title,
        xp_reward
      )
    `)
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error.message);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-accent" />
          Quest Submissions Review
        </h1>
        <p className="text-foreground/70 mt-1">Review student solutions, provide feedback, and award XP rewards.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Submissions</CardTitle>
          <CardDescription>Verify student code repositories and reward their progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Quest / Challenge</TableHead>
                <TableHead>Solution Link</TableHead>
                <TableHead>Reward</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions && submissions.length > 0 ? (
                submissions.map((sub: any) => {
                  const student = sub.profiles;
                  const challenge = sub.daily_challenges;
                  const reviewAction = reviewSubmission.bind(null, sub.id, sub.user_id, challenge?.xp_reward || 50);

                  return (
                    <TableRow key={sub.id}>
                      <TableCell>
                        <div className="font-medium text-primary">{student?.full_name || "Unknown Student"}</div>
                        <div className="text-xs text-foreground/50">{student?.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-primary">{challenge?.title || "Daily Quest"}</div>
                        <div className="text-xs text-foreground/50">{sub.answer_text || "No notes provided"}</div>
                      </TableCell>
                      <TableCell>
                        {sub.answer_url ? (
                          <a 
                            href={sub.answer_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-1 text-accent font-medium hover:underline text-sm"
                          >
                            Repository <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-xs text-foreground/40">No link</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-accent/10 text-accent border-accent/20 font-bold">
                          <Terminal className="w-3 h-3 mr-1" /> +{challenge?.xp_reward || 50} XP
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={reviewAction} className="flex items-center justify-end gap-2">
                          <Input 
                            name="feedback" 
                            placeholder="Feedback (optional)" 
                            className="h-8 w-40 text-xs" 
                          />
                          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 text-white h-8">
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Approve & Reward
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-foreground/50">
                    No pending submissions to review right now! All caught up.
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
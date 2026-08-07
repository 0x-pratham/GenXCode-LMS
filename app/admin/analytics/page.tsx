import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Activity, Flame, CheckCircle } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Fetch some aggregate metrics for the analytics dashboard
  const { count: submissionCount } = await supabase
    .from("challenge_submissions")
    .select("*", { count: 'exact', head: true });

  const { count: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*", { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <LineChart className="w-8 h-8 text-accent" />
          Platform Analytics
        </h1>
        <p className="text-foreground/70 mt-1">Deep dive into student engagement and platform health.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Total Challenge Submissions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{submissionCount || 0}</div>
            <p className="text-xs text-foreground/50 mt-1">Across all cohorts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Total Quiz Attempts</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{quizAttempts || 0}</div>
            <p className="text-xs text-foreground/50 mt-1">System wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-foreground/70">Average Daily XP</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">Beta</div>
            <p className="text-xs text-foreground/50 mt-1">Calculating event stream...</p>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[400px] flex flex-col items-center justify-center border-dashed">
        <div className="text-center space-y-3">
          <LineChart className="w-12 h-12 text-foreground/20 mx-auto" />
          <h3 className="font-heading text-xl font-medium text-foreground/50">Chart Integrations Coming Soon</h3>
          <p className="text-sm text-foreground/40 max-w-sm mx-auto">
            Recharts or Chart.js integration will be placed here to visualize daily active users and cohort engagement.
          </p>
        </div>
      </Card>
    </div>
  );
}
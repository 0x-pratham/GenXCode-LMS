import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Activity, Flame, CheckCircle } from "lucide-react";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
  const { count: submissionCount } = await supabase
    .from("challenge_submissions")
    .select("*", { count: 'exact', head: true });

  const { count: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("*", { count: 'exact', head: true });

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <LineChart className="w-7 h-7 text-accent" />
            </div>
            <div>
              Platform <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Analytics</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Deep dive into student engagement, participation metrics, and platform health.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Total Challenge Submissions Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Total Challenge Submissions
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{submissionCount || 0}</div>
            <p className="text-sm font-medium text-[#E2D1FE]/50 mt-2">Across all active cohorts</p>
          </CardContent>
        </Card>

        {/* Total Quiz Attempts Card */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Total Quiz Attempts
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{quizAttempts || 0}</div>
            <p className="text-sm font-medium text-[#E2D1FE]/50 mt-2">System wide tracking</p>
          </CardContent>
        </Card>

        {/* Average Daily XP Card */}
        <Card className="animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Average Daily XP
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">Beta</div>
            <p className="text-sm font-medium text-[#E2D1FE]/50 mt-2">Calculating event stream...</p>
          </CardContent>
        </Card>

      </div>

      {/* Chart Placeholder Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:500ms] opacity-0 fill-mode-forwards min-h-[400px] flex flex-col items-center justify-center border border-dashed border-white/10 bg-white/[0.01] backdrop-blur-sm rounded-3xl p-12 text-center">
        <div className="space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-inner">
            <LineChart className="w-8 h-8 text-[#E2D1FE]/40" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">Chart Integrations Coming Soon</h3>
          <p className="text-base text-[#E2D1FE]/60 font-medium leading-relaxed">
            Recharts or Chart.js integration will be placed here to visualize daily active users, submission velocity, and cohort engagement streams.
          </p>
        </div>
      </Card>
      
    </div>
  );
}
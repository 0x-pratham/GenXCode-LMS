import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Activity, Flame, CheckCircle, Users, BookOpen, BarChart3 } from "lucide-react";

export default async function AnalyticsPage() {
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

  // 2. Fetch Core Platform Metrics concurrently
  const [
    { count: submissionCount },
    { count: quizAttempts },
    { count: activeStudents },
    { count: totalCourses }
  ] = await Promise.all([
    supabase.from("challenge_submissions").select("*", { count: 'exact', head: true }),
    supabase.from("quiz_attempts").select("*", { count: 'exact', head: true }),
    supabase.from("profiles").select("*", { count: 'exact', head: true }).eq("role", "student"),
    supabase.from("courses").select("*", { count: 'exact', head: true })
  ]);

  // 3. Fetch last 7 days of submissions for the Chart
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data: recentSubmissions, error: chartError } = await supabase
    .from("challenge_submissions")
    .select("submitted_at")
    .gte("submitted_at", sevenDaysAgo.toISOString())
    .order("submitted_at", { ascending: true });

  if (chartError) {
    console.error("Error fetching chart data:", chartError.message);
  }

  // 4. Data Processing for the Dynamic Chart
  // Create an array of the last 7 dates for the X-axis
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  // Count submissions per day
  const countsByDate = last7Days.reduce((acc, date) => {
    acc[date] = 0;
    return acc;
  }, {} as Record<string, number>);

  recentSubmissions?.forEach(sub => {
    const date = new Date(sub.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (countsByDate[date] !== undefined) {
      countsByDate[date]++;
    }
  });

  // Prepare final chart data and calculate scale
  const chartData = last7Days.map(date => ({ date, count: countsByDate[date] }));
  const maxCount = Math.max(...chartData.map(d => d.count), 10); // Minimum scale ceiling of 10
  
  // Calculate average daily velocity
  const totalRecent = recentSubmissions?.length || 0;
  const averageVelocity = Math.round((totalRecent / 7) * 10) / 10;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
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

      {/* Primary KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="animate-fade-in-up [animation-delay:150ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-xs font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Registered Students
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-inner">
              <Users className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{activeStudents || 0}</div>
            <p className="text-xs font-medium text-[#E2D1FE]/50 mt-2">Total user base</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-xs font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Active Courses
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-inner">
              <BookOpen className="h-4 w-4 text-amber-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{totalCourses || 0}</div>
            <p className="text-xs font-medium text-[#E2D1FE]/50 mt-2">Available to cohorts</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:250ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-xs font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Total Submissions
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-inner">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{submissionCount || 0}</div>
            <p className="text-xs font-medium text-[#E2D1FE]/50 mt-2">Challenges completed</p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-xs font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Quiz Attempts
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-inner">
              <Activity className="h-4 w-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6">
            <div className="text-4xl font-heading font-bold text-foreground drop-shadow-md">{quizAttempts || 0}</div>
            <p className="text-xs font-medium text-[#E2D1FE]/50 mt-2">System wide tracking</p>
          </CardContent>
        </Card>

      </div>

      {/* Secondary Row: Velocity & Real-time Custom Chart */}
      <div className="grid gap-6 md:grid-cols-3 items-start">
        
        {/* Engagement Velocity Card */}
        <Card className="animate-fade-in-up [animation-delay:400ms] opacity-0 fill-mode-forwards md:col-span-1 bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2 bg-black/10 border-b border-white/5 px-6 pt-6">
            <CardTitle className="text-sm font-bold text-[#E2D1FE]/70 tracking-wide uppercase">
              Daily Velocity
            </CardTitle>
            <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 shadow-inner">
              <Flame className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="pt-6 px-6 pb-6 flex flex-col items-center justify-center text-center h-[calc(100%-80px)]">
            <div className="text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600 drop-shadow-md mb-2">
              {averageVelocity}
            </div>
            <p className="text-sm font-bold text-foreground">Submissions / Day</p>
            <p className="text-xs font-medium text-[#E2D1FE]/40 mt-3 max-w-[200px]">
              Average engagement rate based on the last 7 days of platform activity.
            </p>
          </CardContent>
        </Card>

        {/* Dynamic Server-Side Bar Chart */}
        <Card className="animate-fade-in-up [animation-delay:500ms] opacity-0 fill-mode-forwards md:col-span-2 bg-black/20 border-white/10 backdrop-blur-xl shadow-lg hover:bg-white/[0.04] hover:border-white/20 transition-all rounded-3xl overflow-hidden h-full flex flex-col">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-6 px-6 pb-4">
            <CardTitle className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" /> 7-Day Submission Activity
            </CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/50">
              Live data mapping of student challenge submissions over the past week.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 p-8 flex items-end justify-between gap-2 sm:gap-4 min-h-[300px] relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 px-8 py-8 flex flex-col justify-between pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full border-t border-white/[0.03]"></div>
              ))}
            </div>

            {/* Dynamic Bars rendered directly from database count */}
            {chartData.map((data, index) => {
              const heightPercent = Math.max((data.count / maxCount) * 100, 2); // Minimum 2% height for visibility
              
              return (
                <div key={index} className="flex-1 flex flex-col justify-end items-center gap-3 relative z-10 h-full group">
                  
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 border border-white/10 text-white text-xs font-bold py-1 px-3 rounded-lg shadow-lg pointer-events-none">
                    {data.count}
                  </div>

                  {/* The Bar */}
                  <div className="w-full sm:w-12 bg-white/5 border border-white/5 rounded-t-xl relative overflow-hidden transition-all duration-500 group-hover:bg-white/10" style={{ height: `${heightPercent}%` }}>
                    <div className="absolute bottom-0 left-0 w-full h-full bg-brand-gradient opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    {/* Glowing Top edge */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-accent shadow-[0_0_10px_rgba(134,56,205,0.8)]"></div>
                  </div>
                  
                  {/* Date Label */}
                  <div className="text-[10px] sm:text-xs font-bold text-[#E2D1FE]/50 text-center uppercase tracking-wider whitespace-nowrap">
                    {data.date.split(' ')[0]} <br className="sm:hidden"/> {data.date.split(' ')[1]}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
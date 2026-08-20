import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, Clock, ArrowUpRight, Loader2, Lock } from "lucide-react";
import { Suspense } from "react";

// Optimized Data Fetcher for Maximum Backend Speed
async function getJobsData() {
  const supabase = await createClient();

  // Fetch active hiring campaigns
  // Schema RLS automatically filters out expired jobs and future jobs for students,
  // but allows staff/admins to see all campaigns including drafts[cite: 17].
  const { data: jobs, error } = await supabase
    .from("hiring_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error.message);
  }

  return jobs || [];
}

export default async function JobsPage() {
  const supabase = await createClient();

  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10 focus:outline-none" tabIndex={0}>
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
              <Briefcase className="w-7 h-7 text-accent" />
            </div>
            <div>
              Career <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Opportunities</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Exclusive hiring campaigns, internships, and job openings sourced for our elite developers.
          </p>
        </div>
      </div>

      <Suspense fallback={<JobsSkeleton />}>
        <JobsContent />
      </Suspense>

    </div>
  );
}

// Separated Component to handle Async Data & Suspense boundary smoothly
async function JobsContent() {
  const jobs = await getJobsData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {jobs && jobs.length > 0 ? (
        jobs.map((job, index) => {
          const animationDelay = `${(index + 2) * 150}ms`;
          const isDraft = job.status === "draft";

          return (
            <Card 
              key={job.id} 
              style={{ animationDelay }}
              className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl group"
            >
              {/* Optional Image Cover Block */}
              {job.image_url && (
                <div className="relative h-40 w-full overflow-hidden border-b border-white/5 bg-black/40 shrink-0">
                  {isDraft && (
                    <div className="absolute top-4 left-4 z-20">
                      <Badge variant="outline" className="bg-black/80 text-white/50 border-white/20 backdrop-blur-md uppercase tracking-wider">
                        Draft
                      </Badge>
                    </div>
                  )}
                  <img 
                    src={job.image_url} 
                    alt={job.company_name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                </div>
              )}

              <CardHeader className={`${job.image_url ? 'pt-4' : 'pt-8'} pb-4 relative`}>
                {!job.image_url && isDraft && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-white/5 text-white/50 border-white/10 uppercase tracking-wider text-[10px]">
                      Draft
                    </Badge>
                  </div>
                )}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <Badge variant="outline" className="bg-white/5 border-white/10 text-foreground px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-md">
                    <Building className="w-3.5 h-3.5 text-accent shrink-0" />
                    <span className="truncate max-w-[120px]">{job.company_name}</span>
                  </Badge>
                  {job.ends_at && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-md flex items-center gap-1 mt-0.5 whitespace-nowrap">
                      <Clock className="w-3 h-3 shrink-0" /> 
                      Ends {new Date(job.ends_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm leading-snug group-hover:text-accent transition-colors">
                  {job.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1">
                <p className="text-base text-[#E2D1FE]/70 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
              
              <CardFooter className="pt-5 pb-6 px-6 bg-black/40 border-t border-white/5 mt-auto">
                {isDraft ? (
                  <Button disabled className="w-full h-12 rounded-xl bg-white/5 text-[#E2D1FE]/50 border-white/10 font-bold transition-all shadow-md cursor-not-allowed">
                    <Lock className="w-4 h-4 mr-2" /> Draft Preview
                  </Button>
                ) : (
                  <Button tabIndex={0} className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background" asChild>
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                      Apply Now <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
          <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Briefcase className="w-10 h-10 text-[#E2D1FE]/30" />
          </div>
          <h3 className="font-heading text-2xl font-bold text-foreground">No Active Campaigns</h3>
          <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-md mx-auto">
            We are currently sourcing the best opportunities for you. Keep building your XP and check back later!
          </p>
        </div>
      )}
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function JobsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="bg-black/20 border border-white/10 rounded-3xl h-[420px] flex flex-col overflow-hidden">
          <div className="h-40 bg-white/10 w-full shrink-0 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
          </div>
          <div className="p-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-4">
              <div className="h-8 w-28 bg-white/10 rounded-lg"></div>
              <div className="h-6 w-24 bg-white/5 rounded-md"></div>
            </div>
            <div className="h-6 w-full bg-white/10 rounded mb-2"></div>
            <div className="h-6 w-2/3 bg-white/10 rounded mb-6"></div>
            
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-white/5 rounded"></div>
              <div className="h-4 w-full bg-white/5 rounded"></div>
              <div className="h-4 w-3/4 bg-white/5 rounded"></div>
            </div>
            
            <div className="mt-auto pt-5 border-t border-white/5">
              <div className="h-12 w-full bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, Calendar, ArrowUpRight, Clock } from "lucide-react";

export default async function JobsPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged
  // Fetch active hiring campaigns based on schema logic
  const now = new Date().toISOString();
  const { data: jobs, error } = await supabase
    .from("hiring_campaigns")
    .select("*")
    .eq("status", "published")
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching jobs:", error.message);
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jobs && jobs.length > 0 ? (
          jobs.map((job, index) => {
            const animationDelay = `${(index + 2) * 150}ms`;

            return (
              <Card 
                key={job.id} 
                style={{ animationDelay }}
                className="animate-fade-in-up opacity-0 fill-mode-forwards bg-black/20 border-white/10 backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)] rounded-3xl group"
              >
                {/* Optional Image Cover Block */}
                {job.image_url && (
                  <div className="relative h-40 w-full overflow-hidden border-b border-white/5 bg-black/40">
                    <img 
                      src={job.image_url} 
                      alt={job.company_name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                  </div>
                )}

                <CardHeader className={`${job.image_url ? 'pt-4' : 'pt-8'} pb-4`}>
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-foreground px-3 py-1.5 rounded-lg flex items-center gap-1.5 backdrop-blur-md">
                      <Building className="w-3.5 h-3.5 text-accent" />
                      {job.company_name}
                    </Badge>
                    {job.ends_at && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-1 rounded-md flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> 
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
                  <Button className="w-full h-12 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg" asChild>
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                      Apply Now <ArrowUpRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
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
    </div>
  );
}
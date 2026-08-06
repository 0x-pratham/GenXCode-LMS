import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, Calendar, ExternalLink, ArrowUpRight } from "lucide-react";

export default async function JobsPage() {
  const supabase = await createClient();

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
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-accent" />
          Career Opportunities
        </h1>
        <p className="text-foreground/70 mt-1">Exclusive hiring campaigns and job openings for our elite developers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} className="flex flex-col hover:border-accent/40 transition-all hover:shadow-md group">
              <CardHeader>
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="bg-surface/50 border-border/50 text-foreground/80 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5" />
                    {job.company_name}
                  </Badge>
                  {job.ends_at && (
                    <span className="text-[10px] font-medium text-foreground/50 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> 
                      Ends {new Date(job.ends_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <CardTitle className="text-xl leading-tight group-hover:text-accent transition-colors">
                  {job.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 space-y-4">
                {job.image_url && (
                  <div className="w-full h-32 rounded-md bg-surface/50 border border-border/50 overflow-hidden mb-4">
                    <img src={job.image_url} alt={job.company_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-sm text-foreground/70 line-clamp-3">
                  {job.description}
                </p>
              </CardContent>
              
              <CardFooter className="pt-4 border-t border-border/50 bg-surface/20">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                  <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
                    Apply Now <ArrowUpRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border border-dashed border-border rounded-xl bg-surface/30">
            <Building className="w-12 h-12 text-primary/20 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold text-primary">No Active Hiring Campaigns</h3>
            <p className="text-foreground/60 text-sm mt-1 max-w-md mx-auto">
              We are currently sourcing the best opportunities for you. Keep building your XP and check back later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
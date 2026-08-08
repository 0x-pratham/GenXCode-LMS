import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, ExternalLink, Building } from "lucide-react";
import Link from "next/link";

export default async function JobsAdminPage() {
  const supabase = await createClient();

  // Backend Logic Remains Unchanged[cite: 31]
  const { data: jobs, error } = await supabase
    .from("hiring_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching jobs:", error);

  // Refined Status Badges for Glass Theme
  const getStatusBadge = (status: string) => {
    return status === 'published' 
      ? <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Active</Badge>
      : <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Draft / Closed</Badge>;
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg">
              <Briefcase className="w-7 h-7 text-accent" />
            </div>
            <div>
              Hiring <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Campaigns</span>
            </div>
          </h1>
          <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
            Manage job postings, corporate partner links, and internship opportunities for students.
          </p>
        </div>
        <Button className="h-12 px-6 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      {/* Hiring Campaigns Table Card - 99% Transparent */}
      <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
        <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
          <CardTitle className="text-2xl font-bold text-foreground">Active & Past Campaigns</CardTitle>
          <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
            Control visibility of hiring events across active cohorts.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-white/5">
              <TableRow className="border-none hover:bg-transparent">
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Role & Company</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Start Date</TableHead>
                <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">End Date</TableHead>
                <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Application Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs && jobs.length > 0 ? (
                jobs.map((job, index) => {
                  const animationDelay = `${(index + 3) * 100}ms`;

                  return (
                    <TableRow 
                      key={job.id}
                      style={{ animationDelay }}
                      className="animate-fade-in-up opacity-0 fill-mode-forwards border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <TableCell className="pl-8 py-4">
                        <div className="font-bold text-foreground drop-shadow-sm flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <Building className="w-4 h-4 text-accent" />
                          </div>
                          <span className="line-clamp-1">{job.title}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#E2D1FE]/60 ml-10.5 mt-0.5">{job.company_name}</div>
                      </TableCell>
                      <TableCell className="py-4">
                        {getStatusBadge(job.status)}
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                          {job.starts_at ? new Date(job.starts_at).toLocaleDateString() : "Immediate"}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="text-sm font-medium text-[#E2D1FE]/70 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/5">
                          {job.ends_at ? new Date(job.ends_at).toLocaleDateString() : "Not specified"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-8 py-4">
                        <Button variant="outline" size="sm" className="h-9 px-4 bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-white rounded-xl transition-all font-bold shadow-sm" asChild>
                          <Link href={job.apply_url} target="_blank">
                            Apply Link <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-accent" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className="border-none hover:bg-transparent">
                  <TableCell colSpan={5} className="text-center py-20 text-[#E2D1FE]/40 font-medium tracking-wide">
                    No hiring campaigns posted yet.
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
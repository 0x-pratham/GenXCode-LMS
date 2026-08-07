import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Plus, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function JobsAdminPage() {
  const supabase = await createClient();

  const { data: jobs, error } = await supabase
    .from("hiring_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching jobs:", error);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-accent" />
            Hiring Campaigns
          </h1>
          <p className="text-foreground/70 mt-1">Manage job postings and internship opportunities for students.</p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="w-4 h-4 mr-2" /> Post New Job
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active & Past Campaigns</CardTitle>
          <CardDescription>Control visibility of hiring events across cohorts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role & Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Application Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs && jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-bold text-primary">{job.title}</div>
                      <div className="text-sm text-foreground/70">{job.company_name}</div>
                    </TableCell>
                    <TableCell>
                      {job.status === 'published' ? (
                        <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-foreground/50">Draft / Closed</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {job.starts_at ? new Date(job.starts_at).toLocaleDateString() : "Immediate"}
                    </TableCell>
                    <TableCell className="text-sm text-foreground/70">
                      {job.ends_at ? new Date(job.ends_at).toLocaleDateString() : "Not specified"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={job.apply_url} target="_blank">
                          Apply Link <ExternalLink className="w-3 h-3 ml-2" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
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
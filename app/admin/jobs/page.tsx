import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, Plus, ExternalLink, Building, RefreshCw, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function JobsAdminPage() {
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

  // 2. Fetch Jobs
  const { data: jobs, error } = await supabase
    .from("hiring_campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching jobs:", error.message);

  // 3. Server Action: Create New Job
  async function handleCreateJob(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const { data: { user: currentUser } } = await supabaseServer.auth.getUser();
    if (!currentUser) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const company_name = formData.get("companyName") as string;
    const apply_url = formData.get("applyUrl") as string;
    const description = formData.get("description") as string;
    const startsAtStr = formData.get("startsAt") as string;
    const endsAtStr = formData.get("endsAt") as string;
    const status = (formData.get("status") as "draft" | "published" | "archived") || "draft";

    const { error: insertError } = await supabaseServer
      .from("hiring_campaigns")
      .insert([
        {
          title,
          company_name,
          apply_url,
          description,
          starts_at: startsAtStr ? new Date(startsAtStr).toISOString() : null,
          ends_at: endsAtStr ? new Date(endsAtStr).toISOString() : null,
          status,
          created_by: currentUser.id
        }
      ]);

    if (insertError) {
      console.error("Failed to add job:", insertError.message);
      return;
    }

    revalidatePath("/admin/jobs");
  }

  // 4. Server Action: Rotate Status
  async function handleRotateStatus(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const jobId = formData.get("jobId") as string;
    const currentStatus = formData.get("currentStatus") as string;

    let newStatus: "draft" | "published" | "archived" = "draft";
    if (currentStatus === "draft") newStatus = "published";
    else if (currentStatus === "published") newStatus = "archived";
    else if (currentStatus === "archived") newStatus = "draft";

    const { error: updateError } = await supabaseServer
      .from("hiring_campaigns")
      .update({ status: newStatus })
      .eq("id", jobId);

    if (updateError) {
      console.error("Failed to update status:", updateError.message);
      return;
    }

    revalidatePath("/admin/jobs");
  }

  // 5. Server Action: Delete Job
  async function handleDeleteJob(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const jobId = formData.get("jobId") as string;

    const { error: deleteError } = await supabaseServer
      .from("hiring_campaigns")
      .delete()
      .eq("id", jobId);

    if (deleteError) {
      console.error("Failed to delete job:", deleteError.message);
      return;
    }

    revalidatePath("/admin/jobs");
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]">Active</Badge>;
      case 'draft':
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-white/5 text-[#E2D1FE]/60 border-white/10">Draft</Badge>;
      default:
        return <Badge variant="outline" className="capitalize px-3 py-1 font-bold backdrop-blur-md border bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]">Closed</Badge>;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10 px-4 sm:px-6">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
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
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* Create Job Form Card */}
        <Card className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards xl:col-span-1 h-fit bg-black/20 border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden flex flex-col sticky top-24">
          <CardHeader className="bg-black/10 border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Post New Job</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Add a new hiring opportunity for students.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 px-8 pb-8">
            <form action={handleCreateJob} className="space-y-6">
              
              <div className="space-y-2.5">
                <Label htmlFor="title" className="text-foreground font-bold ml-1">Role Title</Label>
                <Input 
                  id="title" 
                  name="title" 
                  placeholder="e.g., Frontend Developer" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="companyName" className="text-foreground font-bold ml-1">Company Name</Label>
                <Input 
                  id="companyName" 
                  name="companyName" 
                  placeholder="e.g., Google, Stripe" 
                  required 
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="applyUrl" className="text-foreground font-bold ml-1">Application URL</Label>
                <Input 
                  id="applyUrl" 
                  name="applyUrl" 
                  type="url"
                  placeholder="https://careers.company.com/..." 
                  required
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl h-12 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-foreground font-bold ml-1">Brief Description</Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  placeholder="Required skills, location, etc." 
                  required
                  className="bg-black/20 border-white/10 text-foreground placeholder:text-[#E2D1FE]/30 focus-visible:ring-accent focus-visible:border-accent rounded-xl min-h-[100px] backdrop-blur-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="startsAt" className="text-foreground font-bold ml-1">Start Date</Label>
                  <Input 
                    id="startsAt" 
                    name="startsAt" 
                    type="date" 
                    className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 text-xs backdrop-blur-sm cursor-pointer"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="endsAt" className="text-foreground font-bold ml-1">End Date</Label>
                  <Input 
                    id="endsAt" 
                    name="endsAt" 
                    type="date" 
                    className="bg-black/40 border-white/10 text-foreground focus-visible:ring-accent rounded-xl h-12 px-3 text-xs backdrop-blur-sm cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="status" className="text-foreground font-bold ml-1">Status</Label>
                <div className="relative">
                  <select 
                    id="status" 
                    name="status" 
                    defaultValue="draft"
                    className="flex h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent backdrop-blur-sm appearance-none cursor-pointer"
                  >
                    <option value="draft" className="bg-gray-900 text-white">Draft (Hidden)</option>
                    <option value="published" className="bg-gray-900 text-emerald-400">Published (Live)</option>
                    <option value="archived" className="bg-gray-900 text-red-400">Closed</option>
                  </select>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-4 rounded-xl bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" /> Launch Campaign
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Hiring Campaigns Table Card - 99% Transparent */}
        <Card className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards xl:col-span-2 bg-white/[0.01] border-white/5 backdrop-blur-sm shadow-none rounded-3xl overflow-hidden flex flex-col">
          <CardHeader className="bg-transparent border-b border-white/5 pt-8 px-8 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">Active & Past Campaigns</CardTitle>
            <CardDescription className="text-sm font-medium text-[#E2D1FE]/60 mt-1">
              Control visibility of hiring events across active cohorts.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader className="bg-transparent border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pl-8 py-4">Role & Company</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Status</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Timeline</TableHead>
                  <TableHead className="text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs py-4">Link</TableHead>
                  <TableHead className="text-right text-[#E2D1FE]/50 font-bold uppercase tracking-wider text-xs pr-8 py-4">Actions</TableHead>
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
                        <TableCell className="pl-8 py-4 align-top">
                          <div className="font-bold text-foreground drop-shadow-sm flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                              <Building className="w-4 h-4 text-accent" />
                            </div>
                            <div>
                              <span className="line-clamp-1 block">{job.title}</span>
                              <span className="text-xs font-semibold text-[#E2D1FE]/60 mt-0.5 block">{job.company_name}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          {getStatusBadge(job.status)}
                        </TableCell>
                        <TableCell className="py-4 align-top whitespace-nowrap">
                          <div className="text-xs font-medium text-[#E2D1FE]/70 space-y-1">
                            <div><span className="text-[#E2D1FE]/40">Start:</span> {job.starts_at ? new Date(job.starts_at).toLocaleDateString() : "Immediate"}</div>
                            <div><span className="text-[#E2D1FE]/40">End:</span> {job.ends_at ? new Date(job.ends_at).toLocaleDateString() : "TBD"}</div>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 align-top">
                          <Button variant="outline" size="sm" className="h-8 px-3 bg-white/5 border-white/10 text-foreground hover:bg-white/10 hover:text-white rounded-lg transition-all font-bold shadow-sm" asChild>
                            <Link href={job.apply_url} target="_blank">
                              Visit <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-accent" />
                            </Link>
                          </Button>
                        </TableCell>
                        <TableCell className="text-right pr-8 py-4 align-top">
                          <div className="flex justify-end gap-2 mt-0.5">
                            <form action={handleRotateStatus}>
                              <input type="hidden" name="jobId" value={job.id} />
                              <input type="hidden" name="currentStatus" value={job.status} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-[#E2D1FE]/70 hover:text-white hover:bg-white/10 rounded-xl transition-all font-bold" title="Click to rotate status">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </Button>
                            </form>
                            <form action={handleDeleteJob}>
                              <input type="hidden" name="jobId" value={job.id} />
                              <Button variant="ghost" size="sm" type="submit" className="h-9 px-3 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </form>
                          </div>
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
    </div>
  );
}
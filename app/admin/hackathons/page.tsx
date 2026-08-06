import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Rocket, Plus, Image as ImageIcon, Calendar } from "lucide-react";
import { createHackathon } from "@/app/actions/adminActions";

export default async function AdminHackathonsPage() {
  const supabase = await createClient();
  
  // Use "starts_at" instead of start_date to match your schema
  const { data: hackathons, error } = await supabase
    .from("hackathons")
    .select("*")
    .order("starts_at", { ascending: false });

  if (error) {
    // This will now print the actual helpful error if any occurs
    console.error("Supabase error fetching hackathons:", error.message);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <Rocket className="w-8 h-8 text-accent" />
            Manage Hackathons
          </h1>
          <p className="text-foreground/70 mt-1">Create and manage competitive coding events.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Hackathon Form */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Launch New Event</CardTitle>
            <CardDescription>Setup a new hackathon for the students.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createHackathon} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" name="title" placeholder="e.g., Summer Web3 Buildathon" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Brief Description</Label>
                <Textarea id="description" name="description" placeholder="What are we building?" required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startsAt">Starts At</Label>
                  <Input id="startsAt" name="startsAt" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endsAt">Ends At</Label>
                  <Input id="endsAt" name="endsAt" type="datetime-local" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bannerUrl">Banner URL (Optional)</Label>
                <Input id="bannerUrl" name="bannerUrl" placeholder="https://..." type="url" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Event Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-10 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="announced">Announced (Visible)</option>
                  <option value="open">Open (Live)</option>
                  <option value="judging">Judging</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <Button type="submit" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" /> Launch Event
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Existing Hackathons Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Event History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hackathons && hackathons.length > 0 ? (
                  hackathons.map((hackathon) => (
                    <TableRow key={hackathon.id}>
                      <TableCell className="font-medium text-primary">
                        <div className="flex items-center gap-2 mb-1">
                          {hackathon.banner_url ? <ImageIcon className="w-4 h-4 text-accent" /> : <Rocket className="w-4 h-4 text-foreground/50" />}
                          {hackathon.title}
                        </div>
                        <div className="text-foreground/60 text-xs font-normal">Slug: {hackathon.slug}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="w-3 h-3 text-foreground/50" />
                          {new Date(hackathon.starts_at).toLocaleDateString()} - {new Date(hackathon.ends_at).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          hackathon.status === 'open' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                          hackathon.status === 'completed' ? 'bg-gray-500/10' : ''
                        }>
                          {hackathon.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-foreground/50">
                      No events found. Start planning a hackathon!
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
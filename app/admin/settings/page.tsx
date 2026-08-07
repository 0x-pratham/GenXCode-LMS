import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Shield, Globe, Bell, Save } from "lucide-react";

export default function SettingsAdminPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
          <Settings className="w-8 h-8 text-accent" />
          System Settings
        </h1>
        <p className="text-foreground/70 mt-1">Configure platform rules, branding, and security parameters.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Navigation/Tabs Placeholder for larger settings pages */}
        <div className="md:col-span-1 space-y-2">
          <Button variant="secondary" className="w-full justify-start">
            <Globe className="w-4 h-4 mr-2" /> General
          </Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">
            <Shield className="w-4 h-4 mr-2" /> Security & Auth
          </Button>
          <Button variant="ghost" className="w-full justify-start text-foreground/70">
            <Bell className="w-4 h-4 mr-2" /> Notifications (SMTP)
          </Button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Branding</CardTitle>
              <CardDescription>Update the core identity of the LMS.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input id="platformName" defaultValue="GenXCode" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Contact Email</Label>
                <Input id="supportEmail" defaultValue="ofc.genxcode@gmail.com" type="email" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gamification Engine</CardTitle>
              <CardDescription>Configure XP rewards and leaderboard resets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseXp">Base XP (Lesson Completion)</Label>
                <Input id="baseXp" defaultValue="10" type="number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attendanceXp">Live Session XP (Per Min)</Label>
                <Input id="attendanceXp" defaultValue="2" type="number" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Save className="w-4 h-4 mr-2" /> Save Configurations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
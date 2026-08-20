import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Calendar, Code, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Suspense } from "react";

// Layout Imports
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import RoyalPurpleBackground from '@/components/RoyalPurpleBackground';
import { Sidebar } from "@/components/layout/Sidebar";

// Preview Component Import
import PublicHackathonsPreview from "@/components/hackathons/PublicHackathonsPreview";

// Optimized Parallel Data Fetcher for Logged-In Users
async function getHackathonsPortalData(userId: string) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch hackathons, profile (for sidebar), and user's registered teams CONCURRENTLY
  // RLS handles the visibility of hackathons based on status automatically[cite: 14].
  const [
    { data: hackathons, error: hackathonsError },
    { data: profile, error: profileError },
    { data: userTeams, error: teamsError }
  ] = await Promise.all([
    supabase.from("hackathons").select("*").order("starts_at", { ascending: true }),
    supabaseAdmin.from("profiles").select("role, must_change_password").eq("id", userId).single(),
    supabase.from("hackathon_teams").select("hackathon_id").or(`leader_id.eq.${userId},members.cs.{${userId}}`)
  ]);

  if (hackathonsError) console.error("Error fetching hackathons:", hackathonsError.message);
  if (profileError) console.error("Error fetching profile:", profileError.message);
  if (teamsError) console.error("Error fetching teams:", teamsError.message);

  const registeredHackathonIds = new Set(userTeams?.map(t => t.hackathon_id) || []);
  const userRole = profile?.role || "student";
  const mustChangePassword = profile?.must_change_password || false;

  return { hackathons: hackathons || [], registeredHackathonIds, userRole, mustChangePassword };
}

export default async function HackathonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // ==========================================
  // SCENARIO 1: PUBLIC USER (NOT LOGGED IN) -> Show Navbar, Footer & Preview
  // ==========================================
  if (!user) {
    // For public users, directly fetch hackathons (RLS allows anon to see published ones)[cite: 14]
    const { data: publicHackathons } = await supabase
      .from("hackathons")
      .select("*")
      .order("starts_at", { ascending: true });

    return (
      <div className="relative flex min-h-screen flex-col bg-transparent selection:bg-brand-gradient/30 selection:text-white">
        <RoyalPurpleBackground fixed={true} />
        <Navbar />
        <main className="flex-1 flex flex-col w-full relative z-10">
          <PublicHackathonsPreview hackathons={publicHackathons || []} />
        </main>
        <Footer />
      </div>
    );
  }

  // ==========================================
  // SCENARIO 2: AUTHENTICATED USER (PORTAL) -> Show Sidebar & Actionable Grid
  // ==========================================
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      
      {/* Global Portal Background Image */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/dashboardbg.jpg"
          alt="Portal Background"
          fill
          className="object-cover opacity-60 mix-blend-luminosity"
          priority
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg z-0" />
      </div>

      <Suspense fallback={<HackathonsSkeleton />}>
        <HackathonsContent userId={user.id} />
      </Suspense>

    </div>
  );
}

// Separated Content Component for Async Logic within Auth Portal
async function HackathonsContent({ userId }: { userId: string }) {
  const { hackathons, registeredHackathonIds, userRole, mustChangePassword } = await getHackathonsPortalData(userId);

  return (
    <div className="relative z-10 flex w-full">
      {/* Pass fetched props to the Sidebar */}
      <Sidebar userRole={userRole} mustChangePassword={mustChangePassword} />

      <div className="flex flex-col flex-1 md:pl-64 transition-all duration-300 min-h-screen">
        
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 surface-glass-panel px-4 md:hidden backdrop-blur-xl">
          <button className="text-[#E2D1FE] focus:outline-none hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-accent rounded">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span className="font-heading text-lg font-bold text-foreground">
            GenXCode
          </span>
        </header>

        <main className="flex-1 p-6 md:p-8 focus:outline-none" tabIndex={0}>
          <div className="space-y-10 max-w-7xl mx-auto pb-12 relative z-10">
            
            {/* Page Header with Entry Animation */}
            <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
                    <Code className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    Global <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Hackathons</span>
                  </div>
                </h1>
                <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
                  Form teams, build ambitious projects, and win massive XP rewards to dominate the league.
                </p>
              </div>
            </div>

            {/* Grid Layout for Real Data */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {hackathons && hackathons.length > 0 ? (
                hackathons.map((hackathon, index) => {
                  const isRegistered = registeredHackathonIds.has(hackathon.id);
                  const startDate = new Date(hackathon.starts_at).toLocaleDateString('en-US', { 
                    month: 'short', day: 'numeric', year: 'numeric' 
                  });

                  // UI Logic Mapped to Elite Glassmorphism Theme
                  let badgeClass = "uppercase text-xs font-bold px-3 py-1 rounded-full border ";
                  let buttonText = "View Event";
                  let buttonStyle = "bg-transparent border border-white/20 text-foreground hover:bg-white/10";
                  let buttonDisabled = false;

                  if (hackathon.status === "open") {
                    badgeClass += "border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
                    if (isRegistered) {
                      buttonText = "Go to Workspace";
                      buttonStyle = "bg-white/10 text-foreground border border-white/20 font-bold hover:bg-white/20";
                    } else {
                      buttonText = "Register Team";
                      buttonStyle = "bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover hover:brightness-110";
                    }
                  } else if (hackathon.status === "announced") {
                    badgeClass += "border-amber-500/30 text-amber-400 bg-amber-500/10";
                    buttonText = "Coming Soon";
                    buttonStyle = "bg-white/5 text-[#E2D1FE]/50 border-white/10 cursor-not-allowed hover:bg-white/5";
                    buttonDisabled = true;
                  } else if (hackathon.status === "completed") {
                    badgeClass += "border-white/20 text-[#E2D1FE]/70 bg-white/5";
                    buttonText = "View Winners";
                  } else if (hackathon.status === "judging") {
                    badgeClass += "border-accent/30 text-accent bg-accent/10";
                    buttonText = "Judging in Progress";
                    buttonStyle = "bg-white/5 text-[#E2D1FE]/50 border-white/10 cursor-not-allowed hover:bg-white/5";
                    buttonDisabled = true;
                  } else if (hackathon.status === "draft") {
                    // Admins viewing a draft
                    badgeClass += "border-white/20 text-[#E2D1FE]/50 bg-black/40";
                    buttonText = "View Draft";
                  }

                  const teamText = hackathon.team_min_size === hackathon.team_max_size
                    ? (hackathon.team_min_size === 1 ? "Individual" : `${hackathon.team_min_size} members`)
                    : `${hackathon.team_min_size}-${hackathon.team_max_size} members`;

                  const animationDelay = `${(index + 2) * 150}ms`;

                  return (
                    <Card 
                      key={hackathon.id} 
                      style={{ animationDelay }}
                      className={`animate-fade-in-up opacity-0 fill-mode-forwards backdrop-blur-xl flex flex-col overflow-hidden transition-all duration-300 rounded-3xl group ${
                        isRegistered 
                        ? "bg-black/40 border-accent/30 shadow-[0_0_20px_rgba(134,56,205,0.1)]" 
                        : "bg-black/20 border-white/10 hover:bg-white/[0.04] hover:border-white/20 hover:shadow-[0_8px_32px_rgba(134,56,205,0.15)]"
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start mb-3">
                          <Badge variant="outline" className={badgeClass}>
                            {hackathon.status}
                          </Badge>
                          <div className="flex items-center gap-1.5 text-sm font-bold text-accent bg-black/40 px-3 py-1.5 rounded-full border border-white/5 shadow-inner">
                            <Trophy className="w-4 h-4" /> Massive XP
                          </div>
                        </div>
                        <CardTitle className="text-2xl font-bold text-foreground drop-shadow-sm leading-snug transition-colors group-hover:text-accent">
                          {hackathon.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="flex-1 space-y-5">
                        <p className="text-base text-[#E2D1FE]/70 line-clamp-3 leading-relaxed">
                          {hackathon.description || "Compete with the best. Build something extraordinary."}
                        </p>
                        
                        <div className="space-y-3 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <Users className="w-4 h-4 text-accent" />
                            </div>
                            <span>{teamText}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-foreground bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4 text-accent" />
                            </div>
                            <span>Starts: {startDate}</span>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 pb-6 px-6">
                        {hackathon.status === "open" && !isRegistered ? (
                          <Button tabIndex={0} className={`w-full h-12 rounded-xl transition-all shadow-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${buttonStyle}`} asChild>
                            <Link href={`/hackathons/${hackathon.slug}/register`}>
                              {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        ) : (
                          <Button tabIndex={0} className={`w-full h-12 rounded-xl transition-all shadow-md focus-visible:ring-2 focus-visible:ring-accent ${buttonStyle}`} disabled={buttonDisabled} asChild={!buttonDisabled}>
                            {buttonDisabled ? (
                              <>
                                <Lock className="w-4 h-4 mr-2 opacity-50" />
                                {buttonText}
                              </>
                            ) : (
                              <Link href={`/hackathons/${hackathon.slug}`}>
                                {buttonText}
                                {isRegistered && <ArrowRight className="w-4 h-4 ml-2" />}
                              </Link>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards col-span-full py-20 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                    <Code className="w-10 h-10 text-[#E2D1FE]/30" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">No Events Available</h3>
                  <p className="text-[#E2D1FE]/60 text-base mt-2 max-w-md mx-auto">
                    Admins haven't published any hackathons yet. Sharpen your skills and check back soon for your chance to win XP!
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function HackathonsSkeleton() {
  return (
    <div className="relative z-10 flex w-full animate-pulse">
      {/* Fake Sidebar placeholder */}
      <div className="hidden md:block w-64 h-screen border-r border-white/10 bg-black/20"></div>
      
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="space-y-10 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-full shrink-0"></div>
              <div className="space-y-3">
                <div className="w-64 h-10 bg-white/10 rounded-lg"></div>
                <div className="w-96 h-4 bg-white/5 rounded"></div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-[400px] bg-black/20 border border-white/10 rounded-3xl p-6 flex flex-col">
                <div className="flex justify-between mb-6">
                  <div className="w-20 h-6 bg-white/10 rounded-full"></div>
                  <div className="w-24 h-6 bg-white/10 rounded-full"></div>
                </div>
                <div className="w-3/4 h-8 bg-white/10 rounded mb-4"></div>
                <div className="w-full h-16 bg-white/5 rounded mb-8"></div>
                <div className="w-full h-12 bg-white/5 rounded-xl mb-3"></div>
                <div className="w-full h-12 bg-white/5 rounded-xl mb-6"></div>
                <div className="w-full h-12 bg-white/10 rounded-xl mt-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
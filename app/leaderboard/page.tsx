import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Crown, Medal, Star, Loader2 } from "lucide-react";
import { Suspense } from "react";

// --- Layout Imports ---
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import RoyalPurpleBackground from '@/components/RoyalPurpleBackground';
import { Sidebar } from "@/components/layout/Sidebar";

// --- Component Import ---
import PublicLeaderboardPreview from "@/components/leaderboard/PublicLeaderboardPreview";

// Optimized Parallel Data Fetcher for the Leaderboard
async function getLeaderboardData() {
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Fetch all active profiles, memberships, and XP events CONCURRENTLY
  const [
    { data: profiles, error: profilesError },
    { data: memberships },
    { data: xpEvents }
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, full_name, email, avatar_url, role, must_change_password").eq("is_active", true),
    supabaseAdmin.from("league_memberships").select("user_id, league, xp_total"),
    supabaseAdmin.from("xp_events").select("user_id, amount")
  ]);

  if (profilesError) {
    console.error("Error fetching leaderboard profiles:", profilesError.message);
  }

  // Aggregate total XP from xp_events table fast using O(1) Map lookups
  const xpMap = new Map<string, number>();
  xpEvents?.forEach(ev => {
    const current = xpMap.get(ev.user_id) || 0;
    xpMap.set(ev.user_id, current + Number(ev.amount));
  });

  const membershipMap = new Map<string, { league: string; xp_total: number }>();
  memberships?.forEach(m => {
    membershipMap.set(m.user_id, { league: m.league, xp_total: m.xp_total });
  });

  // Combine and sort ALL active members by total XP descending
  const leaders = profiles?.map(profile => {
    const eventXp = xpMap.get(profile.id) || 0;
    const memberData = membershipMap.get(profile.id);
    const membershipXp = memberData?.xp_total || 0;

    // Favor real-time XP if it's higher than the snapshot in memberships table
    const finalXp = Math.max(eventXp, membershipXp);
    const league = memberData?.league || (finalXp > 500 ? 'code_champion' : finalXp > 200 ? 'code_builder' : 'code_starter');

    return {
      id: profile.id,
      full_name: profile.full_name || "Developer",
      email: profile.email,
      avatar_url: profile.avatar_url,
      xp_total: finalXp,
      league: league,
      role: profile.role,
      must_change_password: profile.must_change_password
    };
  }).sort((a, b) => b.xp_total - a.xp_total) || [];

  return leaders;
}

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is NOT logged in, show the Public Preview layout immediately (no suspense needed for public)
  if (!user) {
    const leaders = await getLeaderboardData();
    const topLeaders = leaders.map((l, index) => ({
      rank: index + 1,
      name: l.full_name,
      points: l.xp_total.toLocaleString(),
      level: l.league.replace('_', ' '),
      avatar_url: l.avatar_url,
    }));

    return (
      <div className="relative flex min-h-screen flex-col bg-transparent selection:bg-brand-gradient/30 selection:text-white">
        <RoyalPurpleBackground fixed={true} />
        <Navbar />
        <main className="flex-1 flex flex-col w-full relative z-10">
          <PublicLeaderboardPreview topEngineers={topLeaders} />
        </main>
        <Footer />
      </div>
    );
  }

  // ==========================================
  // AUTHENTICATED USER (PORTAL) -> Show Sidebar & Portal UI with Suspense
  // ==========================================
  
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      
      {/* Global Portal Background Image with Scrim Layer */}
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

      <Suspense fallback={<LeaderboardSkeleton />}>
        <LeaderboardContent userId={user.id} />
      </Suspense>

    </div>
  );
}

// Separated Content Component for Async Logic within Auth Portal
async function LeaderboardContent({ userId }: { userId: string }) {
  const leaders = await getLeaderboardData();

  // Extract logged-in user's data
  const currentUserProfile = leaders.find(p => p.id === userId);
  const userRole = currentUserProfile?.role || "student";
  const mustChangePassword = currentUserProfile?.must_change_password || false;

  const userIndex = leaders.findIndex(item => item.id === userId);
  const userRank = userIndex !== -1 ? userIndex + 1 : null;
  const loggedInUserData = userIndex !== -1 ? leaders[userIndex] : null;

  return (
    <div className="relative z-10 flex w-full">
      <Sidebar userRole={userRole} mustChangePassword={mustChangePassword} />

      <div className="flex flex-col flex-1 md:pl-64 transition-all duration-300 min-h-screen">
        
        {/* Mobile Header */}
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 surface-glass-panel px-4 md:hidden backdrop-blur-xl">
          <button className="text-[#E2D1FE] focus:outline-none hover:text-white transition-colors">
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
          <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
            
            {/* Cinematic Header */}
            <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground drop-shadow-lg flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center backdrop-blur-md shadow-lg shrink-0">
                    <Trophy className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    Global <span className="text-transparent bg-clip-text bg-silver-gradient drop-shadow-md">Leaderboard</span>
                  </div>
                </h1>
                <p className="text-[#E2D1FE]/80 mt-4 text-lg font-medium drop-shadow-md max-w-xl">
                  Top developers ranked by total XP earned across all leagues and quests.
                </p>
              </div>

              {/* LOGGED-IN USER STANDING HIGHLIGHT CARD */}
              {loggedInUserData && userRank && (
                <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards bg-accent/10 border border-accent/30 rounded-3xl p-5 backdrop-blur-xl shadow-[0_0_30px_rgba(134,56,205,0.2)] flex items-center gap-5 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-heading font-bold text-xl shadow-inner">
                    #{userRank}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest font-bold text-[#E2D1FE]/60 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 text-accent fill-accent" /> Your Global Standing
                    </div>
                    <div className="font-heading text-lg font-bold text-foreground mt-0.5">
                      {loggedInUserData.xp_total.toLocaleString()} XP <span className="text-xs font-normal text-accent capitalize">({loggedInUserData.league.replace('_', ' ')})</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="w-full">
              {/* Table Header */}
              <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards hidden md:flex items-center px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#E2D1FE]/50 mb-3 border-b border-white/5">
                <div className="w-20 text-center">Rank</div>
                <div className="flex-1 pl-4">Developer</div>
                <div className="w-40 text-center">League</div>
                <div className="w-32 text-right pr-2">Total XP</div>
              </div>

              {/* Leaderboard Rows */}
              <div className="space-y-3">
                {leaders.length > 0 ? (
                  leaders.map((item, index) => {
                    const rank = index + 1;
                    const leagueName = item.league ? item.league.replace('_', ' ') : "Code Starter";
                    const animationDelay = `${(index + 3) * 100}ms`;
                    const isCurrentUser = item.id === userId;

                    const isFirst = rank === 1;
                    const isSecond = rank === 2;
                    const isThird = rank === 3;

                    let rowBaseClass = "bg-black/20 border-white/5 text-foreground hover:bg-white/[0.04] hover:border-white/20";
                    let rankElement = <span className="font-heading text-xl font-bold text-[#E2D1FE]/60">#{rank}</span>;

                    if (isFirst) {
                      rowBaseClass = "bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:bg-yellow-500/20";
                      rankElement = <Crown className="w-7 h-7 text-yellow-400 drop-shadow-md mx-auto" />;
                    } else if (isSecond) {
                      rowBaseClass = "bg-slate-300/10 border-slate-300/30 shadow-[0_0_15px_rgba(203,213,225,0.05)] hover:bg-slate-300/20";
                      rankElement = <Medal className="w-7 h-7 text-slate-300 drop-shadow-md mx-auto" />;
                    } else if (isThird) {
                      rowBaseClass = "bg-amber-600/10 border-amber-600/30 shadow-[0_0_15px_rgba(217,119,6,0.05)] hover:bg-amber-600/20";
                      rankElement = <Medal className="w-7 h-7 text-amber-500 drop-shadow-md mx-auto" />;
                    }

                    if (isCurrentUser && !isFirst && !isSecond && !isThird) {
                      rowBaseClass = "bg-accent/10 border-accent/30 shadow-[0_0_20px_rgba(134,56,205,0.15)] hover:bg-accent/20";
                    }

                    return (
                      <div 
                        key={item.id} 
                        style={{ animationDelay }}
                        tabIndex={0}
                        className={`animate-fade-in-up opacity-0 fill-mode-forwards flex flex-col md:flex-row items-center p-4 md:px-6 md:py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${rowBaseClass}`}
                      >
                        <div className="w-full md:w-20 flex justify-center mb-3 md:mb-0 shrink-0">
                          {rankElement}
                        </div>
                        <div className="flex-1 flex items-center gap-4 w-full justify-center md:justify-start mb-4 md:mb-0 pl-0 md:pl-4">
                          <Avatar className={`w-12 h-12 border-2 ${isFirst ? 'border-yellow-400/50' : isSecond ? 'border-slate-300/50' : isThird ? 'border-amber-500/50' : isCurrentUser ? 'border-accent shadow-[0_0_10px_rgba(134,56,205,0.5)]' : 'border-white/10 shadow-inner'}`}>
                            <AvatarImage src={item.avatar_url || ""} />
                            <AvatarFallback className="bg-white/5 text-foreground font-bold">
                              {item.full_name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-center md:text-left">
                            <div className="font-bold text-foreground text-lg truncate max-w-[200px] sm:max-w-xs flex items-center justify-center md:justify-start gap-2">
                              {item.full_name} 
                              {isCurrentUser && <span className="text-[10px] uppercase bg-accent/20 text-accent font-extrabold px-2 py-0.5 rounded-full border border-accent/30">You</span>}
                            </div>
                            <div className="text-xs font-medium text-[#E2D1FE]/50 truncate max-w-[200px] sm:max-w-xs">{item.email}</div>
                          </div>
                        </div>
                        <div className="w-full md:w-40 flex justify-center mb-4 md:mb-0 shrink-0">
                          <Badge variant="outline" className={`capitalize px-3 py-1 font-bold ${
                            isFirst ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' : 
                            isSecond ? 'border-slate-400/40 text-slate-300 bg-slate-400/10' : 
                            isThird ? 'border-amber-600/40 text-amber-500 bg-amber-600/10' : 
                            isCurrentUser ? 'border-accent/40 text-accent bg-accent/10' :
                            'border-white/20 text-[#E2D1FE] bg-white/5'
                          }`}>
                            {leagueName}
                          </Badge>
                        </div>
                        <div className="w-full md:w-32 flex justify-center md:justify-end shrink-0 pr-0 md:pr-2">
                          <span className={`inline-flex items-center gap-1.5 font-heading text-xl font-bold ${
                            isFirst ? 'text-yellow-400' : 
                            isSecond ? 'text-slate-300' : 
                            isThird ? 'text-amber-500' : 
                            'text-accent'
                          }`}>
                            <Flame className={`w-5 h-5 ${
                              isFirst ? 'text-yellow-500 fill-yellow-500/20' : 
                              isSecond ? 'text-slate-400 fill-slate-400/20' : 
                              isThird ? 'text-amber-600 fill-amber-600/20' : 
                              'fill-accent/20'
                            }`} /> 
                            {item.xp_total.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="animate-fade-in-up [animation-delay:300ms] opacity-0 fill-mode-forwards py-16 text-center border border-dashed border-white/20 rounded-3xl bg-black/20 backdrop-blur-md">
                    <Trophy className="w-12 h-12 text-[#E2D1FE]/30 mx-auto mb-4" />
                    <h3 className="font-heading text-xl font-bold text-foreground">No Rankings Available</h3>
                    <p className="text-[#E2D1FE]/60 text-sm mt-2 max-w-sm mx-auto">Complete quests and masterclasses to populate the board!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

// Shimmering Lazy Loading Skeleton for Instant User Feedback
function LeaderboardSkeleton() {
  return (
    <div className="relative z-10 flex w-full animate-pulse">
      {/* Fake Sidebar placeholder */}
      <div className="hidden md:block w-64 h-screen border-r border-white/10 bg-black/20"></div>
      
      <div className="flex flex-col flex-1 p-6 md:p-8">
        <div className="space-y-10 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-4">
              <div className="w-64 h-12 bg-white/10 rounded-lg"></div>
              <div className="w-96 h-4 bg-white/5 rounded"></div>
            </div>
            <div className="w-64 h-24 bg-white/10 rounded-3xl"></div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-24 bg-white/5 border border-white/10 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
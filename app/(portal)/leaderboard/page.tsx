import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Crown, Medal } from "lucide-react";

export default async function LeaderboardPage() {
  const supabase = await createClient();

  // 1. Safe Auth Check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Backend Logic Remains Unchanged (Fetch Profiles & XP)
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      avatar_url,
      league_memberships (
        xp_total,
        league
      )
    `)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching leaderboard profiles:", error.message);
  }

  // Flatten and sort users by total XP descending
  const leaders = profiles?.map(profile => {
    const membership = profile.league_memberships?.[0] || { xp_total: 0, league: 'code_starter' };
    return {
      id: profile.id,
      full_name: profile.full_name || "Developer",
      email: profile.email,
      avatar_url: profile.avatar_url,
      xp_total: membership.xp_total || 0,
      league: membership.league || 'code_starter',
    };
  }).sort((a, b) => b.xp_total - a.xp_total) || [];

  return (
    // FIXED: Changed to max-w-7xl and added responsive px-4 sm:px-6 for perfect margins
    <div className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 pb-12 relative z-10">
      
      {/* Cinematic Header with Entry Animation */}
      <div className="animate-fade-in-up [animation-delay:100ms] opacity-0 fill-mode-forwards mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
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
      </div>

      <div className="w-full">
        {/* Table Header (Visually distinct from rows) */}
        <div className="animate-fade-in-up [animation-delay:200ms] opacity-0 fill-mode-forwards hidden md:flex items-center px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#E2D1FE]/50 mb-3 border-b border-white/5">
          <div className="w-20 text-center">Rank</div>
          <div className="flex-1 pl-4">Developer</div>
          <div className="w-40 text-center">League</div>
          <div className="w-32 text-right pr-2">Total XP</div>
        </div>

        {/* Leaderboard Rows */}
        <div className="space-y-3">
          {leaders && leaders.length > 0 ? (
            leaders.map((item, index) => {
              const rank = index + 1;
              const leagueName = item.league ? item.league.replace('_', ' ') : "Code Starter";
              const animationDelay = `${(index + 3) * 100}ms`;

              // Special logic for Top 3 styling
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

              return (
                <div 
                  key={item.id} 
                  style={{ animationDelay }}
                  className={`animate-fade-in-up opacity-0 fill-mode-forwards flex flex-col md:flex-row items-center p-4 md:px-6 md:py-4 rounded-2xl border backdrop-blur-xl transition-all duration-300 group ${rowBaseClass}`}
                >
                  {/* Rank */}
                  <div className="w-full md:w-20 flex justify-center mb-3 md:mb-0 shrink-0">
                    {rankElement}
                  </div>
                  
                  {/* Developer Profile */}
                  <div className="flex-1 flex items-center gap-4 w-full justify-center md:justify-start mb-4 md:mb-0 pl-0 md:pl-4">
                    <Avatar className={`w-12 h-12 border-2 ${isFirst ? 'border-yellow-400/50' : isSecond ? 'border-slate-300/50' : isThird ? 'border-amber-500/50' : 'border-white/10 shadow-inner'}`}>
                      <AvatarImage src={item.avatar_url || ""} />
                      <AvatarFallback className="bg-white/5 text-foreground font-bold">
                        {item.full_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center md:text-left">
                      <div className="font-bold text-foreground text-lg truncate max-w-[200px] sm:max-w-xs">{item.full_name}</div>
                      <div className="text-xs font-medium text-[#E2D1FE]/50 truncate max-w-[200px] sm:max-w-xs">{item.email}</div>
                    </div>
                  </div>
                  
                  {/* League Badge */}
                  <div className="w-full md:w-40 flex justify-center mb-4 md:mb-0 shrink-0">
                    <Badge variant="outline" className={`capitalize px-3 py-1 font-bold ${
                      isFirst ? 'border-yellow-500/40 text-yellow-400 bg-yellow-500/10' : 
                      isSecond ? 'border-slate-400/40 text-slate-300 bg-slate-400/10' : 
                      isThird ? 'border-amber-600/40 text-amber-500 bg-amber-600/10' : 
                      'border-white/20 text-[#E2D1FE] bg-white/5'
                    }`}>
                      {leagueName}
                    </Badge>
                  </div>
                  
                  {/* Total XP */}
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
  );
}
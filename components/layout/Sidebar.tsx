"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { portalLinks } from "@/config/portal";
import { cn } from "@/utils/cn";
import { Shield, LogOut } from "lucide-react";
import { logoutUser } from "@/app/actions/authActions"; // FIXED: Changed logout to logoutUser

interface SidebarProps {
  userRole?: string;
  mustChangePassword?: boolean; // Prop received from Layout
}

export function Sidebar({
  userRole = "student",
  mustChangePassword = false,
}: SidebarProps) {
  const pathname = usePathname();
  const isAdmin = userRole === "admin" || userRole === "super_admin";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-transparent transition-transform md:translate-x-0 -translate-x-full">

      {/* Transparent Logo & Brand Area */}
      <div className="flex flex-col h-24 justify-center px-6 mt-2">
        <Link href="/dashboard" className="flex flex-col group">
          <span className="font-heading text-3xl font-bold text-transparent bg-clip-text bg-silver-gradient drop-shadow-md transition-all group-hover:brightness-110">
            {brandConfig.name}
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#E2D1FE]/40 font-bold ml-1 mt-0.5">
            Student Portal
          </span>
        </Link>
      </div>

      {/* Navigation - 99% Transparent Glass Effects */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-1.5 px-4">
          {portalLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            // Check if this is the Profile/Settings link
            const isProfileItem = item.href.includes("profile");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 border",
                    active
                      ? "bg-white/[0.04] border-white/10 text-foreground backdrop-blur-md shadow-sm"
                      : "border-transparent bg-transparent text-[#E2D1FE]/70 hover:bg-white/[0.02] hover:border-white/5 hover:text-foreground hover:backdrop-blur-sm",
                    // Add amber border glow if action is required
                    isProfileItem && mustChangePassword && "border-amber-500/50 bg-amber-500/10 text-amber-300 hover:text-amber-200"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-[18px] w-[18px]" />
                    {item.title}
                  </div>
                  {/* Blinking Dot for Action Required */}
                  {isProfileItem && mustChangePassword && (
                    <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                  )}
                </Link>
              </li>
            );
          })}

          {isAdmin && (
            <>
              <li className="my-4 border-t border-white/5 mx-2" />
              <li>
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 border",
                    pathname.startsWith("/admin")
                      ? "bg-accent/10 border-accent/20 text-accent backdrop-blur-md shadow-sm"
                      : "border-transparent bg-transparent text-accent/70 hover:bg-accent/[0.05] hover:border-accent/10 hover:text-accent hover:backdrop-blur-sm"
                  )}
                >
                  <Shield className="h-[18px] w-[18px]" />
                  Admin Panel
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mb-2">
        <form action={logoutUser}> {/* FIXED: Changed logout to logoutUser */}
          <button 
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-red-400/70 transition-all duration-300 border border-transparent hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 hover:backdrop-blur-sm"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
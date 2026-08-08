"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { adminNavGroups } from "@/config/admin";
import { cn } from "@/utils/cn";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/5 bg-transparent transition-transform md:translate-x-0 -translate-x-full">
      
      {/* Transparent Brand Header */}
      <div className="flex flex-col h-24 justify-center px-6 mt-2">
        <Link
          href="/admin/dashboard"
          className="flex flex-col group"
        >
          {/* Silver Gradient Heading */}
          <span className="font-heading text-2xl font-bold text-transparent bg-clip-text bg-silver-gradient drop-shadow-md transition-all group-hover:brightness-110">
            {brandConfig.shortName} Admin
          </span>
          {/* Tiny Subtext */}
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#E2D1FE]/40 font-bold ml-1 mt-0.5 flex items-center gap-1.5">
            <ShieldAlert className="w-3 h-3 text-accent inline" /> Control Center
          </span>
        </Link>
      </div>

      {/* Navigation Links (Grouped) - 99% Transparent Glass Effects */}
      <nav className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <div className="px-4 space-y-6">
          {adminNavGroups.map((group, index) => (
            <div key={index}>
              {/* Category Header */}
              {group.label !== "Overview" && (
                <h4 className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#E2D1FE]/40">
                  {group.label}
                </h4>
              )}
              
              {/* Links under category */}
              <ul className="grid gap-1.5">
                {group.items.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 border",
                          isActive
                            ? "bg-white/[0.04] border-white/10 text-foreground backdrop-blur-md shadow-sm"
                            : "border-transparent bg-transparent text-[#E2D1FE]/70 hover:bg-white/[0.02] hover:border-white/5 hover:text-foreground hover:backdrop-blur-sm"
                        )}
                      >
                        <Icon className="h-[18px] w-[18px]" />
                        {link.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Admin Info & Return to Portal Footer */}
      <div className="p-4 mb-2 space-y-3 border-t border-white/5 mx-2">
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold shadow-inner">
            A
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-foreground drop-shadow-sm truncate">Admin User</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-accent">Super Admin</span>
          </div>
        </div>
        
        <Link 
          href="/dashboard" 
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-[#E2D1FE] bg-white/[0.02] border border-white/5 transition-all duration-300 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 hover:backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Portal
        </Link>
      </div>
    </aside>
  );
}
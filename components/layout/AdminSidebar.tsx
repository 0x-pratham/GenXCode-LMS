"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { adminNavGroups } from "@/config/admin";
import { cn } from "@/utils/cn";
import { ShieldAlert } from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-secondary text-secondary-foreground transition-transform md:translate-x-0 -translate-x-full">
      {/* Admin Brand Header */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-secondary-foreground/10 px-6 bg-primary">
        <ShieldAlert className="w-5 h-5 text-accent" />
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="font-heading text-lg font-bold tracking-tight text-white">
            {brandConfig.shortName} Admin
          </span>
        </Link>
      </div>

      {/* Navigation Links (Grouped) */}
      <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
        <div className="px-3 space-y-6">
          {adminNavGroups.map((group, index) => (
            <div key={index}>
              {/* Category Header */}
              {group.label !== "Overview" && (
                <h4 className="mb-2 px-4 text-xs font-bold uppercase tracking-wider text-secondary-foreground/50">
                  {group.label}
                </h4>
              )}
              
              {/* Links under category */}
              <ul className="grid gap-1">
                {group.items.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.icon;

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-accent text-accent-foreground shadow-sm"
                            : "text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-white"
                        )}
                      >
                        <Icon className="h-4 w-4" />
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

      {/* Admin Info & Return to Portal */}
      <div className="border-t border-secondary-foreground/10 p-4 bg-primary/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">Admin User</span>
            <span className="text-xs text-white/50">Super Admin</span>
          </div>
        </div>
        <Link 
          href="/dashboard" 
          className="flex w-full items-center justify-center gap-2 rounded-md px-3 py-2.5 text-sm font-bold text-white bg-secondary-foreground/10 transition-colors hover:bg-red-500/20 hover:text-red-400"
        >
          Return to Portal
        </Link>
      </div>
    </aside>
  );
}
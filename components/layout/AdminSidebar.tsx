"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { adminLinks } from "@/config/admin";
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

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="grid gap-1 px-4">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground"
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
      </nav>

      {/* Admin Info (Bottom) */}
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
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-400/10">
          Return to Portal
        </button>
      </div>
    </aside>
  );
}
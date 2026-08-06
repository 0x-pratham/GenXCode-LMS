"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { portalLinks } from "@/config/portal";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform md:translate-x-0 -translate-x-full">
      {/* Brand Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-heading text-xl font-bold tracking-tight text-primary">
            {brandConfig.name}
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="grid gap-1 px-4">
          {portalLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-surface hover:text-primary"
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

      {/* User Quick Actions (Bottom) */}
      <div className="border-t border-border p-4">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
          </svg>
          Log out
        </button>
      </div>
    </aside>
  );
}
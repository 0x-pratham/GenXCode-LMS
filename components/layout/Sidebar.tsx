"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { brandConfig } from "@/config/brand";
import { portalLinks } from "@/config/portal";
import { cn } from "@/utils/cn";

import {
  Shield,
  LogOut,
} from "lucide-react";

// 1. Apne logout action ko import karo
import { logout } from "@/app/actions/authActions"; 

interface SidebarProps {
  userRole?: string;
}

export function Sidebar({
  userRole = "student",
}: SidebarProps) {
  const pathname = usePathname();

  const isAdmin =
    userRole === "admin" ||
    userRole === "super_admin";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background transition-transform md:translate-x-0 -translate-x-full">

      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
        >
          <span className="font-heading text-xl font-bold text-primary">
            {brandConfig.name}
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-4">
          {portalLinks.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:bg-surface hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              </li>
            );
          })}

          {isAdmin && (
            <>
              <li className="my-3 border-t border-border" />
              <li>
                <Link
                  href="/admin/dashboard"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                    pathname.startsWith("/admin")
                      ? "bg-purple-600 text-white"
                      : "text-purple-500 hover:bg-purple-500/10"
                  )}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        {/* 2. Button ko form tag aur action={logout} se wrap kardo */}
        <form action={logout}>
          <button 
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
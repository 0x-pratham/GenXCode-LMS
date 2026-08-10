"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { brandConfig } from "@/config/brand";
import { publicNavLinks, authLinks } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/utils/cn";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Turn the bar into a solid glass capsule once the page scrolls,
  // so nav items stay legible over any hero content
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape to close + lock body scroll while the mobile menu is open
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none">
      {/* Dimming backdrop behind the mobile menu — click outside to close */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden pointer-events-auto"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        Outer Container: transparent at rest, resolves into a glass capsule
        once the page is scrolled — keeps the "floating over content" feel
        without sacrificing legibility.
      */}
      <div
        className={cn(
          "relative z-50 flex w-full max-w-6xl items-center justify-between h-16 pointer-events-auto rounded-full border transition-all duration-500 ease-out px-2",
          isScrolled
            ? "surface-glass-nav border-white/10 shadow-2xl shadow-black/20"
            : "border-transparent"
        )}
      >
        {/* 1. Left: Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center space-x-3 rounded-full border border-transparent px-3 py-2 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
            <Image
              src="/logo/logo.svg"
              alt={`${brandConfig.name} Logo`}
              width={32}
              height={32}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-heading text-xl tracking-tight hidden sm:block bg-silver-gradient bg-clip-text text-transparent">
            {brandConfig.name}
          </span>
        </Link>

        {/* 2. Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-white/[0.06] border-white/10 text-foreground shadow-sm"
                    : "border-transparent bg-transparent text-[#E2D1FE]/80 hover:bg-white/[0.03] hover:border-white/10 hover:text-foreground"
                )}
              >
                {link.title}
                <span
                  className={cn(
                    "absolute left-1/2 -bottom-1.5 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300",
                    isActive ? "opacity-100 accent-glow" : "opacity-0 group-hover:opacity-40"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* 3. Right: CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href={authLinks.login}>
            <Button
              variant="ghost"
              className="rounded-full px-5 text-[#E2D1FE] hover:text-foreground"
            >
              Sign In
            </Button>
          </Link>
          <Link href={authLinks.requestInvite}>
            <Button variant="premium" className="rounded-full px-6 accent-glow-hover">
              Request Invite
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="flex md:hidden p-2.5 text-[#E2D1FE] hover:text-foreground transition-all duration-300 rounded-full border border-transparent hover:bg-white/[0.04] hover:border-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden w-full max-w-6xl mt-3 overflow-hidden transition-all duration-300 ease-in-out rounded-3xl pointer-events-auto relative z-50",
          isMobileMenuOpen
            ? "max-h-[420px] opacity-100 surface-glass-panel border border-white/10 shadow-2xl"
            : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="flex flex-col px-6 py-6 space-y-2">
          {publicNavLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                style={isMobileMenuOpen ? { animationDelay: `${i * 50}ms` } : undefined}
                className={cn(
                  "text-base font-medium transition-colors px-4 py-2.5 rounded-xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]",
                  isActive
                    ? "bg-white/[0.06] border-white/10 text-foreground"
                    : "border-transparent bg-transparent text-[#E2D1FE]/72 hover:bg-white/[0.03] hover:text-foreground hover:border-white/10",
                  isMobileMenuOpen && "opacity-0 animate-fade-in-up"
                )}
              >
                {link.title}
              </Link>
            );
          })}
          <div className="h-px w-full bg-white/5 my-2" />
          <div className="flex flex-col gap-3 pt-2">
            <Link href={authLinks.login} className="w-full">
              <Button variant="outline" className="w-full justify-center rounded-full">
                Sign In
              </Button>
            </Link>
            <Link href={authLinks.requestInvite} className="w-full">
              <Button variant="premium" className="w-full justify-center rounded-full">
                Request Invite
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
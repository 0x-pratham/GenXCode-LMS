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

  // Turn the bar into a solid deep-glass capsule once the page scrolls
  React.useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 15);
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
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md md:hidden pointer-events-auto transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/*
        Outer Container: Premium ultra-glass capsule on scroll.
        Height increased slightly to accommodate larger logo.
      */}
      <div
        className={cn(
          "relative z-50 flex w-full max-w-6xl items-center justify-between h-[72px] pointer-events-auto rounded-full transition-all duration-500 ease-out px-3",
          isScrolled
            ? "bg-[#0C0224]/50 backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
            : "bg-transparent border border-transparent"
        )}
      >
        {/* 1. Left: Brand / Logo (Capsule hover effect removed, pure logo pop) */}
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(134,56,205,0.6)]">
            <Image
              src="/logo/logo.svg"
              alt={`${brandConfig.name} Logo`}
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <span className="font-heading text-2xl tracking-tight hidden sm:block bg-silver-gradient bg-clip-text text-transparent drop-shadow-md">
            {brandConfig.name}
          </span>
        </Link>

        {/* 2. Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "bg-white/[0.08] border-white/15 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    : "border-transparent bg-transparent text-[#E2D1FE]/80 hover:bg-white/[0.04] hover:border-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(134,56,205,0.2)]"
                )}
              >
                {link.title}
                {/* Active/Hover Dot Indicator */}
                <span
                  className={cn(
                    "absolute left-1/2 -bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-accent transition-all duration-300",
                    isActive ? "opacity-100 accent-glow shadow-[0_0_8px_#8638CD]" : "opacity-0 group-hover:opacity-50"
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* 3. Right: CTA Buttons */}
        <div className="hidden md:flex items-center gap-3 pr-2">
          <Link href={authLinks.login}>
            <Button
              variant="ghost"
              className="rounded-full px-5 font-medium text-[#E2D1FE] transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href={authLinks.requestInvite}>
            {/* Removed the excessive glow shadows */}
            <Button 
              variant="premium" 
              className="rounded-full px-6 font-bold transition-all duration-300 hover:-translate-y-0.5"
            >
              Request Invite
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          className="flex md:hidden p-2.5 mr-2 text-[#E2D1FE] hover:text-white transition-all duration-300 rounded-full border border-transparent hover:bg-white/[0.06] hover:border-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown (Premium Glass Panel) */}
      <div
        id="mobile-menu"
        className={cn(
          "md:hidden w-full max-w-6xl mt-4 overflow-hidden transition-all duration-500 ease-in-out rounded-3xl pointer-events-auto relative z-50",
          isMobileMenuOpen
            ? "max-h-[500px] opacity-100 bg-[#0C0224]/70 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.7)]"
            : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="flex flex-col px-6 py-8 space-y-2">
          {publicNavLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                style={isMobileMenuOpen ? { animationDelay: `${i * 60}ms` } : undefined}
                className={cn(
                  "text-lg font-semibold tracking-wide transition-all duration-300 px-5 py-3 rounded-2xl border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]",
                  isActive
                    ? "bg-white/[0.08] border-white/15 text-white shadow-sm"
                    : "border-transparent bg-transparent text-[#E2D1FE]/72 hover:bg-white/[0.04] hover:text-white hover:border-white/10",
                  isMobileMenuOpen && "opacity-0 animate-fade-in-right fill-mode-forwards"
                )}
              >
                {link.title}
              </Link>
            );
          })}
          
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />
          
          <div className="flex flex-col gap-3 pt-2">
            <Link href={authLinks.login} className="w-full">
              <Button variant="outline" className="w-full justify-center rounded-2xl h-12 text-base font-medium border-white/10 hover:bg-white/5 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link href={authLinks.requestInvite} className="w-full">
              {/* Removed the excessive glow shadow here as well */}
              <Button variant="premium" className="w-full justify-center rounded-2xl h-12 text-base font-bold">
                Request Invite
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
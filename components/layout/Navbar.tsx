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
  const pathname = usePathname();

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex flex-col items-center px-4 sm:px-6 pointer-events-none">
      
      {/* 
        Outer Container: Completely Transparent, NO Background, NO Border.
        pointer-events-auto ensures clicks still register on the items inside.
      */}
      <div className="relative flex w-full max-w-6xl items-center justify-between h-16 pointer-events-auto">
        
        {/* 1. Left: Brand / Logo - 99% transparent glass on hover */}
        <Link 
          href="/" 
          className="group flex items-center space-x-3 transition-all duration-300 px-3 py-2 rounded-full border border-transparent hover:bg-white/[0.02] hover:border-white/5 hover:backdrop-blur-sm"
        >
          <div className="relative flex h-8 w-8 items-center justify-center overflow-hidden transition-all duration-300">
            <Image 
              src="/logo/logo.svg" 
              alt={`${brandConfig.name} Logo`} 
              width={32} 
              height={32} 
              className="object-contain transition-transform duration-300 group-hover:scale-110"
              priority
            />
          </div>
          <span className="font-heading text-xl tracking-tight text-foreground hidden sm:block">
            {brandConfig.name}
          </span>
        </Link>
        
        {/* 2. Center: Desktop Navigation with 99% transparent individual glass effects */}
        <nav className="hidden md:flex items-center gap-1">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border",
                  isActive 
                    ? "bg-white/[0.04] border-white/10 text-foreground backdrop-blur-md shadow-sm" // Active state slightly visible
                    : "border-transparent bg-transparent text-[#E2D1FE]/80 hover:bg-white/[0.02] hover:border-white/5 hover:text-foreground hover:backdrop-blur-sm"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right: CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Link href={authLinks.login}>
            <Button 
              variant="ghost" 
              className="text-[#E2D1FE] hover:text-foreground transition-all duration-300 rounded-full px-5 border border-transparent hover:bg-white/[0.02] hover:border-white/5 hover:backdrop-blur-sm"
            >
              Sign In
            </Button>
          </Link>
          <Link href={authLinks.requestInvite}>
            <Button 
              className="bg-brand-gradient text-foreground border-none font-bold accent-glow accent-glow-hover transition-all duration-300 hover:brightness-110 hover:-translate-y-[1px] rounded-full px-6"
            >
              Request Invite
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="flex md:hidden p-2.5 text-[#E2D1FE] hover:text-foreground transition-all duration-300 rounded-full border border-transparent hover:bg-white/[0.02] hover:border-white/5 hover:backdrop-blur-sm active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown (Kept glass panel so it's readable over content) */}
      <div 
        className={cn(
          "md:hidden w-full max-w-6xl mt-3 overflow-hidden transition-all duration-300 ease-in-out rounded-3xl pointer-events-auto",
          isMobileMenuOpen 
            ? "max-h-[400px] opacity-100 surface-glass-panel border border-white/10 shadow-2xl" 
            : "max-h-0 opacity-0 border-transparent"
        )}
      >
        <nav className="flex flex-col px-6 py-6 space-y-4">
          {publicNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-base font-medium transition-colors px-4 py-2 rounded-xl border",
                  isActive 
                    ? "bg-white/[0.04] border-white/10 text-foreground" 
                    : "border-transparent bg-transparent text-[#E2D1FE]/72 hover:bg-white/[0.02] hover:text-foreground hover:border-white/5"
                )}
              >
                {link.title}
              </Link>
            );
          })}
          <div className="h-px w-full bg-white/5 my-2" />
          <div className="flex flex-col gap-3 pt-2">
            <Link href={authLinks.login} className="w-full">
              <Button className="w-full justify-center bg-transparent text-foreground hover:bg-white/[0.02] transition-all rounded-full border border-white/5">
                Sign In
              </Button>
            </Link>
            <Link href={authLinks.requestInvite} className="w-full">
              <Button className="w-full justify-center bg-brand-gradient text-foreground border-none accent-glow transition-all rounded-full">
                Request Invite
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
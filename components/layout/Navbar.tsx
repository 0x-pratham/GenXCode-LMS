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

  // Close mobile menu automatically on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand / Logo Section */}
        <div className="flex items-center gap-8 md:gap-12">
          <Link 
            href="/" 
            className="group flex items-center space-x-3 transition-transform duration-300 hover:scale-[1.02]"
          >
            {/* Custom Logo Image with subtle hover effect */}
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-surface/50 shadow-sm ring-1 ring-border/50 transition-all group-hover:shadow-md group-hover:ring-accent/40">
              <Image 
                src="/logo/logo.png" 
                alt={`${brandConfig.name} Logo`} 
                width={40} 
                height={40} 
                className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tighter text-primary">
              {brandConfig.name}
            </span>
          </Link>
          
          {/* Desktop Navigation (Config Driven) */}
          <nav className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group relative py-2 text-sm font-semibold transition-colors"
                >
                  <span className={cn(
                    "relative z-10 transition-colors duration-200",
                    isActive ? "text-accent" : "text-foreground/70 group-hover:text-primary"
                  )}>
                    {link.title}
                  </span>
                  
                  {/* Sleek Animated Underline */}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-0 h-[2px] rounded-full bg-accent transition-all duration-300 ease-out",
                      isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-5">
          <Link href={authLinks.login}>
            <Button 
              variant="ghost" 
              className="font-semibold text-foreground/80 hover:text-primary hover:bg-surface/80 transition-all duration-200"
            >
              Sign In
            </Button>
          </Link>
          <Link href={authLinks.requestInvite}>
            {/* Premium Glow Button Effect */}
            <Button 
              className="relative overflow-hidden bg-accent px-6 font-bold text-accent-foreground shadow-[0_0_15px_rgba(var(--accent),0.2)] ring-1 ring-accent/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(var(--accent),0.4)] hover:ring-accent hover:-translate-y-0.5 active:translate-y-0"
            >
              Request Invite
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button 
          className="flex md:hidden rounded-md p-2 text-foreground/80 transition-all hover:bg-surface hover:text-primary active:scale-95"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <div 
        className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out border-b border-border/50 bg-background/95 backdrop-blur-xl",
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 border-transparent"
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
                  "text-base font-semibold transition-colors",
                  isActive ? "text-accent" : "text-foreground/80 hover:text-primary"
                )}
              >
                {link.title}
              </Link>
            );
          })}
          <div className="h-px w-full bg-border/40 my-2" />
          <div className="flex flex-col gap-3 pt-2">
            <Link href={authLinks.login} className="w-full">
              <Button variant="outline" className="w-full justify-center border-border/50 bg-surface/50 hover:bg-surface font-semibold transition-colors">
                Sign In
              </Button>
            </Link>
            <Link href={authLinks.requestInvite} className="w-full">
              <Button className="w-full justify-center bg-accent text-accent-foreground font-bold shadow-md hover:shadow-lg transition-all">
                Request Invite
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
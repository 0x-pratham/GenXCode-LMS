import Link from 'next/link';
import { brandConfig } from '@/config/brand';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Left Side - Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">
              {brandConfig.shortName}
            </span>
          </Link>
          {children}
        </div>
      </div>
      
      {/* Right Side - Brand Banner (Hidden on Mobile) */}
      <div className="hidden md:flex flex-1 bg-surface items-center justify-center p-12 relative overflow-hidden">
        <div className="relative z-10 max-w-lg text-center">
          <h2 className="font-heading text-4xl font-bold text-primary mb-4">
            Elite Tech Community
          </h2>
          <p className="text-lg text-foreground/80">
            Join the top developers. Learn, build, and climb the leaderboard in an exclusive, invite-only environment.
          </p>
        </div>
        {/* Subtle decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
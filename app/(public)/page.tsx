import { brandConfig } from '@/config/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { authLinks } from '@/config/navigation';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6 lg:px-8 flex flex-col items-center text-center">
      <div className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm font-medium mb-8 bg-surface text-primary">
        🚀 The next generation of tech learning
      </div>
      
      <h1 className="font-heading text-5xl font-bold tracking-tight text-primary sm:text-7xl mb-6 max-w-4xl">
        Build Your Tech Legacy with {brandConfig.name}
      </h1>
      
      <p className="max-w-2xl text-lg text-foreground/80 mb-10 leading-relaxed">
        {brandConfig.description}. Join elite cohorts, participate in hackathons, and climb the leaderboard. 
        Invitation strictly required.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Link href={authLinks.requestInvite} className="w-full sm:w-auto">
          <Button variant="accent" size="lg" className="w-full text-base">
            Request an Invite
          </Button>
        </Link>
        <Link href="/about" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full text-base">
            Learn More
          </Button>
        </Link>
      </div>
    </div>
  );
}
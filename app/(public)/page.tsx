import { HeroSection } from '@/components/sections/HeroSection';
import { WhyJoinSection } from '@/components/sections/WhyJoinSection';
import { WhoCanJoinSection } from '@/components/sections/WhoCanJoinSection';
import { WhoWeAreSection } from '@/components/sections/WhoWeAreSection'; // Naya import

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full bg-transparent">
      <HeroSection />
      <WhyJoinSection />
      <WhoCanJoinSection />
      <WhoWeAreSection />
    </div>
  );
}
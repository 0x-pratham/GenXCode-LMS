import { HeroSection } from '@/components/sections/HeroSection';
import { WhyJoinSection } from '@/components/sections/WhyJoinSection';
import { WhoCanJoinSection } from '@/components/sections/WhoCanJoinSection';
import { WhoWeAreSection } from '@/components/sections/WhoWeAreSection';
import CinematicIntro from '@/components/CinematicIntro'; // Import the new intro component

export default function HomePage() {
  return (
    <CinematicIntro>
      <div className="flex flex-col items-center w-full bg-transparent">
        <HeroSection />
        <WhyJoinSection />
        <WhoCanJoinSection />
        <WhoWeAreSection />
      </div>
    </CinematicIntro>
  );
}
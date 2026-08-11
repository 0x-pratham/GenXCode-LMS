import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import RoyalPurpleBackground from '@/components/RoyalPurpleBackground'; 

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Clean, minimal wrapper with custom text selection color
    <div className="relative flex min-h-screen flex-col bg-transparent selection:bg-brand-gradient/30 selection:text-white">
      
      {/* Global Royal Background - Fixed to viewport */}
      <RoyalPurpleBackground fixed={true} />

      <Navbar />
      
      {/* Main content wrapper with flex-grow to push footer down */}
      <main className="flex-1 flex flex-col w-full relative z-10">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import PremiumPurpleBackground from '@/components/PremiumPurpleBackground'; 

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Added custom text selection color for a high-end feel
    <div className="relative flex min-h-screen flex-col bg-transparent selection:bg-brand-gradient/30 selection:text-white">
      
      {/* Global Premium Background - Fixed to viewport */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <PremiumPurpleBackground />
      </div>

      <Navbar />
      
      {/* Main content wrapper with flex-grow to push footer down */}
      <main className="flex-1 flex flex-col w-full relative z-0">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}
import { Navbar } from "@/components/layout/Navbar";
import RoyalPurpleBackground from "@/components/RoyalPurpleBackground"; // Agar ye named export hai toh { RoyalPurpleBackground } use karein

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      
      {/* ---------------- GLOBAL AUTH BACKGROUND ---------------- */}
      {/* Ye component Login aur Invite dono pages ke background me dikhega */}
      <RoyalPurpleBackground />

      {/* Yahan Navbar add kiya hai */}
      <div className="relative z-20">
        <Navbar />
      </div>
      
      {/* Main content area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pt-24 pb-12 w-full">
        {children}
      </main>
      
    </div>
  );
}
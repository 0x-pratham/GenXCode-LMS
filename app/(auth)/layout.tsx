import { Navbar } from "@/components/layout/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      {/* Yahan Navbar add kiya hai */}
      <Navbar />
      
      {/* Main content area */}
      <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        {children}
      </main>
    </div>
  );
}
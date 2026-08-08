import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/Sidebar";
import Image from "next/image";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "student";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role) {
      userRole = profile.role;
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-background overflow-hidden">
      
      {/* Global Portal Background Image with Scrim Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/assets/dashboardbg.jpg"
          alt="Portal Background"
          fill
          className="object-cover opacity-60 mix-blend-luminosity"
          priority
        />
        {/* Dark Scrim Wrap for Text Readability */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-lg z-0" />
      </div>

      <div className="relative z-10 flex w-full">
        <Sidebar userRole={userRole} />

        <div className="flex flex-col flex-1 md:pl-64 transition-all duration-300 min-h-screen">
          {/* Mobile Header - Converted to Glass */}
          <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-white/10 surface-glass-panel px-4 md:hidden backdrop-blur-xl">
            <button className="text-[#E2D1FE] focus:outline-none hover:text-white transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <span className="font-heading text-lg font-bold text-foreground">
              GenXCode
            </span>
          </header>

          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
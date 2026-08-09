import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { brandConfig } from '@/config/brand';
import { AppProviders } from '@/providers';
import { Toaster } from 'sonner';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ShieldAlert, LogOut } from 'lucide-react';
import '@/styles/globals.css';

const googleSans = localFont({
  src: '../public/fonts/GoogleSansFlex.ttf',
  variable: '--font-google-sans',
  display: 'swap',
  weight: '300 700',
});

export const metadata: Metadata = {
  title: {
    default: brandConfig.name,
    template: `%s | ${brandConfig.name}`,
  },
  description: brandConfig.description,
  icons: {
    icon: '/logo.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isBanned = false;

  // Global Ban Check - Schema Driven
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (profile && profile.is_active === false) {
      isBanned = true;
    }
  }

  // Safe Inline Server Action to destroy the session completely
  async function handleSignOut() {
    "use server";
    const supabaseServer = await createClient();
    await supabaseServer.auth.signOut();
    redirect("/login");
  }

  return (
    <html lang="en" className={`${googleSans.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-accent selection:text-primary">
        <AppProviders>
          {isBanned ? (
            /* The Elite Lock Screen (Replaces the entire app if the user is disabled) */
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-3xl px-4">
              <div className="animate-fade-in-up text-center space-y-6 max-w-md w-full p-8 bg-black/40 border border-red-500/20 rounded-3xl shadow-[0_0_40px_rgba(239,68,68,0.1)]">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-2 shadow-inner">
                  <ShieldAlert className="w-8 h-8 text-red-500 drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="font-heading text-3xl font-bold text-red-400 drop-shadow-sm">Account Suspended</h1>
                  <p className="text-[#E2D1FE]/60 text-sm font-medium mt-3 leading-relaxed">
                    Your access to this platform has been revoked by an administrator. You can no longer view or interact with any content.
                  </p>
                </div>
                <form action={handleSignOut} className="pt-4 border-t border-white/5">
                  <button type="submit" className="w-full h-12 flex items-center justify-center rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-foreground border border-white/10 hover:border-red-500/30 font-bold transition-all duration-300">
                    <LogOut className="w-4 h-4 mr-2" /> Clear Session & Exit
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Normal App Render */
            children
          )}
          <Toaster position="top-center" richColors />
        </AppProviders>
      </body>
    </html>
  );
}
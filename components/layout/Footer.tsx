import Link from 'next/link';
import { brandConfig } from '@/config/brand';
import { footerLinks } from '@/config/footer';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-heading text-2xl font-bold tracking-tight text-primary">
                {brandConfig.name}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-foreground/70 leading-relaxed">
              {brandConfig.description}
            </p>
            <p className="mt-4 text-sm font-medium text-primary">
              Support: {brandConfig.emails.support}
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-heading font-semibold text-primary mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-foreground/70 hover:text-accent transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Socials */}
          <div>
            <h3 className="font-heading font-semibold text-primary mb-4">Legal</h3>
            <ul className="space-y-3 mb-6">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link href={link.href} className="text-sm text-foreground/70 hover:text-accent transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/60">
            &copy; {currentYear} {brandConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-foreground/60">
            Strictly Invite-Only
          </div>
        </div>
      </div>
    </footer>
  );
}
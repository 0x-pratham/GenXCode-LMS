"use client";

import Link from 'next/link';
import Image from 'next/image';
import { brandConfig } from '@/config/brand';
import { footerLinks } from '@/config/footer';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden bg-transparent pt-24 pb-12">
      
      {/* Subtle Top Border with Ambient Luxury Glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute top-0 inset-x-0 h-[2px] bg-brand-gradient opacity-60 blur-[3px]"></div>

      {/* Background Ambient Glow Aura */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-accent/10 blur-[140px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Card Container (Glass Panel) */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-black/30 backdrop-blur-2xl border border-white/10 p-8 md:p-12 lg:p-16 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)]">
          
          {/* Subtle Inner Highlight for Top Edge */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-60" />

          {/* Decorative Tech Grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8638CD08_1px,transparent_1px),linear-gradient(to_bottom,#8638CD08_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            {/* Brand Info (Left Column) */}
            <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start">
              <Link href="/" className="group flex items-center space-x-3 mb-6 transition-all duration-300">
                <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(134,56,205,0.6)]">
                  <Image
                    src="/logo/logo.svg"
                    alt={`${brandConfig.name} Logo`}
                    width={44}
                    height={44}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="font-heading text-2xl tracking-tight bg-silver-gradient bg-clip-text text-transparent drop-shadow-md">
                  {brandConfig.name}
                </span>
              </Link>
              
              <p className="max-w-sm text-[#E2D1FE]/70 leading-relaxed text-sm md:text-base mb-8">
                {brandConfig.description} The exclusive platform where elite engineering meets real-world execution.
              </p>

              {/* Social Links mapped cleanly from footerLinks */}
              <div className="flex items-center gap-3">
                {footerLinks.socials.map((social) => {
                  return (
                    <a 
                      key={social.title}
                      // Humesha proper string value set karna ensures redirect sahi ho
                      href={social.href || '#'} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-11 h-11 flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-[#E2D1FE] hover:text-white hover:border-accent/40 hover:bg-white/[0.08] hover:shadow-[0_0_20px_rgba(134,56,205,0.3)] transition-all duration-300"
                      aria-label={social.title}
                    >
                      {social.title === 'LinkedIn' && (
                        <svg className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      )}
                      {social.title === 'WhatsApp' && (
                        <svg className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                        </svg>
                      )}
                      {social.title === 'Instagram' && (
                        <svg className="w-5 h-5 fill-current transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.0-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Spacer for Desktop Layout */}
            <div className="hidden lg:block lg:col-span-2"></div>

            {/* Links Sections (Right Columns) */}
            <div className="md:col-span-6 lg:col-span-5 grid grid-cols-2 gap-8">
              
              {/* Platform Links */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-6">Platform</h3>
                <ul className="space-y-3.5">
                  {footerLinks.platform.map((link) => (
                    <li key={link.title}>
                      <Link 
                        href={link.href} 
                        className="text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground mb-6">Legal</h3>
                <ul className="space-y-3.5">
                  {footerLinks.legal.map((link) => (
                    <li key={link.title}>
                      <Link 
                        href={link.href} 
                        className="text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                      >
                        {link.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a 
                      href={`mailto:${brandConfig.emails.support}`} 
                      className="text-sm font-medium text-[#E2D1FE]/70 hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      Email Support
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

          {/* Bottom Bar: Copyright and Styled Badge */}
          <div className="mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10">
            <p className="text-sm text-[#E2D1FE]/50 font-medium">
              &copy; {currentYear} {brandConfig.name}. All rights reserved.
            </p>
            
            {/* Styled Editorial Badge matching "The Architects" format */}
            <div className="inline-flex items-center gap-3">
              <span className="w-8 h-[2px] bg-brand-gradient rounded-full shadow-[0_0_10px_rgba(134,56,205,0.8)]"></span>
              <span className="text-xs font-semibold tracking-widest text-[#E2D1FE] uppercase drop-shadow-md">
                Strictly Invite-Only
              </span>
            </div>
          </div>

        </div>
        
      </div>
    </footer>
  );
}
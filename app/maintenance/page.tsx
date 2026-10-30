
import Image from 'next/image';

export default function MaintenancePage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">

      {/* Subtle background lighting */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, rgba(95,34,149,0.20) 0%, transparent 65%)',
        }}
      />

      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-accent/70 to-transparent" />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center text-center">

        {/* Official GenXCode logo */}
        <div className="mb-12">
          <Image
            src="/logo/logo.png"
            alt="GenXCode"
            width={180}
            height={180}
            priority
            className="h-24 w-auto object-contain sm:h-28"
          />
        </div>

        {/* Maintenance heading */}
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#B77AF0]">
            Under Maintenance
          </span>
        </div>

        <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-white sm:text-6xl">
          We&apos;ll be
          <br />
          <span className="text-[#B77AF0]">back soon.</span>
        </h1>

        <p className="mt-7 max-w-md text-sm leading-7 text-secondary-foreground/65 sm:text-base">
  We&apos;re building something massive at GenXCode. A new experience,
  bigger ideas, and exciting things are on the way. We&apos;re working
  behind the scenes to bring it all together.

  <span className="mt-4 block font-medium text-secondary-foreground">
    Stay tuned. The next chapter is going to be worth the wait.
  </span>
</p>

        {/* Minimal divider */}
        <div className="mt-12 flex w-full max-w-[180px] items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <div className="h-1.5 w-1.5 rounded-full bg-accent" />
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-secondary-foreground/35">
          © {new Date().getFullYear()} GenXCode. All rights reserved.
        </p>

      </section>
    </main>
  );
}

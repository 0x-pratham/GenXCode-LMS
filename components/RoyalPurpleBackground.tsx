"use client";

import React from "react";

/**
 * RoyalPurpleBackground
 * A premium, "royal" dark-purple background system — deliberately different
 * from a generic symmetric-blob gradient:
 *
 *  - deep imperial-purple base with a single asymmetric top-right "corona"
 *    (like a stage spotlight, not a centered glow), static — no motion
 *  - a fine diagonal "brocade" lattice (woven-fabric feel) instead of a
 *    tech dot-grid — this is what makes it read "royal" not "SaaS"
 *  - film grain so the gradient never bands
 *
 * Built with plain CSS (styled-jsx) — no dependencies, GPU-light,
 * respects prefers-reduced-motion.
 *
 * USAGE 1 — global site background, in app/layout.tsx:
 *
 *   import RoyalPurpleBackground from "@/components/RoyalPurpleBackground";
 *
 *   export default function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <RoyalPurpleBackground />
 *           {children}
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * USAGE 2 — as a section wrapper (non-fixed, scrolls with content):
 *
 *   <RoyalPurpleBackground fixed={false}>
 *     <YourHeroContent />
 *   </RoyalPurpleBackground>
 */

interface RoyalPurpleBackgroundProps {
  /** If true (default), covers the whole viewport and stays put while you scroll.
   *  If false, becomes a normal-flow wrapper you can drop content into. */
  fixed?: boolean;
  /** Show the brocade lattice texture layer. Default true. */
  showLattice?: boolean;
  /** Show the film-grain texture layer. Default true. */
  showGrain?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function RoyalPurpleBackground({
  fixed = true,
  showLattice = true,
  showGrain = true,
  className = "",
  children,
}: RoyalPurpleBackgroundProps) {
  return (
    <div className={`rpbg-root ${fixed ? "rpbg-fixed" : "rpbg-relative"} ${className}`}>
      <div className="rpbg-base" />

      {showLattice && <div className="rpbg-lattice" />}

      <div className="rpbg-corona" />

      <div className="rpbg-vignette" />

      {showGrain && <div className="rpbg-grain" />}

      {children && <div className="rpbg-content">{children}</div>}

      <style jsx>{`
        .rpbg-root {
          --void: #0a0416;
          --deep: #1c0f3a;
          --royal: #3d1a78;
          --amethyst: #6d28d9;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .rpbg-fixed {
          position: fixed;
          inset: 0;
          z-index: -10;
          pointer-events: none;
        }

        .rpbg-relative {
          position: relative;
          min-height: 100%;
        }

        /* Base: near-black purple, deepening toward the bottom-left,
           so the corona in the opposite corner has somewhere to fall. */
        .rpbg-base {
          position: absolute;
          inset: 0;
          background: linear-gradient(
              155deg,
              var(--deep) 0%,
              var(--void) 42%,
              #060210 100%
            ),
            radial-gradient(ellipse 70% 55% at 8% 100%, rgba(61, 26, 120, 0.35) 0%, transparent 60%);
        }

        /* Asymmetric corona — a single warm-violet light source in the
           upper right, like a spotlight rather than a centered orb. */
        .rpbg-corona {
          position: absolute;
          top: -18%;
          right: -12%;
          width: 68vw;
          height: 68vw;
          max-width: 900px;
          max-height: 900px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            var(--amethyst) 0%,
            rgba(109, 40, 217, 0.35) 32%,
            transparent 68%
          );
          filter: blur(70px);
          opacity: 0.5;
          mix-blend-mode: screen;
        }

        /* Brocade lattice: two thin diagonal hairline grids overlaid to
           suggest woven fabric / damask rather than a circuit-board grid. */
        .rpbg-lattice {
          position: absolute;
          inset: 0;
          background-image: repeating-linear-gradient(
              60deg,
              rgba(201, 162, 39, 0.05) 0px,
              rgba(201, 162, 39, 0.05) 1px,
              transparent 1px,
              transparent 34px
            ),
            repeating-linear-gradient(
              -60deg,
              rgba(196, 181, 253, 0.04) 0px,
              rgba(196, 181, 253, 0.04) 1px,
              transparent 1px,
              transparent 34px
            );
          -webkit-mask-image: radial-gradient(
            ellipse 80% 70% at 62% 30%,
            black 20%,
            transparent 80%
          );
          mask-image: radial-gradient(ellipse 80% 70% at 62% 30%, black 20%, transparent 80%);
          opacity: 0.9;
        }

        .rpbg-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 110% 110% at 30% 60%,
            transparent 35%,
            rgba(6, 2, 16, 0.62) 100%
          );
        }

        .rpbg-grain {
          position: absolute;
          inset: -100px;
          opacity: 0.045;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        .rpbg-content {
          position: relative;
          z-index: 1;
        }

      `}</style>
    </div>
  );
}
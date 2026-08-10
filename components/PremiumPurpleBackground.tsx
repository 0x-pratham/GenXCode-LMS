"use client";

import React from "react";

/**
 * PremiumPurpleBackground
 * A premium, animated deep-purple background system:
 *  - a rich multi-stop void→violet gradient base
 *  - three slow-drifting "aurora" glow blobs (violet / fuchsia / cyan)
 *  - a fine dot-grid pattern for a dev/tech "circuit" feel
 *  - a subtle film-grain overlay so the gradient never looks flat/banded
 *
 * Built with plain CSS (styled-jsx, built into Next.js) — no extra
 * dependencies, GPU-light, respects prefers-reduced-motion.
 *
 * USAGE 1 — global site background (recommended), in app/layout.tsx:
 *
 *   import PremiumPurpleBackground from "@/components/PremiumPurpleBackground";
 *
 *   export default function RootLayout({ children }: { children: React.ReactNode }) {
 *     return (
 *       <html lang="en">
 *         <body>
 *           <PremiumPurpleBackground />
 *           {children}
 *         </body>
 *       </html>
 *     );
 *   }
 *
 * USAGE 2 — as a section wrapper (non-fixed, scrolls with content):
 *
 *   <PremiumPurpleBackground fixed={false}>
 *     <YourHeroContent />
 *   </PremiumPurpleBackground>
 */

interface PremiumPurpleBackgroundProps {
  /** If true (default), covers the whole viewport and stays put while you scroll.
   *  If false, becomes a normal-flow wrapper you can drop content into. */
  fixed?: boolean;
  /** Show the dot-grid pattern layer. Default true. */
  showGrid?: boolean;
  /** Show the film-grain texture layer. Default true. */
  showGrain?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function PremiumPurpleBackground({
  fixed = true,
  showGrid = true,
  showGrain = true,
  className = "",
  children,
}: PremiumPurpleBackgroundProps) {
  return (
    <div className={`ppbg-root ${fixed ? "ppbg-fixed" : "ppbg-relative"} ${className}`}>
      <div className="ppbg-base" />

      {showGrid && <div className="ppbg-grid" />}

      <div className="ppbg-aurora">
        <span className="ppbg-blob ppbg-blob-1" />
        <span className="ppbg-blob ppbg-blob-2" />
        <span className="ppbg-blob ppbg-blob-3" />
      </div>

      <div className="ppbg-vignette" />

      {showGrain && <div className="ppbg-grain" />}

      {children && <div className="ppbg-content">{children}</div>}

      <style jsx>{`
        .ppbg-root {
          --void: #05010e;
          --deep: #12082b;
          --mid: #241246;
          --violet: #7c3aed;
          --fuchsia: #c026d3;
          --cyan: #22d3ee;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .ppbg-fixed {
          position: fixed;
          inset: 0;
          z-index: -10;
          pointer-events: none;
        }

        .ppbg-relative {
          position: relative;
          min-height: 100%;
        }

        .ppbg-base {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 90% 60% at 50% -10%, var(--mid) 0%, transparent 60%),
            radial-gradient(ellipse 80% 60% at 100% 100%, rgba(124, 58, 237, 0.18) 0%, transparent 55%),
            linear-gradient(180deg, var(--void) 0%, var(--deep) 45%, var(--void) 100%);
        }

        .ppbg-grid {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(
            circle,
            rgba(196, 181, 253, 0.16) 1px,
            transparent 1.4px
          );
          background-size: 28px 28px;
          background-position: -1px -1px;
          -webkit-mask-image: radial-gradient(
            ellipse 75% 65% at 50% 40%,
            black 30%,
            transparent 85%
          );
          mask-image: radial-gradient(ellipse 75% 65% at 50% 40%, black 30%, transparent 85%);
          opacity: 0.8;
        }

        .ppbg-aurora {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .ppbg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          mix-blend-mode: screen;
          opacity: 0.55;
          will-change: transform;
        }

        .ppbg-blob-1 {
          top: -10%;
          left: 8%;
          width: 42vw;
          height: 42vw;
          max-width: 560px;
          max-height: 560px;
          background: radial-gradient(circle, var(--violet) 0%, transparent 70%);
          animation: ppbg-drift-1 26s ease-in-out infinite alternate;
        }

        .ppbg-blob-2 {
          bottom: -15%;
          right: 4%;
          width: 38vw;
          height: 38vw;
          max-width: 520px;
          max-height: 520px;
          background: radial-gradient(circle, var(--fuchsia) 0%, transparent 70%);
          animation: ppbg-drift-2 32s ease-in-out infinite alternate;
        }

        .ppbg-blob-3 {
          top: 35%;
          left: 45%;
          width: 30vw;
          height: 30vw;
          max-width: 420px;
          max-height: 420px;
          background: radial-gradient(circle, var(--cyan) 0%, transparent 70%);
          opacity: 0.28;
          animation: ppbg-drift-3 22s ease-in-out infinite alternate;
        }

        @keyframes ppbg-drift-1 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(6vw, 8vh) scale(1.15);
          }
        }

        @keyframes ppbg-drift-2 {
          0% {
            transform: translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-7vw, -6vh) scale(1.1);
          }
        }

        @keyframes ppbg-drift-3 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
          }
          100% {
            transform: translate(-50%, -50%) translate(4vw, -5vh) scale(1.2);
          }
        }

        .ppbg-vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 100% 100% at 50% 50%,
            transparent 40%,
            rgba(5, 1, 14, 0.55) 100%
          );
        }

        .ppbg-grain {
          position: absolute;
          inset: -100px;
          opacity: 0.05;
          mix-blend-mode: overlay;
          pointer-events: none;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
        }

        .ppbg-content {
          position: relative;
          z-index: 1;
        }

        @media (prefers-reduced-motion: reduce) {
          .ppbg-blob {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}

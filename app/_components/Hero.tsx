"use client";

import { SITE_DOMAIN } from "@/lib/site";
import { VerifiedDownloadCTA } from "@/app/_components/VerifiedDownloadCTA";
import { Screenshot } from "@/app/_components/Screenshot";
import { trackEvent } from "@/lib/analytics";

export function Hero() {
  return (
    <section
      id="top"
      className="relative pt-12 md:pt-20 pb-16 md:pb-24 px-4 max-w-6xl mx-auto"
    >
      {/* Eyebrow chip */}
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-surface text-[10px] tracking-[0.18em] uppercase text-muted font-mono">
        READ-ONLY OVERLAY &nbsp;·&nbsp; NOT AFFILIATED WITH SHIRO GAMES
      </span>

      {/* H1 */}
      <h1 className="mt-6 text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
        Farever Companion
      </h1>

      {/* Subtitle */}
      <p className="mt-4 max-w-2xl text-lg text-muted">
        A passive damage, healing, and shielding meter for Farever. Reads the game. Touches nothing.
      </p>

      {/* Two-column block */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left column */}
        <div className="max-w-2xl">
          <VerifiedDownloadCTA variant="hero" />
          <p className="mt-3 text-xs text-muted">
            {SITE_DOMAIN} is the only official source. If you got the file anywhere else, verify the SHA-256 above before running it.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-subtle mt-4">
            Windows · DLL overlay · Free
          </p>
          <a
            href="#disclaimer"
            onClick={() => trackEvent("jump_link_click", { target: "#disclaimer", location: "hero_body" })}
            className="mt-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            What it does (and doesn&apos;t) →
          </a>
        </div>

        {/* Right column */}
        <div>
          <Screenshot
            src="/screenshots/dps-meter.webp"
            alt="Farever Companion DPS meter showing real-time damage breakdown"
            width={677}
            height={300}
            className="rounded-lg w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}

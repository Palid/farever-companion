"use client";

import type { ReactNode } from "react";
import { SITE_DOMAIN, CONTACT_EMAIL } from "@/lib/site";
import { Icon } from "@/app/_components/Icon";
import { trackEvent } from "@/lib/analytics";
import { Callout } from "@/app/_components/Callout";

type FaqItem = {
  q: string;
  a: ReactNode;
};

const items: FaqItem[] = [
  {
    q: "Where can I download this safely?",
    a: (
      <>
        Only from <code className="font-mono text-foreground">{SITE_DOMAIN}</code>. If you found it on another site, a
        Discord upload, a Google Drive link, a &ldquo;mirror,&rdquo; or anything else, treat it as suspicious until you
        verify the SHA-256 matches the value on this site exactly. If it doesn&apos;t match, delete it. We do not
        authorize any mirrors.
      </>
    ),
  },
  {
    q: "Is this safe to use?",
    a: "Companion is read-only: it observes the game and does not write to memory, files, or network. It doesn't interact with other players or send anything anywhere. We can't speak for Shiro Games' policy on third-party overlays; use at your own discretion.",
  },
  {
    q: "My browser warned me when downloading — is that bad?",
    a: (
      <>
        Probably not. Browsers (Chrome, Edge, Firefox) routinely warn on DLLs and small, low-distribution downloads.
        That&apos;s expected for a tool of our scale and has nothing to do with the file&apos;s contents. The right
        move is to verify the SHA-256 of the downloaded file against the value published with the CTA on this page —
        if they match, you have the real build.
      </>
    ),
  },
  {
    q: "Why is the binary obfuscated?",
    a: "Farever has an active cheating problem and Shiro Games is dealing with it. Companion is a passive read-only meter, but the same memory-reading techniques it uses could be repurposed for cheats if the binary were trivial to reverse-engineer. Obfuscation is a deliberate choice to make the tool useless as a stepping stone for bad actors.",
  },
  {
    q: "Is the source code available?",
    a: (
      <>
        Yes, on request. The repo is private for the same reason the binary is obfuscated: keeping
        reverse-engineering material out of cheat-makers&apos; hands. Researchers, journalists, or anyone with a
        legitimate verification interest can email{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {CONTACT_EMAIL}
        </a>{" "}
        to arrange read access.
      </>
    ),
  },
  {
    q: "How do I install / uninstall?",
    a: "Download the zip, follow the README inside, launch Farever. To uninstall: delete the DLL. No installer, no registry entries, no background service.",
  },
  {
    q: "The overlay isn’t showing or isn’t updating — what should I check?",
    a: (
      <Callout tone="warning" icon="shield">
        <strong className="text-warning">Disable NVIDIA Smooth Motion.</strong> It&apos;s incompatible with ImGui-based
        overlays under DirectX 11 &mdash; the overlay either won&apos;t render at all or renders once and never updates
        while Smooth Motion is enabled. Open the NVIDIA app, disable Smooth Motion (either globally or under
        Farever&apos;s per-game settings), and restart the game. Vulkan users aren&apos;t affected. If the overlay still
        doesn&apos;t appear or refresh after that, double-check that{" "}
        <code className="font-mono text-foreground">dinput8.dll</code> is in the same folder as the game&apos;s
        executable.
      </Callout>
    ),
  },
  {
    q: "How do updates work?",
    a: (
      <>
        This page always points at the latest stable build. No auto-updater. Re-download from{" "}
        <code className="font-mono text-foreground">{SITE_DOMAIN}</code>, verify the new SHA-256, replace the file,
        done.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">FAQ</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Frequently asked</h2>

        <div className="mt-10 divide-y divide-border border-y border-border">
          {items.map((item, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <details
                key={item.q}
                className="group"
                onToggle={(e) => {
                  if (e.currentTarget.open) {
                    trackEvent("faq_open", { question: item.q });
                  }
                }}
              >
                <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden flex items-start gap-4 py-5 text-left text-foreground hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:text-accent">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle pt-1 w-8 shrink-0">
                    {num}
                  </span>
                  <span className="flex-1 font-medium">{item.q}</span>
                  <Icon
                    name="chevron-down"
                    className="w-4 h-4 text-subtle transition-transform group-open:rotate-180 mt-1 shrink-0"
                  />
                </summary>
                <div className="pb-6 pl-12 pr-2 text-muted leading-relaxed">{item.a}</div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}

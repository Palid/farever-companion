"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_DOMAIN } from "@/lib/site";
import { Icon } from "@/app/_components/Icon";
import { trackEvent } from "@/lib/analytics";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Download", href: "#download" },
  { label: "FAQ", href: "#faq" },
  { label: "Support", href: "#support" },
] as const;

// Ribbon height is ~36-40px (top-9). Adjust if the ribbon height changes.
export function NavBar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="sticky top-9 z-40 w-full backdrop-blur-md bg-background/70 border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="#top"
          className="flex flex-col leading-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          onClick={() => trackEvent("jump_link_click", { target: "#top", location: "navbar_wordmark" })}
        >
          <span className="font-semibold tracking-tight text-foreground">Farever Companion</span>
          <span className="font-mono text-[10px] text-subtle">· {SITE_DOMAIN}</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => trackEvent("jump_link_click", { target: link.href, location: "navbar_desktop" })}
              className={`text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded ${
                activeSection === link.href.slice(1)
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA pill */}
        <a
          href="#download"
          onClick={() => trackEvent("jump_link_click", { target: "#download", location: "navbar_desktop" })}
          className="hidden md:inline-flex ml-4 items-center gap-1 bg-accent text-accent-foreground text-sm font-semibold rounded-full px-4 py-1.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Icon name="download" className="w-3.5 h-3.5" />
          Download
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 rounded text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-menu"
        ref={menuRef}
        aria-hidden={!open}
        className={`md:hidden border-t border-border bg-background/95 backdrop-blur-md overflow-hidden transition-all duration-200 ${
          open ? "max-h-64 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => {
                setOpen(false);
                trackEvent("jump_link_click", { target: link.href, location: "navbar_mobile" });
              }}
              className={`py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded px-2 ${
                activeSection === link.href.slice(1)
                  ? "text-accent"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => {
              setOpen(false);
              trackEvent("jump_link_click", { target: "#download", location: "navbar_mobile" });
            }}
            className="mt-2 inline-flex items-center gap-1.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg px-4 py-2 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon name="download" className="w-3.5 h-3.5" />
            Download
          </a>
        </nav>
      </div>
    </div>
  );
}

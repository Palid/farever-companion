"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const STORAGE_KEY = "farever-consent-v1";
const RESET_EVENT = "farever:consent-reset";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Read localStorage outside React's render cycle; schedule state update as a
    // microtask so the effect body itself contains no synchronous setState call.
    queueMicrotask(() => {
      let shouldShow = false;
      try {
        if (!localStorage.getItem(STORAGE_KEY)) shouldShow = true;
      } catch {
        // localStorage unavailable — fall back to showing the banner so the user can still choose
        shouldShow = true;
      }
      if (shouldShow) setShow(true);
    });

    const onReset = () => setShow(true);
    window.addEventListener(RESET_EVENT, onReset);
    return () => window.removeEventListener(RESET_EVENT, onReset);
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "granted");
    } catch {}
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    setShow(false);
  }

  function decline() {
    try {
      localStorage.setItem(STORAGE_KEY, "denied");
    } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border-strong bg-surface-elevated/95 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:py-5">
        <p className="flex-1 text-sm leading-relaxed text-foreground/90">
          We use <strong className="text-foreground">Google Analytics</strong> to understand site traffic. By default it runs anonymously without cookies. Accept to enable cookies for full analytics, or decline to keep it cookieless. <span className="text-muted">No ads, ever.</span>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={decline}
            className="rounded-md border border-border-strong bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

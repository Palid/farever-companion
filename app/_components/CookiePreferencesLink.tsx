"use client";

const STORAGE_KEY = "farever-consent-v1";
const RESET_EVENT = "farever:consent-reset";

export function CookiePreferencesLink() {
  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.dispatchEvent(new Event(RESET_EVENT));
  }

  return (
    <button
      type="button"
      onClick={reset}
      className="text-xs text-muted underline-offset-4 hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
    >
      Cookie preferences
    </button>
  );
}

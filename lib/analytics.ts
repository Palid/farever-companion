declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AnalyticsEventName =
  | "download_click"
  | "faq_open"
  | "jump_link_click";

export type AnalyticsEventParams = {
  download_click: { variant: string; version: string; file_name: string };
  faq_open: { question: string };
  jump_link_click: {
    target: string;
    location:
      | "navbar_desktop"
      | "navbar_mobile"
      | "navbar_wordmark"
      | "hero_body";
  };
};

const CONSENT_KEY = "farever-consent-v1";

export function trackEvent<N extends AnalyticsEventName>(
  name: N,
  params?: AnalyticsEventParams[N]
): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    // Belt-and-suspenders: also check explicit user consent in localStorage.
    // GA Consent Mode already buffers/drops when denied, but we guard here too.
    try {
      if (localStorage.getItem(CONSENT_KEY) !== "granted") return;
    } catch {
      // localStorage unavailable — fall through and let Consent Mode decide.
    }
    window.gtag("event", name, params ?? {});
  } catch {
    // Analytics must never break the page.
  }
}

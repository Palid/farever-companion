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
  download_click: {
    variant: string;
    version: string;
    file_name: string;
    referrer: string;
    page_location: string;
  };
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

export function trackEvent<N extends AnalyticsEventName>(
  name: N,
  params?: AnalyticsEventParams[N]
): void {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.gtag !== "function") return;
    // Consent is enforced upstream by Google Consent Mode v2; events sent under
    // denied state become cookieless modeled pings — no cookies, no client_id.
    window.gtag("event", name, params ?? {});
  } catch {
    // Analytics must never break the page.
  }
}

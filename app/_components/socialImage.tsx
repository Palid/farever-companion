import { SITE_DOMAIN } from "@/lib/site";

export const socialImageSize = { width: 1200, height: 630 };

export function SocialImageContent() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0d",
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          color: "#ededed",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: "-2px",
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Farever Companion
      </div>
      <div
        style={{
          color: "#9a9aa3",
          fontSize: 32,
          marginTop: 24,
          textAlign: "center",
        }}
      >
        Read-only DPS, healing, and shielding meter
      </div>
      <div
        style={{
          color: "#f5b042",
          fontSize: 20,
          marginTop: 40,
          fontFamily: "monospace",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {SITE_DOMAIN}
      </div>
    </div>
  );
}

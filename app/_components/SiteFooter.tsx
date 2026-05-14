import { SITE_DOMAIN, OWNER, CONTACT_EMAIL } from "@/lib/site";
import { RELEASE_CONFIG, formatReleaseDate } from "@/lib/release";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm font-semibold text-foreground">
          Official source: <code className="font-mono text-accent">{SITE_DOMAIN}</code>
        </p>
        <p className="mt-1 text-xs text-muted">
          We do not authorize any mirrors. Always verify the SHA-256 before running the file.
        </p>

        <div className="mt-6 border-t border-border" />

        <p className="mt-6 text-xs text-muted leading-relaxed max-w-3xl">
          Farever Companion is a community-made tool. Farever is a trademark of Shiro Games. This project is not
          affiliated with, endorsed by, or sponsored by Shiro Games.
        </p>

        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.15em] text-subtle">
          v{RELEASE_CONFIG.latestVersion}&nbsp;&nbsp;·&nbsp;&nbsp;Released{" "}
          {formatReleaseDate(RELEASE_CONFIG.releasedAt)}&nbsp;&nbsp;·&nbsp;&nbsp;SHA-256{" "}
          {RELEASE_CONFIG.sha256.slice(0, 12)}&hellip;
        </p>

        <p className="mt-2 text-xs text-subtle">
          &copy; {new Date().getFullYear()} {OWNER}.
        </p>

        <p className="mt-1 text-xs text-subtle">
          Contact:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-muted hover:text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
      </div>
    </footer>
  );
}

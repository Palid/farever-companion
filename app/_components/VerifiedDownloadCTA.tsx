"use client";

import { SITE_DOMAIN } from "@/lib/site";
import {
  RELEASE_CONFIG,
  isPlaceholderRelease,
  formatReleaseDate,
  formatFileSize,
  releaseDownloadUrl,
} from "@/lib/release";
import { Icon } from "@/app/_components/Icon";
import { CopyButton } from "@/app/_components/CopyButton";
import { trackEvent } from "@/lib/analytics";

interface VerifiedDownloadCTAProps {
  variant?: "hero" | "section";
  className?: string;
}

export function VerifiedDownloadCTA({ variant = "section", className }: VerifiedDownloadCTAProps) {
  const isPlaceholder = isPlaceholderRelease();
  const { latestVersion, fileName, sha256, releasedAt, fileSizeBytes } = RELEASE_CONFIG;

  const fileSizeFormatted = formatFileSize(fileSizeBytes);

  const wrapperClasses = [
    "rounded-xl border border-border-strong bg-surface-elevated p-6 md:p-8",
    variant === "hero"
      ? "shadow-lg shadow-black/40 w-full max-w-2xl"
      : "max-w-3xl mx-auto",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={wrapperClasses}>
      {/* Heading row */}
      <div className="flex items-center gap-2 mb-5">
        <Icon name="lock" className="text-accent w-5 h-5 shrink-0" />
        <span className="text-accent font-semibold tracking-tight">
          Official source: {SITE_DOMAIN}
        </span>
      </div>

      {/* Windows Unblock callout */}
      <div className="mb-5 rounded-lg border border-accent/50 bg-accent/10 p-4 text-sm text-foreground/90 flex items-start gap-3">
        <Icon name="shield" className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="mb-2">
            <strong className="text-accent">Windows users &mdash; please do this before extracting</strong>
          </p>
          <p className="mb-2">
            Right-click the downloaded <code className="font-mono">.zip</code> &rarr; <strong>Properties</strong> &rarr; tick the <strong>Unblock</strong> checkbox at the bottom of the General tab &rarr; <strong>OK</strong>. <em>Then</em> extract.
          </p>
          <p className="mb-2">
            If you skip this step, Windows may falsely demand admin rights when you copy <code className="font-mono">dinput8.dll</code> into your Farever folder, and even granting admin can fail with an &ldquo;unspecified error&rdquo;. This is a Windows quirk for files downloaded from the internet, not a problem with the file itself.
          </p>
          <p className="mb-2">
            <strong>Already extracted and stuck?</strong> Either delete the extracted folder and re-extract after unblocking the zip, or open PowerShell in the extracted folder and run:
          </p>
          <div className="rounded-lg border border-border bg-surface p-3">
            <code className="font-mono text-xs text-foreground break-all select-all">Get-ChildItem -Recurse | Unblock-File</code>
          </div>
        </div>
      </div>

      {/* Primary button */}
      {isPlaceholder ? (
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="w-full bg-surface text-muted cursor-not-allowed border border-border rounded-lg px-6 py-3 inline-flex items-center justify-center gap-2 font-semibold"
        >
          Build pending — coming soon
        </button>
      ) : (
        <a
          href={releaseDownloadUrl(RELEASE_CONFIG)}
          download={fileName}
          rel="noopener"
          className="w-full bg-accent text-accent-foreground font-semibold rounded-lg px-6 py-3 inline-flex items-center justify-center gap-2 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          onClick={() =>
            trackEvent("download_click", {
              variant,
              version: latestVersion,
              file_name: fileName,
              referrer: typeof document !== "undefined" ? document.referrer : "",
              page_location: typeof window !== "undefined" ? window.location.href : "",
            })
          }
        >
          <Icon name="download" className="w-5 h-5" />
          Download Farever Companion v{latestVersion}
        </a>
      )}

      {/* Metadata strip */}
      <p className="font-mono text-sm text-muted mt-4">
        v{latestVersion}
        {" · "}
        released {formatReleaseDate(releasedAt)}
        {fileSizeFormatted ? ` · ${fileSizeFormatted}` : ""}
      </p>

      {/* SHA-256 row */}
      <div className="mt-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-2">
          <div className="flex-1 min-w-0">
            <span className="block text-subtle text-xs uppercase tracking-wider mb-1">
              SHA-256{isPlaceholder ? " · placeholder" : ""}
            </span>
            <span
              className={`font-mono text-xs break-all select-all ${isPlaceholder ? "text-muted" : "text-foreground"}`}
            >
              {sha256}
            </span>
          </div>
          <div className="shrink-0">
            <CopyButton value={sha256} label="Copy SHA-256" />
          </div>
        </div>
      </div>

      {/* Caveat */}
      <p className="text-xs text-muted mt-3">
        If the SHA-256 of your downloaded file doesn&apos;t match this exactly, it&apos;s not our binary. Delete it.
      </p>
    </div>
  );
}

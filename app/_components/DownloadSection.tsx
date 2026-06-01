import { SITE_DOMAIN } from "@/lib/site";
import { RELEASE_CONFIG } from "@/lib/release";
import { CopyButton } from "@/app/_components/CopyButton";
import { VerifiedDownloadCTA } from "@/app/_components/VerifiedDownloadCTA";
import { Callout } from "@/app/_components/Callout";

export function DownloadSection() {
  return (
    <section id="download" className="px-4 py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Download</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Download</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Latest stable build for Farever Early Access. Only available here, at{" "}
          <code className="font-mono text-foreground">{SITE_DOMAIN}</code>.
        </p>

        <Callout tone="warning" icon="lock" className="mt-8">
          <strong className="text-warning">
            Only download from <code className="font-mono">{SITE_DOMAIN}</code>.
          </strong>{" "}
          Anything claiming to be Farever Companion that wasn&apos;t downloaded here and doesn&apos;t match the
          SHA-256 below is not ours. Don&apos;t run it.
        </Callout>

        <div className="mt-6">
          <VerifiedDownloadCTA variant="section" />
        </div>

        <div className="mt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            Verify the download (.zip)
          </p>
          <div className="mt-3 rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4">
            <code className="font-mono text-sm text-foreground break-all">
              Get-FileHash .\{RELEASE_CONFIG.fileName} -Algorithm SHA256
            </code>
            <CopyButton
              value={`Get-FileHash .\\${RELEASE_CONFIG.fileName} -Algorithm SHA256`}
              label="Copy"
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            Run this in the folder where you saved the file. The output&apos;s{" "}
            <code className="font-mono text-foreground">Hash</code> value must match the{" "}
            <strong>SHA-256 · .zip download</strong>{" "}above, character for character.
          </p>
        </div>

        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle">
            Verify the binary (<code className="font-mono normal-case">{RELEASE_CONFIG.dllFileName}</code>)
          </p>
          <div className="mt-3 rounded-lg border border-border bg-surface p-4 flex items-start justify-between gap-4">
            <code className="font-mono text-sm text-foreground break-all">
              Get-FileHash .\{RELEASE_CONFIG.dllFileName} -Algorithm SHA256
            </code>
            <CopyButton
              value={`Get-FileHash .\\${RELEASE_CONFIG.dllFileName} -Algorithm SHA256`}
              label="Copy"
            />
          </div>
          <p className="mt-3 text-sm text-muted">
            After extracting, run this in the extracted folder. The output must match the{" "}
            <strong>
              SHA-256 · <code className="font-mono text-foreground">{RELEASE_CONFIG.dllFileName}</code>
            </strong>{" "}
            above — the same value bundled in the zip&apos;s{" "}
            <code className="font-mono text-foreground">current-hash</code> file.
          </p>
        </div>

        <p className="mt-6 text-sm text-muted">
          Your browser may warn you about the download — DLLs and low-distribution files get flagged routinely.
          That&apos;s expected. Verifying both SHA-256 values against those above is how you confirm authenticity before
          dropping the file into your Farever directory.
        </p>
      </div>
    </section>
  );
}

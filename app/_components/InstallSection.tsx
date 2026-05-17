import { Icon } from "@/app/_components/Icon";
import { Callout } from "@/app/_components/Callout";

const steps: { label: string; detail: string }[] = [
  {
    label: "Download the zip",
    detail:
      "Grab the latest build from the Download section above. The release is a .zip archive containing dinput8.dll, a README.txt, and the font license files.",
  },
  {
    label: "Unzip the archive",
    detail:
      "Extract the zip. You’ll get dinput8.dll and a README.txt (plus the bundled font licenses).",
  },
  {
    label: "Read the README.txt",
    detail:
      "It carries the most up-to-date install notes for that exact build — any patch-specific caveats will live there first.",
  },
  {
    label: "Drop dinput8.dll into the Farever game folder",
    detail:
      "Place the file in the same directory as the game’s executable — the folder that contains Farever.exe (or whichever .exe launches the game). That’s the only file that needs to be there.",
  },
  {
    label: "Launch the game normally",
    detail:
      "Start Farever as you always do. The DLL is picked up automatically via the standard DirectInput8 proxy pattern — no extra launcher, no admin prompt, no config.",
  },
];

export function InstallSection() {
  return (
    <section id="install" className="px-4 py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Install</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight flex items-center gap-3">
          <Icon name="download" className="w-7 h-7 text-accent shrink-0" />
          Installation
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          No installer, no admin rights, no registry entries. Drop one file in the right place and the game picks it up.
        </p>

        <ol className="mt-10 space-y-6" aria-label="Installation steps">
          {steps.map((step, i) => {
            const num = String(i + 1).padStart(2, "0");
            return (
              <li key={step.label} className="flex items-start gap-4">
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em] text-subtle pt-1 w-8 shrink-0"
                  aria-hidden="true"
                >
                  {num}
                </span>
                <div>
                  <p className="font-medium text-foreground">{step.label}</p>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-10 border-t border-border pt-8">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Icon name="close" className="w-4 h-4 text-muted shrink-0" aria-hidden />
            Uninstall
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Delete <code className="font-mono text-foreground">dinput8.dll</code> from the game folder. That&apos;s it
            — no registry keys, no services, no leftover files. The game returns to its unmodified state
            immediately.
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Icon name="shield" className="w-4 h-4 text-muted shrink-0" aria-hidden />
            Overlay missing or frozen?
          </h3>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            If you&apos;ve installed correctly but the overlay either doesn&apos;t appear in-game or appears but never updates, NVIDIA Smooth Motion is the most likely culprit.
          </p>
          <Callout tone="warning" icon="shield" className="mt-4">
            <strong className="text-warning">Disable NVIDIA Smooth Motion.</strong> Open the NVIDIA app, find <strong>Smooth Motion</strong> (either under Graphics &rarr; Global Settings or Farever&apos;s per-game settings), turn it off, and restart the game. Smooth Motion is incompatible with ImGui-based overlays under DirectX 11 &mdash; the overlay either fails to render entirely or renders once and never updates. Vulkan users aren&apos;t affected.
          </Callout>
        </div>

        <p className="mt-6 text-sm text-muted">
          Questions about the install? The{" "}
          <a
            href="#faq"
            className="text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            FAQ
          </a>{" "}
          covers common scenarios including browser download warnings and update procedure.
        </p>
      </div>
    </section>
  );
}

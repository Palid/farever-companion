import { SITE_DOMAIN } from "@/lib/site";

export function SupportSection() {
  return (
    <section id="support" className="px-4 py-16 md:py-24 bg-background">
      <div className="max-w-3xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Support</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Support development.</h2>
        <p className="mt-4 text-muted">
          Companion is a free side project. If it saved you a wipe or two, you can drop a tip. No paywalls, no premium
          tier, no ads — ever.
        </p>

        <div className="mt-6 rounded-lg border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">Where the money goes.</p>
          <p className="mt-2 text-sm text-muted leading-relaxed">
            Every contribution goes directly toward development costs and ongoing maintenance — hosting for{" "}
            <code className="font-mono text-foreground">{SITE_DOMAIN}</code>, the domain itself,{" "}
            <strong className="text-foreground">servers</strong> (there may be some moving infrastructure as the
            project grows — log ingest, analytics, etc.), code-signing if/when we add it, and the time spent keeping
            Companion working across Farever patches. Nothing else.
          </p>
        </div>

        <div className="mt-8 rounded-xl border border-border-strong bg-background overflow-hidden">
          <iframe
            id="kofiframe"
            src="https://ko-fi.com/phoelid/?hidefeed=true&widget=true&embed=true&preview=true"
            style={{ border: "none", width: "100%", padding: 4, background: "#0b0b0d", display: "block" }}
            height={712}
            title="phoelid on Ko-fi"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

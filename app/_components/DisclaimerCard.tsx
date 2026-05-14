import { SITE_DOMAIN } from "@/lib/site";

export function DisclaimerCard() {
  const isItems = [
    "A passive, read-only DLL.",
    "It observes game memory to compute damage, healing, and shielding.",
    "It renders an in-game overlay you can hide or close.",
    "A third-party fan tool, made by a player, for players.",
  ];

  const isNotItems = [
    "Does not modify the game, save files, or network traffic.",
    "Does not affect other players in any way.",
    "Not affiliated with, endorsed by, or supported by Shiro Games.",
    "Not a cheat, trainer, automation, or unlock tool.",
    "Not malware — verifiable SHA-256 published with every download CTA; full source available on request (see FAQ).",
  ];

  return (
    <section id="disclaimer" className="px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-warning/60 bg-surface p-6 md:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning">Read this first.</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">
            What this is — and what it isn&apos;t
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.15em] text-success">What it is</h3>
              <ul className="mt-4 space-y-3 text-foreground">
                {isItems.map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="text-success mr-3 select-none" aria-hidden>•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-mono uppercase tracking-[0.15em] text-warning">What it isn&apos;t</h3>
              <ul className="mt-4 space-y-3 text-foreground">
                {isNotItems.map((item) => (
                  <li key={item} className="flex items-start">
                    <span className="text-warning mr-3 select-none" aria-hidden>×</span>
                    {item}
                  </li>
                ))}
                <li className="flex items-start">
                  <span className="text-warning mr-3 select-none" aria-hidden>×</span>
                  <span>
                    <strong>Not distributed anywhere except{" "}
                    <code className="font-mono text-accent">{SITE_DOMAIN}</code>.</strong>{" "}
                    Any other &ldquo;Farever Companion&rdquo; download is not ours until its SHA-256 matches what&apos;s on this site.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-10 text-sm text-muted italic">
            Use at your own discretion. Farever is in Early Access; expect breakage between patches.
          </p>
        </div>
      </div>
    </section>
  );
}

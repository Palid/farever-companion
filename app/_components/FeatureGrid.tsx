import { FeatureCard } from "@/app/_components/FeatureCard";

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">Features</p>
        <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Three meters. One overlay.</h2>
        <p className="mt-3 max-w-2xl text-muted">
          Companion measures the three numbers that decide a fight, separately and honestly.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon="sword"
            title="Damage"
            tagline="Per-player and party DPS over the encounter window."
            bullets={[
              "Real-time DPS, peak DPS, and effective damage.",
              "Per-skill breakdown for the active fight.",
              "Encounter start/end markers.",
            ]}
            screenshotSrc="/screenshots/dps-meter.webp"
            screenshotAlt="Farever Companion DPS meter showing damage breakdown per ability"
            screenshotWidth={677}
            screenshotHeight={300}
          />
          <FeatureCard
            icon="drop"
            title="Healing"
            tagline="Effective vs. overheal, separated cleanly."
            bullets={[
              "HPS over the encounter window.",
              "Effective healing and overhealing tracked separately.",
              "Per-target healing distribution.",
            ]}
            screenshotAlt="Healing meter close-up"
          />
          <FeatureCard
            icon="shield"
            title="Shielding"
            tagline="Damage absorbed before it ever lands."
            bullets={[
              "Absorbed damage and shield uptime per player.",
              "Wasted (expired or overwritten) shield tracked separately.",
              "Per-skill shield contribution.",
            ]}
            screenshotAlt="Shielding meter close-up"
          />
        </div>
      </div>
    </section>
  );
}

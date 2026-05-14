import { Icon } from "@/app/_components/Icon";
import { Screenshot } from "@/app/_components/Screenshot";

export function EncounterLoggingCard() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-border-strong bg-surface-elevated p-6 md:p-10">
          <div className="flex items-center">
            <Icon name="scroll" className="w-5 h-5 text-accent" />
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent ml-2">
              Encounter logging
            </span>
          </div>

          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Every fight, fully recorded.
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <div className="flex flex-col gap-4">
              <p className="text-foreground/90 leading-relaxed">
                Companion writes a detailed log for each encounter: every player by name and class, every skill
                cast, every hit, every heal, every shield applied. Overhealing is separated from effective
                healing. Per-target damage is tracked individually.
              </p>
              <p className="text-foreground/90 leading-relaxed">
                Each encounter snapshot also captures{" "}
                <strong>the weapons your party was wearing at the time</strong> — both equipped sets and the
                arsenal swap — so the data is there to correlate output with build choices across runs.
              </p>
              <div className="bg-surface border border-warning/40 rounded-lg p-4 mt-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-warning">
                  Work in progress
                </p>
                <p className="mt-2 text-sm text-foreground/85">
                  Target name resolution and full gear resolution are still landing. Right now you&apos;ll see
                  target UUIDs in some places and partial gear lists for non-weapon slots. Weapons resolve
                  reliably today.
                </p>
              </div>
            </div>

            <Screenshot
              src={undefined}
              alt="Sample encounter log dump"
              width={800}
              height={600}
              caption="Encounter log dump — screenshot pending"
              className="rounded-lg w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

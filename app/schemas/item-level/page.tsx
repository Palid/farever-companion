import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/app/_components/Callout";

export const metadata: Metadata = {
  title: "How Item Level Is Calculated",
  description:
    "Authoritative documentation for Farever's per-item iLevel formula, constants, worked examples, and the proposed per-character gear score standard.",
};

export default function ItemLevelPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-muted" aria-label="Breadcrumb">
        <Link
          href="/schemas"
          className="text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
        >
          Schemas
        </Link>
        <span className="mx-2 text-subtle">/</span>
        <span className="text-foreground">How Item Level Is Calculated</span>
      </nav>

      {/* Page header */}
      <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          How Item Level Is Calculated
        </h1>
        <p className="text-base text-muted leading-relaxed">
          Authoritative documentation for Farever&rsquo;s per-item iLevel formula, disassembly-verified
          against game bytecode (build 23472338) and locked by unit tests in Farever Companion.
        </p>
      </header>

      <div className="flex flex-col gap-12 max-w-3xl">
        {/* 1. TL;DR */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">TL;DR</h2>
          <div className="flex flex-col gap-4 text-sm text-foreground/90 leading-relaxed">
            <p>
              Farever computes item level (&ldquo;iLevel&rdquo;) <strong>per item</strong>, internally. It is an
              input to the game&rsquo;s on-demand stat-generation pipeline, not a single number shown
              directly to players. The game stores no per-item stats; it regenerates affixes from{" "}
              <code className="font-mono text-xs text-accent">{"{item row, effective iLevel}"}</code>{" "}
              on demand.
            </p>
            <p>
              There is <strong>one authoritative formula &mdash; the game&rsquo;s own</strong>, which Farever
              Companion replicates. That formula is disassembly-verified against the game bytecode
              (build 23472338) and locked with unit tests. It is documented below and is the
              standard for a per-item iLevel.
            </p>
            <p>
              There is <strong>no native per-character &ldquo;gear score&rdquo;</strong> in Farever, and no
              community tool currently computes one. Farever Companion is the only overlay known to
              compute item level at all; other overlays focus elsewhere &mdash;{" "}
              <a
                href="https://github.com/ramisotti13-eng/farever-minimap"
                className="text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
                target="_blank"
                rel="noopener noreferrer"
              >
                farever-minimap
              </a>
              , for example, is a minimap and damage-meter overlay whose README describes it as
              tracking damage from the floating numbers the game shows above mobs, with no mention of
              item level or gear score. The open question is therefore not &ldquo;every meter does it
              differently&rdquo; but &ldquo;how do we aggregate per-item iLevels into a comparable
              per-character number?&rdquo;. This page proposes a standard for that.
            </p>
          </div>
        </section>

        {/* 2. Inputs */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Inputs</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Two sources feed the formula: the Content Database (CDB) item row, and the per-instance
            state decoded from equipment memory.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Field
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">row.level</td>
                  <td className="px-4 py-3 text-muted">CDB row</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Required level for the item. Optional &mdash; falls back to{" "}
                    <code className="font-mono text-xs text-accent">itemType.defaultMinLevel</code>{" "}
                    (walking the parent type chain), then to 1.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">row.ilevel</td>
                  <td className="px-4 py-3 text-muted">CDB row</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Optional authored static iLevel. When present, overrides the computed{" "}
                    <code className="font-mono text-xs text-accent">level&times;10+bonus</code>{" "}
                    baseline &mdash; but may be discarded by a rarity override (see formula).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">row.rarity_id</td>
                  <td className="px-4 py-3 text-muted">CDB row</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Item rarity tier (Common / Uncommon / Rare / Epic / Legendary). Determines the
                    rarity bonus added to the base.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">row.type_id</td>
                  <td className="px-4 py-3 text-muted">CDB row</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Item type id. Used to look up{" "}
                    <code className="font-mono text-xs text-accent">defaultMinLevel</code> when{" "}
                    <code className="font-mono text-xs text-accent">row.level</code> is absent.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">instance.level</td>
                  <td className="px-4 py-3 text-muted">Equipment memory</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Per-instance level stamp.{" "}
                    <strong>0 is a sentinel meaning &ldquo;use the CDB row&rsquo;s level&rdquo;</strong> &mdash; it
                    is not a real level. Treated as absent.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">instance.upgrade_level</td>
                  <td className="px-4 py-3 text-muted">Equipment memory</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Enhancement stars, 0&ndash;5 (game field{" "}
                    <code className="font-mono text-xs text-accent">upgradeLevel</code>).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">instance.flawless</td>
                  <td className="px-4 py-3 text-muted">Equipment memory</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Boolean quality flag (bit 0 of the instance&rsquo;s flags field).
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-xs text-accent">instance.rarity_override</td>
                  <td className="px-4 py-3 text-muted">Equipment memory</td>
                  <td className="px-4 py-3 text-foreground/80">
                    Weapon-only per-instance rarity override (
                    <code className="font-mono text-xs text-accent">st.item.Weapon.rarity</code>).
                    Usually absent. When present and different from the row rarity, re-stamps the
                    entire iLevel baseline.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Constants & Rarity Bonuses */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Constants &amp; Rarity Bonuses</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            All values below are confirmed from the CDB fixture files (
            <code className="font-mono text-xs text-accent">constant.json</code>,{" "}
            <code className="font-mono text-xs text-accent">rarity.json</code>).
          </p>

          <h3 className="text-base font-semibold mb-3 text-foreground/90">Formula constants</h3>
          <div className="overflow-x-auto rounded-xl border border-border mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Constant
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Value
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    CDB id
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Flawless iLevel bonus</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">+10</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">Item_FlawlessILevelBonus</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Gear upgrade iLevel bonus (per star)</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">+10</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">Item_GearUpgradeILevelBonus</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Weapon special unlock threshold (stars)</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">3</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">GearUpgrades.SkillUnlockLevel</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base font-semibold mb-3 text-foreground/90">Per-rarity iLevel bonuses</h3>
          <div className="overflow-x-auto rounded-xl border border-border mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Rarity
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Index (0-based)
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    iLevelBonus
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Max enhancement stars
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Common</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">0</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">0</td>
                  <td className="px-4 py-3 text-muted text-xs">&mdash;</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Uncommon</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">1</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">0</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Rare</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">2</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">+10</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Epic</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">3</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">+30</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">4</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Legendary</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">4</td>
                  <td className="px-4 py-3 font-mono text-xs text-accent">+50</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted">
            Both Common and Uncommon carry an explicit <code className="font-mono text-accent">iLevelBonus: 0</code> (Uncommon) or no bonus field (Common — treated as 0). The rarity index is 0-based and is used unchanged as the weapon special&rsquo;s <code className="font-mono text-accent">rank</code>.
          </p>
        </section>

        {/* 4. The Formula */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">The Authoritative Per-Item Formula</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The following pseudocode is a direct transcription of{" "}
            <code className="font-mono text-xs text-accent">compute_ilevels</code> in{" "}
            <code className="font-mono text-xs text-accent">farever-item-stats/src/compute.rs</code>,
            which is itself a disassembly-verified replica of fns 20038/20039/20040, 7742 and 7795,
            and 7479/7745 in the game bytecode (build 23472338).
          </p>

          <div className="rounded-xl border border-border bg-surface overflow-hidden mb-6">
            <div className="flex items-center border-b border-border bg-surface-elevated px-4 py-2">
              <span className="font-mono text-xs text-subtle">iLevel formula (pseudocode)</span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-xs text-foreground/80 leading-relaxed">{`# Step 1: resolve required level
required_level = row.level
                 ?? itemType[row.type_id].defaultMinLevel  # walk parent chain
                 ?? 1

# Step 2: row-static baseline
row_static = row.ilevel
             ?? (required_level * 10 + rarityBonus(row.rarity_id))

# Step 3: def iLevel (three branches, checked in order)
override_active = (instance.rarity_override is set
                   AND instance.rarity_override != row.rarity_id
                   AND instance.rarity_override != "")

if override_active:
    # Weapon re-stamp: row.ilevel is DISCARDED; iLevel derives solely from
    # the instance level (or required_level) and the override rarity bonus.
    base = instance.level if instance.level > 0 else required_level
    def_ilevel = base * 10 + rarityBonus(instance.rarity_override)

elif instance.level > 0:
    # Drop-level stamp: instance carries an explicit level.
    def_ilevel = instance.level * 10 + rarityBonus(row.rarity_id)

else:
    # No override, no level stamp: use the row baseline.
    def_ilevel = row_static

# Step 4: apply bonuses
flawless_bonus  = 10 if instance.flawless else 0
upgrade_bonus   = floor(instance.upgrade_level * 10 + 0.5)  # Haxe Math.round

effective_iLevel = def_ilevel + flawless_bonus + upgrade_bonus`}</pre>
          </div>

          <div className="flex flex-col gap-3 text-sm text-foreground/90 leading-relaxed">
            <p>
              <strong>Branch 1 (rarity override):</strong> when an instance carries a rarity override
              that differs from its CDB row rarity, the game re-stamps the def iLevel from scratch
              using the overridden rarity&rsquo;s bonus. The authored <code className="font-mono text-xs text-accent">row.ilevel</code>{" "}
              is completely discarded. This is a weapon-only path (gear has no per-instance rarity
              field).
            </p>
            <p>
              <strong>Branch 2 (level stamp):</strong> when the instance carries a level stamp greater
              than 0, the def iLevel is that stamp times 10, plus the row&rsquo;s rarity bonus. The
              row&rsquo;s authored iLevel is ignored.
            </p>
            <p>
              <strong>Branch 3 (row static):</strong> when neither override nor level stamp is active,
              def iLevel equals the row&rsquo;s static baseline &mdash; the authored{" "}
              <code className="font-mono text-xs text-accent">row.ilevel</code> if present, else{" "}
              <code className="font-mono text-xs text-accent">required_level &times; 10 + rarityBonus</code>.
            </p>
            <p>
              <strong>Rounding:</strong> the upgrade bonus uses Haxe&rsquo;s{" "}
              <code className="font-mono text-xs text-accent">Math.round</code>, which is{" "}
              <code className="font-mono text-xs text-accent">floor(x + 0.5)</code> &mdash; ties round up,
              not to nearest-even. With integer inputs (0&ndash;5 stars, each worth 10) the result is
              always exact, but any tool that substitutes a different rounding scheme will diverge on
              fractional inputs.
            </p>
            <p>
              <strong>Stat generation:</strong> downstream, the game computes{" "}
              <code className="font-mono text-xs text-accent">L = effective_iLevel / 10.0</code> and
              uses it as the continuous level input to the attribute-scaling ramps. That pipeline is
              separate and not covered here.
            </p>
          </div>
        </section>

        {/* 5. Worked Examples */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Worked Examples</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            The following cases are taken directly from the unit tests in{" "}
            <code className="font-mono text-xs text-accent">farever-item-stats/src/compute.rs</code>{" "}
            and are hand-verified ground truth.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Item</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Rarity</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Level source</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Stars</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Flawless</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Override</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">Effective iLevel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Chest_RBee_Fig</td>
                  <td className="px-4 py-3 text-foreground/90">Rare</td>
                  <td className="px-4 py-3 text-muted">instance level 20</td>
                  <td className="px-4 py-3 text-muted">0</td>
                  <td className="px-4 py-3 text-muted">no</td>
                  <td className="px-4 py-3 text-muted">&mdash;</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">210</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Chest_Starter_Fig</td>
                  <td className="px-4 py-3 text-foreground/90">Common</td>
                  <td className="px-4 py-3 text-muted">instance level 20</td>
                  <td className="px-4 py-3 text-muted">0</td>
                  <td className="px-4 py-3 text-muted">no</td>
                  <td className="px-4 py-3 text-muted">&mdash;</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">200</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Sword_Swarm</td>
                  <td className="px-4 py-3 text-foreground/90">Rare</td>
                  <td className="px-4 py-3 text-muted">row level 10 (static 110)</td>
                  <td className="px-4 py-3 text-muted">+1</td>
                  <td className="px-4 py-3 text-muted">no</td>
                  <td className="px-4 py-3 text-muted">&mdash;</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">120</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Sword_Swarm</td>
                  <td className="px-4 py-3 text-foreground/90">Rare</td>
                  <td className="px-4 py-3 text-muted">row level 10 (static 110)</td>
                  <td className="px-4 py-3 text-muted">+3</td>
                  <td className="px-4 py-3 text-muted">yes</td>
                  <td className="px-4 py-3 text-muted">&mdash;</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">150</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Sword_Swarm</td>
                  <td className="px-4 py-3 text-foreground/90">Rare &rarr; Epic override</td>
                  <td className="px-4 py-3 text-muted">no level stamp; row level 10</td>
                  <td className="px-4 py-3 text-muted">0</td>
                  <td className="px-4 py-3 text-muted">no</td>
                  <td className="px-4 py-3 text-foreground/90">Epic</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">130</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-mono text-accent">Hands_Z1U2_Fig</td>
                  <td className="px-4 py-3 text-foreground/90">Uncommon</td>
                  <td className="px-4 py-3 text-muted">static iLevel 80</td>
                  <td className="px-4 py-3 text-muted">0</td>
                  <td className="px-4 py-3 text-muted">yes</td>
                  <td className="px-4 py-3 text-muted">&mdash;</td>
                  <td className="px-4 py-3 font-mono font-semibold text-accent">90</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col gap-2 text-xs text-muted">
            <p>
              <strong>Chest_RBee_Fig</strong> (Rare, no authored level): required_level = 1 (type
              default), no level override &#x2192; branch 2 (instance stamp 20): 20&times;10 + 10 (Rare) = 210.
            </p>
            <p>
              <strong>Chest_Starter_Fig</strong> (Common, level 1, authored iLevel 10): branch 2
              (instance stamp 20): 20&times;10 + 0 (Common) = 200. Authored row.ilevel (10) is
              discarded because the instance level stamp is active.
            </p>
            <p>
              <strong>Sword_Swarm +3 flawless</strong>: no level stamp, Rare row level 10 &#x2192;
              branch 3: row_static = 10&times;10 + 10 = 110; + 30 stars + 10 flawless = 150.
            </p>
            <p>
              <strong>Sword_Swarm Epic override</strong>: no level stamp; branch 1 active (override
              Rare &rarr; Epic): base = required_level = 10; 10&times;10 + 30 (Epic) = 130.
              The row&rsquo;s authored iLevel (if any) is discarded.
            </p>
            <p>
              <strong>Hands_Z1U2_Fig flawless</strong> (Uncommon, authored{" "}
              <code className="font-mono text-accent">row.ilevel</code> = 80): no level stamp &#x2192;
              branch 3 uses the authored static iLevel directly, so def = row_static = 80; + 10
              flawless = 90. The Uncommon rarity bonus is <strong>not</strong> applied here &mdash;
              because an authored <code className="font-mono text-accent">row.ilevel</code> is present
              it <em>is</em> the baseline (Uncommon&rsquo;s bonus is 0 anyway), so the rarity bonus
              never enters this calculation.
            </p>
          </div>
        </section>

        {/* 6. Edge Cases */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Edge Cases</h2>
          <div className="flex flex-col gap-4">
            <Callout tone="accent" icon="scroll">
              <strong>Empty slot:</strong> contributes nothing. Skip it entirely &mdash; do not treat
              an empty slot as iLevel 0. Including empty slots in an average would severely distort
              the result for partial loadouts.
            </Callout>

            <Callout tone="accent" icon="scroll">
              <strong>instance.level == 0:</strong> this is a sentinel, not a real level. Fall
              through to the row/required-level baseline (branch 3). Never multiply 0 by 10 and add
              it as if it were an explicit level stamp.
            </Callout>

            <Callout tone="warning" icon="lock">
              <strong>Unknown item id (not in CDB):</strong> iLevel is <em>undefined / None</em>,
              not 0. The catalog lookup fails; the only derivable field is the slot&rsquo;s{" "}
              <code className="font-mono text-xs">affix_factor</code>. Never substitute 0 for an
              unresolvable item &mdash; it would anchor the gear score at an unrealistically low value.
            </Callout>

            <Callout tone="accent" icon="sword">
              <strong>Secondary / arsenal weapon (Slot_Weapon2, content index 1):</strong> iLevel is
              FULL and unscaled. The 40% discount (
              <code className="font-mono text-xs">affix_factor 0.4</code>) lives on{" "}
              <code className="font-mono text-xs">Slot_Weapon2</code> specifically &mdash; the
              secondary/arsenal weapon slot at content index 1 &mdash; and applies to{" "}
              <em>stats only</em>, not to iLevel. Do not multiply iLevel by 0.4. The iLevel for a
              Slot_Weapon2 item feeds into a gear-score average at full value; it is the final stat
              application that discounts. Note this is a <em>different</em> slot from{" "}
              <code className="font-mono text-xs">Slot_OffhandWeapon</code> (content index 2), which
              carries no such discount.
            </Callout>

            <Callout tone="accent" icon="gauntlet">
              <strong>Enhancement star cap:</strong> clamp{" "}
              <code className="font-mono text-xs">upgrade_level</code> to 0&ndash;5 defensively.
              Per-rarity caps from the CDB are: Uncommon 2, Rare 3, Epic 4, Legendary 5 stars.
              Common items have no enhancement path.
            </Callout>
          </div>
        </section>

        {/* 7. Where Implementations Diverge */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Where Implementations Diverge</h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            Today only Farever Companion computes iLevel, so these are the decision points where any
            second tool would diverge from the standard if not careful. Each one is a source of silent
            inconsistency between independently-built implementations.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Decision point
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Correct behavior
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wide text-subtle">
                    Common mistake
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs">
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Off-hand 40% discount</td>
                  <td className="px-4 py-3 text-foreground/80">Applied to stats only</td>
                  <td className="px-4 py-3 text-muted">Multiply iLevel by 0.4</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Flawless and star bonuses</td>
                  <td className="px-4 py-3 text-foreground/80">Included in effective iLevel</td>
                  <td className="px-4 py-3 text-muted">Report only def_ilevel (no bonuses)</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Empty slots in aggregate</td>
                  <td className="px-4 py-3 text-foreground/80">Skipped entirely</td>
                  <td className="px-4 py-3 text-muted">Counted as iLevel 0 in the average</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Rarity override re-stamp</td>
                  <td className="px-4 py-3 text-foreground/80">Override discards row.ilevel; recomputes from scratch</td>
                  <td className="px-4 py-3 text-muted">Apply rarity bonus on top of row.ilevel</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Sentinel level == 0</td>
                  <td className="px-4 py-3 text-foreground/80">Treated as absent; fall back to row level</td>
                  <td className="px-4 py-3 text-muted">Treated as an explicit level stamp of 0</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Rounding</td>
                  <td className="px-4 py-3 text-foreground/80">
                    <code className="font-mono text-accent">floor(x + 0.5)</code> (Haxe Math.round)
                  </td>
                  <td className="px-4 py-3 text-muted">Truncation or banker&rsquo;s rounding</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-foreground/90">Cosmetic/utility slots in the gear-score aggregate</td>
                  <td className="px-4 py-3 text-foreground/80">Excluded from the proposed aggregate (Glider 28, Mount 29, consumables/bags 18&ndash;27)</td>
                  <td className="px-4 py-3 text-muted">Included in the aggregate</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 8. Proposed Gear Score Standard */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Recommended Standard: Per-Character Gear Score
          </h2>
          <p className="text-sm text-muted leading-relaxed mb-4">
            There is no native per-character gear score in Farever. The following is a{" "}
            <strong>proposed standard</strong> &mdash; not an official game metric. It is designed
            so that any tool adopting the formula verbatim lands on the same number as Farever
            Companion.
          </p>

          <div className="rounded-xl border border-border bg-surface overflow-hidden mb-6">
            <div className="flex items-center border-b border-border bg-surface-elevated px-4 py-2">
              <span className="font-mono text-xs text-subtle">gearScore (pseudocode)</span>
            </div>
            <pre className="overflow-auto p-4 font-mono text-xs text-foreground/80 leading-relaxed">{`def gearScore(loadout):
    # Weapons: content indices 0..=2 (Slot_Weapon1, Slot_Weapon2, Slot_OffhandWeapon)
    # Gear:    content indices 3..=17
    # Excluded FROM THIS AGGREGATE: consumables/bags (18..=27),
    #   Glider (28), Mount (29), empty/null slots.
    # NB: the shipping encounter log is broader — its map_live_gear
    #   excludes only 18..=27, so Glider/Mount DO serialize as gear
    #   pieces there. This aggregate drops them on purpose (no combat
    #   iLevel), so it filters tighter than the log.
    pieces = [ p for p in loadout
               if p.slot_index in range(0, 18)   # weapons + gear only
               and p is not empty ]

    scores = [ effectiveItemILevel(p) for p in pieces
               if effectiveItemILevel(p) is not None ]

    if scores is empty:
        return None  # undefined, not 0

    return floor( mean(scores) + 0.5 )  # arithmetic mean; round once at the end`}</pre>
          </div>

          <h3 className="text-base font-semibold mb-3 text-foreground/90">Rationale</h3>
          <ul className="flex flex-col gap-2 text-sm text-foreground/90 leading-relaxed list-disc list-inside">
            <li>
              <strong>Mean over occupied slots, not a fixed denominator</strong> &mdash; avoids
              penalizing partial loadouts where some slots are genuinely empty.
            </li>
            <li>
              <strong>Cosmetic/utility slots excluded from this aggregate</strong> &mdash; Glider
              (28), Mount (29), bags and consumables (18&ndash;27) carry no combat iLevel, so this
              proposed gear score drops them; including them would dilute the number on any character
              that equips them. This is stricter than the shipping encounter log, whose{" "}
              <code className="font-mono text-xs text-accent">map_live_gear</code> excludes only the
              consumable/bag range (18&ndash;27) and therefore still serializes Glider (28) and Mount
              (29) as gear pieces &mdash; the aggregate filters those out itself.
            </li>
            <li>
              <strong>Off-hand counted at full iLevel</strong> &mdash; the 0.4 stat discount is a
              stat-application factor, not a power-tier reduction. The item&rsquo;s iLevel represents its
              tier; its stat contribution is a separate question.
            </li>
            <li>
              <strong>Reuses the per-item formula verbatim</strong> &mdash; any adopting tool that
              feeds the same per-item iLevels into this aggregate will produce the same gear score.
            </li>
            <li>
              <strong>Round once at the end</strong> &mdash; rounding intermediate per-item values
              before averaging accumulates error. Round the final mean only.
            </li>
          </ul>

          <div className="mt-6">
            <Callout tone="accent" icon="scroll">
              An optional second number <strong>effectiveGearScore</strong> &mdash; identical but with
              Slot_Weapon2&rsquo;s iLevel multiplied by 0.4 before averaging &mdash; more closely tracks
              DPS contribution. <strong>gearScore (full)</strong> is the recommended headline number
              because it reflects item tier rather than slot efficiency.
            </Callout>
          </div>
        </section>

        {/* 9. Relationship to Encounter Log Schema */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Relationship to the Encounter Log Schema
          </h2>
          <p className="text-sm text-foreground/90 leading-relaxed">
            The published Encounter Log schema (v1) carries the per-item effective iLevel as the{" "}
            <code className="font-mono text-xs text-accent">ilevel</code> field on each{" "}
            <code className="font-mono text-xs text-accent">Weapon</code> and{" "}
            <code className="font-mono text-xs text-accent">GearPiece</code> object under{" "}
            <code className="font-mono text-xs text-accent">participants[]</code>. This page explains
            exactly how that field is derived. For the full schema definition, see the{" "}
            <Link
              href="/schemas"
              className="text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
            >
              Schemas
            </Link>{" "}
            page.
          </p>
        </section>

        {/* 10. Provenance & Confidence */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">Provenance &amp; Confidence</h2>
          <div className="flex flex-col gap-4">
            <Callout tone="accent" icon="shield">
              <div className="flex flex-col gap-2">
                <p>
                  <strong>High confidence &mdash; per-item formula.</strong> The iLevel formula,
                  constants, rounding behavior, and all worked examples on this page are
                  disassembly-verified against game bytecode (build 23472338) and locked by unit
                  tests in the Farever Companion source. A regression in any of these would break
                  CI before shipping.
                </p>
                <p>
                  <strong>Proposed standard &mdash; per-character gear score.</strong> There is no
                  native gear score equivalent in the game today. The aggregate formula above is a
                  recommendation designed to be consistent and unambiguous, not an official game
                  metric.
                </p>
                <p className="text-muted">
                  Not affiliated with Shiro Games.
                </p>
              </div>
            </Callout>
          </div>
        </section>

        {/* Back link */}
        <div className="pt-4 border-t border-border">
          <Link
            href="/schemas"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            &larr; Back to Schemas
          </Link>
        </div>
      </div>
    </div>
  );
}

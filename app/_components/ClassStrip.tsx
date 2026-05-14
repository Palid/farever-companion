const CLASSES = ["Warrior", "Mage", "Rogue", "Priest"] as const;

export function ClassStrip() {
  return (
    <div className="px-4 pb-8">
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-subtle text-center">
          All four classes supported
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {CLASSES.map((cls) => (
            <span
              key={cls}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-surface text-sm text-foreground font-mono"
            >
              <span className="text-accent select-none" aria-hidden>•</span>
              {cls}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

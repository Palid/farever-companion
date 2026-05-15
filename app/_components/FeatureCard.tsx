import { Icon, IconName } from "@/app/_components/Icon";
import { Screenshot } from "@/app/_components/Screenshot";

interface FeatureCardProps {
  icon: IconName;
  title: string;
  tagline: string;
  bullets: string[];
  screenshotSrc?: string;
  screenshotAlt: string;
  screenshotWidth?: number;
  screenshotHeight?: number;
}

export function FeatureCard({ icon, title, tagline, bullets, screenshotSrc, screenshotAlt, screenshotWidth = 600, screenshotHeight = 600 }: FeatureCardProps) {
  return (
    <article className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4 h-full">
      <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border-strong flex items-center justify-center">
        <Icon name={icon} className="w-5 h-5 text-accent" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="text-sm text-muted italic">{tagline}</p>
      <div className="border-t border-border my-2" />
      <ul className="space-y-2 text-sm text-foreground/90">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <span className="text-accent select-none" aria-hidden>›</span>
            {bullet}
          </li>
        ))}
      </ul>
      {screenshotSrc ? (
        <Screenshot
          src={screenshotSrc}
          alt={screenshotAlt}
          width={screenshotWidth}
          height={screenshotHeight}
          className="w-full h-auto rounded-md mt-auto"
        />
      ) : null}
    </article>
  );
}

import type { ReactNode } from "react";
import { Icon } from "@/app/_components/Icon";

type CalloutTone = "accent" | "warning";

interface CalloutProps {
  tone: CalloutTone;
  icon: string;
  className?: string;
  children: ReactNode;
}

const TONE_CLASSES: Record<CalloutTone, { box: string; icon: string }> = {
  accent: { box: "border-accent/50 bg-accent/10", icon: "text-accent" },
  warning: { box: "border-warning/50 bg-warning/10", icon: "text-warning" },
};

export function Callout({ tone, icon, className, children }: CalloutProps) {
  const toneClasses = TONE_CLASSES[tone];

  const boxClasses = [
    "rounded-lg border p-4 text-sm text-foreground/90 flex items-start gap-3",
    toneClasses.box,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={boxClasses}>
      <Icon name={icon} className={["w-4 h-4 mt-0.5 shrink-0", toneClasses.icon].join(" ")} />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

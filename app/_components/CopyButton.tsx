"use client";

import { useState } from "react";
import { Icon } from "@/app/_components/Icon";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Copy", className }: CopyButtonProps) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function handleClick() {
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        console.warn("CopyButton: clipboard.writeText failed");
      }
    } else {
      console.warn("CopyButton: navigator.clipboard unavailable");
    }
    setState("copied");
    setTimeout(() => setState("idle"), 1500);
  }

  return (
    <>
      <button
        type="button"
        data-state={state}
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${className ?? ""}`}
        aria-label={state === "copied" ? "Copied to clipboard" : label}
      >
        <Icon name="copy" className="w-3.5 h-3.5" />
        {state === "copied" ? "Copied" : label}
      </button>
      <span aria-live="polite" className="sr-only">
        {state === "copied" ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}

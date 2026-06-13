"use client";

import { useState } from "react";
import type { SchemaVersion } from "@/app/schemas/_data/schema-registry";
import { CopyButton } from "@/app/_components/CopyButton";
import { Icon } from "@/app/_components/Icon";

interface SchemaViewerProps {
  versions: SchemaVersion[];
}

export function SchemaViewer({ versions }: SchemaViewerProps) {
  const latest = versions.find((v) => v.isLatest) ?? versions[0];
  const [selected, setSelected] = useState<SchemaVersion>(latest);

  const prettyJson = JSON.stringify(selected.schema, null, 2);

  return (
    <div className="flex flex-col gap-8">
      {/* Version selector */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Schema version">
        {versions.map((v) => {
          const isActive = v.id === selected.id;
          return (
            <button
              key={v.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelected(v)}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border bg-surface text-muted hover:text-foreground hover:border-border-strong"
              }`}
            >
              {v.label}
              {v.isLatest && (
                <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground leading-none">
                  Latest
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Version metadata card */}
      <div className="rounded-xl border border-border bg-surface p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {selected.productName}{" "}
            <span className="text-accent">{selected.label}</span>
          </h2>
          <p className="text-sm text-muted">{selected.title}</p>
        </div>

        <p className="text-sm text-foreground/90">{selected.description}</p>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border bg-surface-elevated p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-subtle mb-1">
              Schema ID
            </dt>
            <dd className="font-mono text-xs text-muted break-all">{selected.schemaId}</dd>
          </div>
          <div className="rounded-lg border border-border bg-surface-elevated p-3">
            <dt className="text-xs font-medium uppercase tracking-wide text-subtle mb-1">
              Released
            </dt>
            <dd className="font-mono text-xs text-muted">
              <time dateTime={selected.releaseDate}>{selected.releaseDate}</time>
            </dd>
          </div>
        </dl>

        {/* Action links */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <a
            href={selected.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon name="external" className="w-3.5 h-3.5" />
            View raw
          </a>
          <a
            href={selected.url}
            download
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border border-border bg-surface text-muted hover:text-foreground hover:border-border-strong transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Icon name="download" className="w-3.5 h-3.5" />
            Download
          </a>
          <CopyButton value={prettyJson} label="Copy JSON" />
        </div>
      </div>

      {/* Schema body */}
      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-2">
          <span className="font-mono text-xs text-subtle">{selected.label}.json</span>
          <CopyButton value={prettyJson} label="Copy" />
        </div>
        <pre className="overflow-auto max-h-[28rem] p-4 font-mono text-xs text-foreground/80 leading-relaxed">
          {prettyJson}
        </pre>
      </div>
    </div>
  );
}

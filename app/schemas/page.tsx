import type { Metadata } from "next";
import Link from "next/link";
import { SCHEMA_VERSIONS } from "@/app/schemas/_data/schema-registry";
import { SchemaViewer } from "@/app/schemas/_components/SchemaViewer";
import { GITHUB_REPO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Schemas",
  description:
    "Machine-readable JSON Schemas (draft 2020-12) describing the encounter-log data produced by the Farever Companion DPS meter. Immutable, versioned, and served at /logs-schema/{version}.json.",
};

export default function SchemasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
      {/* Page header */}
      <header className="mb-12 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Schemas</h1>
        <p className="text-base text-muted leading-relaxed">
          These are the JSON Schemas (
          <a
            href="https://json-schema.org/draft/2020-12/schema"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            draft 2020-12
          </a>
          ) that describe the encounter-log data produced by the Farever Companion DPS meter.
          The newest version is selected by default and is the recommended target for new
          integrations. Versions are immutable and permanently served at{" "}
          <code className="font-mono text-sm text-accent">/logs-schema/&#123;version&#125;.json</code>.
          The source of truth lives in the{" "}
          <a
            href={`${GITHUB_REPO_URL}/tree/main/releases/encounter-log.schema.json`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:brightness-110 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded"
          >
            GitHub repository
          </a>
          .
        </p>
      </header>

      <SchemaViewer versions={SCHEMA_VERSIONS} />

      {/* Related documentation */}
      <div className="mt-12 max-w-3xl">
        <h2 className="text-lg font-semibold tracking-tight mb-4 text-foreground/90">
          Related documentation
        </h2>
        <div className="rounded-xl border border-border bg-surface p-5 flex items-start justify-between gap-4 hover:border-border-strong transition-colors">
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-sm font-medium text-foreground">How item level is calculated</p>
            <p className="text-sm text-muted leading-relaxed">
              The authoritative per-item iLevel formula, constants, worked examples, and the
              proposed per-character gear score standard. Explains where the{" "}
              <code className="font-mono text-xs text-accent">ilevel</code> field on each{" "}
              <code className="font-mono text-xs text-accent">Weapon</code> and{" "}
              <code className="font-mono text-xs text-accent">GearPiece</code> comes from.
            </p>
          </div>
          <Link
            href="/schemas/item-level"
            className="shrink-0 inline-flex items-center gap-1 text-sm font-medium text-accent hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded whitespace-nowrap"
          >
            Read &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

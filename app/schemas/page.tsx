import type { Metadata } from "next";
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
            href={`${GITHUB_REPO_URL}/blob/main/public/logs-schema/`}
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
    </div>
  );
}

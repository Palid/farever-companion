// Schema registry — single source of truth for all published encounter-log JSON schema versions.
// To add v2 later, import its JSON and prepend one entry to SCHEMA_VERSIONS (newest first).
//
// Example v2 addition:
//   import v2Schema from "@/public/logs-schema/v2.json";
//   { id: "v2", label: "v2", productName: "Encounter Log", title: v2Schema.title,
//     description: v2Schema.description, releaseDate: "2026-XX-XX",
//     url: "/logs-schema/v2.json", schemaId: "https://farevercompanion.com/logs-schema/v2.json",
//     schema: v2Schema, isLatest: true },
//   ...and flip v1's isLatest to false.

import v1Schema from "@/public/logs-schema/v1.json";

export interface SchemaVersion {
  /** Stable short id, matches the URL path segment (e.g. "v1"). */
  id: string;
  /** Human-readable label for the tab/selector (e.g. "v1"). */
  label: string;
  /** Product this schema describes. */
  productName: string;
  /** JSON Schema `title` field. */
  title: string;
  /** One-sentence description shown in the UI. */
  description: string;
  /** ISO 8601 date the schema was first published. */
  releaseDate: string;
  /** Root-relative public URL (served as a static file). */
  url: string;
  /** Canonical `$id` for the schema (its public URL). */
  schemaId: string;
  /** The parsed schema object — guaranteed identical to the served file. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Record<string, any>;
  /** True for the current recommended version. */
  isLatest: boolean;
}

// Ordered NEWEST FIRST so versions[0] is always the latest.
export const SCHEMA_VERSIONS: SchemaVersion[] = [
  {
    id: "v1",
    label: "v1",
    productName: "Encounter Log",
    title: v1Schema.title,
    description:
      "The canonical on-disk artifact for one closed encounter. Describes participants, combat events, and salvage metadata produced by the DPS meter.",
    releaseDate: "2026-06-13",
    url: "/logs-schema/v1.json",
    schemaId: "https://farevercompanion.com/logs-schema/v1.json",
    schema: v1Schema,
    isLatest: true,
  },
];

export const LATEST_VERSION: SchemaVersion =
  SCHEMA_VERSIONS.find((v) => v.isLatest) ?? SCHEMA_VERSIONS[0];

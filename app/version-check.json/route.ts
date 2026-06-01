import { RELEASE_CONFIG } from "@/lib/release";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    version: RELEASE_CONFIG.latestVersion,
    // `hash` is the SHA-256 of the dll (dinput8.dll), not the zip. The running
    // overlay can only self-verify against its own binary — it never sees the
    // download wrapper — so this is the dll hash (== the shipped current-hash).
    hash: RELEASE_CONFIG.dllSha256,
    date: RELEASE_CONFIG.releasedAt,
  });
}

import { RELEASE_CONFIG } from "@/lib/release";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    version: RELEASE_CONFIG.latestVersion,
    hash: RELEASE_CONFIG.sha256,
    date: RELEASE_CONFIG.releasedAt,
  });
}

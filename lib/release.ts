import { GITHUB_REPO_URL } from "@/lib/site";

export type Release = {
  latestVersion: string;
  tag: string;
  fileName: string;
  sha256: string;
  releasedAt: string;
  fileSizeBytes?: number;
  changelogUrl?: string;
};

export const RELEASE_CONFIG: Release = {
  latestVersion: "0.1.3",
  tag: "v0.1.3",
  fileName: "farever-companion-v0.1.3.zip",
  sha256: "1ad287c6ef50a9226dee995fe42fb3d2717c074c362d32d8beaf0252ff741a47",
  releasedAt: "2026-05-18",
  fileSizeBytes: 1371114,
};

export function releaseDownloadUrl(release: Release = RELEASE_CONFIG): string {
  return `${GITHUB_REPO_URL}/releases/download/${release.tag}/${release.fileName}`;
}

export function releaseNotesUrl(release: Release = RELEASE_CONFIG): string {
  return release.changelogUrl ?? `${GITHUB_REPO_URL}/releases/tag/${release.tag}`;
}

export const PLACEHOLDER_SHA256 = "0".repeat(64);

export function isPlaceholderRelease(release: Release = RELEASE_CONFIG): boolean {
  return release.sha256 === PLACEHOLDER_SHA256;
}

export function formatReleaseDate(iso: string): string {
  // Render as e.g. "May 14, 2026". Force UTC so the date matches the ISO string regardless of server TZ.
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatFileSize(bytes: number | undefined): string | null {
  if (bytes === undefined) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

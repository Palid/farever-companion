import { GITHUB_REPO_URL } from "@/lib/site";

export type Release = {
  latestVersion: string;
  tag: string;
  /** Name of the downloadable zip artifact. */
  fileName: string;
  /** SHA-256 of the .zip artifact — verifies the file you downloaded. */
  sha256: string;
  /** Name of the payload inside the zip that users copy into the game folder. */
  dllFileName: string;
  /** SHA-256 of {@link dllFileName} — verifies the binary you actually run.
   *  Equals the `current-hash` file shipped inside the zip. */
  dllSha256: string;
  releasedAt: string;
  fileSizeBytes?: number;
  changelogUrl?: string;
};

export const RELEASE_CONFIG: Release = {
  latestVersion: "0.1.6",
  tag: "v0.1.6",
  fileName: "farever-companion-v0.1.6.zip",
  sha256: "e0095a5535cab422c5fe88ef4dfb17dafd8721e4209e7998bd02d5c6d443ca00",
  dllFileName: "dinput8.dll",
  dllSha256: "6681e97da42b2484e507ac73b3a4b00313149c0c3b32559cad22206ec5b3ece9",
  releasedAt: "2026-06-01",
  fileSizeBytes: 2910623,
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

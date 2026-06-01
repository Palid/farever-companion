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
  latestVersion: "0.1.5",
  tag: "v0.1.5",
  fileName: "farever-companion-v0.1.5.zip",
  sha256: "9fda020c8011f5e7ea7eedac84ea75b878d4459afbf013b005a231ef2f4c231c",
  dllFileName: "dinput8.dll",
  dllSha256: "08fd9a7f10867f8e1aa916e1ce56d7ce23a04ffa5a297a6489cd4ea7dd15f34e",
  releasedAt: "2026-05-22",
  fileSizeBytes: 1524322,
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

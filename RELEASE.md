# Releasing Farever Companion

The marketing site (the Next.js app in this repo) is the canonical source for download links and SHA-256 verification. Releases are cut by:

1. Bumping `lib/release.ts` to point at the new version + hash
2. Committing + tagging + pushing
3. Attaching the built binary to a matching GitHub Release

The site automatically redeploys to GitHub Pages when `main` is pushed (see `.github/workflows/deploy.yml`), so the CTA flips to the new version as soon as steps 2 + 3 are done.

## One-shot release flow

```bash
# 0. Build the release artifact and drop it in ./releases/ (gitignored).
#    Example: ./releases/FareverCompanion-0.1.0.zip

# 1. Compute the SHA-256 (macOS / Linux):
shasum -a 256 FareverCompanion-0.1.0.zip
# Windows (PowerShell):
#   Get-FileHash .\FareverCompanion-0.1.0.zip -Algorithm SHA256

# 2. Note the file size in bytes:
wc -c FareverCompanion-0.1.0.zip

# 3. Edit lib/release.ts — set latestVersion, tag, fileName, sha256, releasedAt,
#    and fileSizeBytes. Example:
#
#      latestVersion: "0.1.0",
#      tag: "v0.1.0",
#      fileName: "FareverCompanion-0.1.0.zip",
#      sha256: "<lowercase 64-char hex from step 1>",
#      releasedAt: "2026-05-14",
#      fileSizeBytes: <bytes from step 2>,

# 4. Commit + tag + push:
git -c commit.gpgsign=false commit -am "release: v0.1.0"
git tag v0.1.0
git push
git push --tags

# 5. Create the GitHub Release with the asset attached:
gh release create v0.1.0 ./FareverCompanion-0.1.0.zip \
  --title "v0.1.0" \
  --notes "What changed in this release."
```

After step 5, GitHub Pages will redeploy the site (triggered by the push in step 4 via `.github/workflows/deploy.yml`), and the download CTA on farevercompanion.com will point at the new versioned URL.

## Verification contract — why we use versioned URLs

The download button on the site links to `https://github.com/Palid/farever-companion/releases/download/<tag>/<file>`. We do **not** use the rolling `/releases/latest/download/...` alias — the on-site SHA-256 is pinned to a specific binary, and a rolling URL could silently point at a newer asset between releases, breaking the verification story.

## Placeholder safety

While `RELEASE_CONFIG.sha256` is the 64-zero placeholder, the site CTA renders a non-interactive "Build pending — coming soon" state. The site is safe to deploy publicly before the first real release ships.

## If you ever revoke a release

If a release needs to be pulled (security issue, wrong asset, etc.):

1. Delete the GitHub Release (or mark it draft) so the download URL stops working.
2. Roll `lib/release.ts` back to a known-good version (or, if none exists, back to the all-zero placeholder).
3. Push. The site will redeploy and the CTA will reflect the rolled-back state.

Do **not** edit a release asset in place — the SHA-256 on the site is the canonical claim about what was published, and editing an asset breaks that claim invisibly.

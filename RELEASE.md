# Releasing Farever Companion

The marketing site (the Next.js app in this repo) is the canonical source for download links and SHA-256 verification. A release ties together:

- a versioned zip in `releases/farever-companion-v<version>.zip` (the binary users download)
- a changelog file in `releases/CHANGELOG-<version>.md` (prose only — what's actually new). The script appends an auto-generated "Download & verify" footer (asset link, version, date, size, SHA-256, verify commands, Windows Unblock instructions) before publishing, so the on-disk file should not contain that footer itself.
- a bump of `lib/release.ts` + `package.json` so the site CTA flips to the new version
- a matching `v<version>` git tag and GitHub Release with the zip attached

GitHub Pages redeploys automatically when `main` is pushed (see `.github/workflows/deploy.yml`), so the site updates within a minute of the release script finishing.

## The script does everything

```bash
# 1. Build the artifact and drop it in ./releases/
#    e.g. ./releases/farever-companion-v0.1.4.zip

# 2. Write ./releases/CHANGELOG-0.1.4.md — this is the release body on GitHub.

# 3. Run:
npm run release -- 0.1.4
```

The script (`scripts/release.mjs`) will:

1. Verify the zip and changelog exist for the given version.
2. Verify the working tree is clean, you're on `main`, you're up-to-date with `origin/main`, the tag doesn't already exist locally or on the remote, and `gh` is authenticated.
3. Compute SHA-256 + file size, set `releasedAt` to today (UTC).
4. Rewrite `RELEASE_CONFIG` in `lib/release.ts` and bump `package.json#version`.
5. Show the diff and prompt for confirmation (`--yes` to skip).
6. Commit (`release: v<version>`), tag, push branch and tag.
7. Build the GitHub release body: `CHANGELOG-<version>.md` + auto-generated "Download & verify" footer (asset link, version, date, size, SHA-256, verify commands, Windows Unblock instructions — all derived from the computed values, so they can never drift from `RELEASE_CONFIG`).
8. `gh release create <tag> ./releases/<file> --title <tag> --notes-file <tmp body>`

If you abort at the confirmation prompt, the script reverts `lib/release.ts` and `package.json` and exits cleanly. After the commit step, recovery is manual (see below).

### Flags

- `--yes` / `-y` — skip the confirmation prompt (use in CI or when you trust the diff).
- `--dry-run` — do everything up to the diff, then revert and exit. Nothing is committed.
- `--skip-push` — commit and tag locally but don't push or create the GitHub release. Prints the manual commands so you can finish by hand.

## Verification contract — why we use versioned URLs

The download button on the site links to `https://github.com/Palid/farever-companion/releases/download/<tag>/<file>`. We do **not** use the rolling `/releases/latest/download/...` alias — the on-site SHA-256 is pinned to a specific binary, and a rolling URL could silently point at a newer asset between releases, breaking the verification story.

## Placeholder safety

While `RELEASE_CONFIG.sha256` is the 64-zero placeholder, the site CTA renders a non-interactive "Build pending — coming soon" state and the "Changelog" link is hidden. The site is safe to deploy publicly before the first real release ships.

## If a release goes wrong

**Aborted at the confirmation prompt:** the script already restored `lib/release.ts` and `package.json`. Nothing to do.

**Failed after the commit but before the push:**

```bash
git tag -d v<version>           # drop the local tag
git reset --hard HEAD~1         # drop the release commit (you'll lose the bump)
```

**Failed during `gh release create` (tag was already pushed):** finish the release manually — the tag is the canonical thing the site keys off of:

```bash
gh release create v<version> ./releases/farever-companion-v<version>.zip \
  --title "v<version>" \
  --notes-file ./releases/CHANGELOG-<version>.md
```

## If you ever revoke a release

If a release needs to be pulled (security issue, wrong asset, etc.):

1. Delete the GitHub Release (or mark it draft) so the download URL stops working.
2. Roll `lib/release.ts` back to a known-good version (or, if none exists, back to the all-zero placeholder) and bump `package.json` accordingly.
3. Push. The site will redeploy and the CTA will reflect the rolled-back state.

Do **not** edit a release asset in place — the SHA-256 on the site is the canonical claim about what was published, and editing an asset breaks that claim invisibly.

# releases/

Drop built release artifacts in this directory before cutting a GitHub Release:

- `farever-companion-v<version>.zip` — the binary asset attached to the release
- `CHANGELOG-<version>.md` — prose-only changelog. The release script appends an
  auto-generated "Download & verify" footer (asset link, version, date, size,
  SHA-256, verify commands, Windows Unblock instructions) before publishing,
  so do not include that footer in the file itself. The combined body is what
  users see when they click "what's changed" / "Changelog" on
  farevercompanion.com.

The contents of this folder are gitignored — only this README is tracked. The
release flow that consumes these files lives in [`../RELEASE.md`](../RELEASE.md).

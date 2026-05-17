# releases/

Drop built release artifacts in this directory before cutting a GitHub Release:

- `farever-companion-v<version>.zip` — the binary asset attached to the release
- `CHANGELOG-<version>.md` — the GitHub Release *body* for that version (passed
  to `gh release create --notes-file`). This is what users see when they click
  "what's changed" / "Changelog" on farevercompanion.com.

The contents of this folder are gitignored — only this README is tracked. The
release flow that consumes these files lives in [`../RELEASE.md`](../RELEASE.md).

#!/usr/bin/env node
// Cuts a release: validates inputs, hashes the artifact, bumps lib/release.ts
// and package.json, commits + tags + pushes, and creates the GitHub release
// with releases/CHANGELOG-<version>.md as the release body.
//
// Usage:  npm run release -- <version> [--yes] [--dry-run] [--skip-push]

import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  readFileSync,
  writeFileSync,
  statSync,
  createReadStream,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { createHash } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output, exit } from "node:process";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import path from "node:path";

const GITHUB_REPO_URL = "https://github.com/Palid/farever-companion";
const SITE_URL = "https://farevercompanion.com";
const SITE_DOMAIN = "farevercompanion.com";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RELEASE_TS = path.join(REPO_ROOT, "lib", "release.ts");
const PACKAGE_JSON = path.join(REPO_ROOT, "package.json");

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith("-")));
const positional = args.filter((a) => !a.startsWith("-"));
const opts = {
  yes: flags.has("--yes") || flags.has("-y"),
  dryRun: flags.has("--dry-run"),
  skipPush: flags.has("--skip-push"),
};

const version = positional[0];
if (!version) die(`usage: npm run release -- <version> [--yes] [--dry-run] [--skip-push]`);
if (!/^\d+\.\d+\.\d+$/.test(version)) die(`bad version "${version}" — expected x.y.z`);

const tag = `v${version}`;
const fileName = `farever-companion-${tag}.zip`;
const zipPath = path.join(REPO_ROOT, "releases", fileName);
const changelogPath = path.join(REPO_ROOT, "releases", `CHANGELOG-${version}.md`);

// The payload users copy into their game folder, and the hash file the zip
// ships so users (and the running overlay) can verify that exact binary.
const DLL_FILE_NAME = "dinput8.dll";
const HASH_FILE_NAME = "current-hash";
const README_FILE_NAME = "README.txt";

// ── Preflight ────────────────────────────────────────────────────────────────
step("Preflight");

if (!existsSync(zipPath)) die(`missing release artifact: ${rel(zipPath)}`);
ok(`found ${rel(zipPath)}`);

if (!existsSync(changelogPath)) die(`missing changelog: ${rel(changelogPath)}`);
ok(`found ${rel(changelogPath)}`);

const branch = capture("git", ["rev-parse", "--abbrev-ref", "HEAD"]);
if (branch !== "main") die(`current branch is "${branch}", expected "main"`);
ok(`on branch main`);

const dirty = capture("git", ["status", "--porcelain"]);
if (dirty) die(`working tree has uncommitted changes:\n${dirty}`);
ok(`working tree clean`);

run("git", ["fetch", "--quiet", "--tags", "origin"]);

if (capture("git", ["rev-parse", "--verify", "--quiet", `refs/tags/${tag}`], { allowFail: true })) {
  die(`tag ${tag} already exists locally`);
}
if (capture("git", ["ls-remote", "--tags", "origin", `refs/tags/${tag}`])) {
  die(`tag ${tag} already exists on origin`);
}
ok(`tag ${tag} is available`);

const behind = capture("git", ["rev-list", "--count", "HEAD..@{u}"], { allowFail: true });
if (behind && Number.parseInt(behind, 10) > 0) {
  die(`local main is behind origin by ${behind} commit(s) — pull first`);
}
ok(`up-to-date with origin/main`);

if (spawnSync("gh", ["auth", "status"], { stdio: "ignore" }).status !== 0) {
  die(`gh CLI not authenticated — run "gh auth login" first`);
}
ok(`gh CLI authenticated`);

if (spawnSync("unzip", ["-v"], { stdio: "ignore" }).status !== 0) {
  die(`"unzip" not found on PATH — required to inspect and verify the artifact`);
}
ok(`unzip available`);

// ── Inspect + hash artifact ───────────────────────────────────────────────────
// The artifact is a zip containing the dll, a README, a current-hash file and
// font licenses. We verify that structure, then derive TWO hashes:
//   • sha256     — of the .zip, for download integrity
//   • dllSha256  — of the dll inside, recomputed and checked against the
//                  shipped current-hash, for the binary users actually run.
step("Inspecting artifact");
const dllSha256 = inspectArtifact(zipPath);
ok(`structure valid — contains ${DLL_FILE_NAME}, ${HASH_FILE_NAME}, ${README_FILE_NAME}`);
ok(`${DLL_FILE_NAME} matches shipped ${HASH_FILE_NAME}`);

const sha256 = await sha256OfFile(zipPath);
const fileSizeBytes = statSync(zipPath).size;
const releasedAt = new Date().toISOString().slice(0, 10);
info(`zip sha256:  ${sha256}`);
info(`dll sha256:  ${dllSha256}`);
info(`size:        ${fileSizeBytes} bytes (${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)`);
info(`date:        ${releasedAt}`);

// ── Rewrite lib/release.ts + package.json ────────────────────────────────────
step("Updating release config");

const releaseTsBefore = readFileSync(RELEASE_TS, "utf8");
const newConfig =
  `export const RELEASE_CONFIG: Release = {\n` +
  `  latestVersion: "${version}",\n` +
  `  tag: "${tag}",\n` +
  `  fileName: "${fileName}",\n` +
  `  sha256: "${sha256}",\n` +
  `  dllFileName: "${DLL_FILE_NAME}",\n` +
  `  dllSha256: "${dllSha256}",\n` +
  `  releasedAt: "${releasedAt}",\n` +
  `  fileSizeBytes: ${fileSizeBytes},\n` +
  `};`;
const releaseTsAfter = releaseTsBefore.replace(
  /export const RELEASE_CONFIG: Release = \{[\s\S]*?\n\};/,
  newConfig,
);
if (releaseTsAfter === releaseTsBefore) {
  die(`could not find RELEASE_CONFIG block in ${rel(RELEASE_TS)}`);
}
writeFileSync(RELEASE_TS, releaseTsAfter);
ok(`${rel(RELEASE_TS)} updated`);

const pkgBefore = readFileSync(PACKAGE_JSON, "utf8");
const pkg = JSON.parse(pkgBefore);
pkg.version = version;
const pkgAfter = JSON.stringify(pkg, null, 2) + "\n";
writeFileSync(PACKAGE_JSON, pkgAfter);
ok(`${rel(PACKAGE_JSON)} version bumped to ${version}`);

// ── Preview ──────────────────────────────────────────────────────────────────
step("Diff");
run("git", ["--no-pager", "diff", "--", "lib/release.ts", "package.json"]);

if (opts.dryRun) {
  console.log("\n[dry-run] Stopping before commit/push/release. Reverting changes.");
  run("git", ["checkout", "--", "lib/release.ts", "package.json"]);
  exit(0);
}

if (!opts.yes) {
  const rl = createInterface({ input, output });
  const answer = (
    await rl.question(`\nProceed with commit + tag + push + GitHub release for ${tag}? [y/N] `)
  )
    .trim()
    .toLowerCase();
  rl.close();
  if (answer !== "y" && answer !== "yes") {
    console.log("Aborted. Reverting changes.");
    run("git", ["checkout", "--", "lib/release.ts", "package.json"]);
    exit(1);
  }
}

// ── Commit + tag + push ──────────────────────────────────────────────────────
step("Committing");
run("git", ["add", "lib/release.ts", "package.json"]);
run("git", ["-c", "commit.gpgsign=false", "commit", "-m", `release: ${tag}`]);
ok(`committed`);

step("Tagging");
run("git", ["tag", tag]);
ok(`tagged ${tag}`);

if (opts.skipPush) {
  console.log(`\n[--skip-push] Skipping push and GitHub release. To finish manually:`);
  console.log(`  git push && git push origin ${tag}`);
  console.log(`  gh release create ${tag} ${rel(zipPath)} --title "${tag}" --notes-file ${rel(changelogPath)}`);
  exit(0);
}

step("Pushing");
run("git", ["push"]);
run("git", ["push", "origin", tag]);
ok(`pushed branch + tag`);

// ── GitHub release ───────────────────────────────────────────────────────────
step(`Creating GitHub release ${tag}`);

// Build the release body: the user's prose changelog + an auto-generated
// "Download & verify" footer derived from the values we just computed. The
// footer never lives on disk — it's always regenerated from the binary, so
// it can't drift from RELEASE_CONFIG.
const notesBody = readFileSync(changelogPath, "utf8").trimEnd() + "\n\n" + buildFooter() + "\n";
const tmpDir = mkdtempSync(path.join(tmpdir(), "farever-release-"));
const notesFile = path.join(tmpDir, `release-notes-${tag}.md`);
writeFileSync(notesFile, notesBody);

const ghResult = spawnSync(
  "gh",
  ["release", "create", tag, zipPath, "--title", tag, "--notes-file", notesFile],
  { cwd: REPO_ROOT, stdio: "inherit" },
);

if (ghResult.status !== 0) {
  // Leave notesFile in place so the user can retry against the same body
  // (with the auto-generated footer intact). Tag is already pushed.
  die(
    `gh release create failed — tag is pushed but the release was not created. Retry with:\n` +
      `  gh release create ${tag} ${rel(zipPath)} --title "${tag}" --notes-file ${notesFile}`,
  );
}

try {
  rmSync(tmpDir, { recursive: true, force: true });
} catch {
  // best-effort cleanup — temp dir leaking is fine
}

console.log(
  `\nDone. https://github.com/Palid/farever-companion/releases/tag/${tag}\n` +
    `GitHub Pages will redeploy shortly and the site CTA will flip to ${tag}.`,
);

// ── helpers ──────────────────────────────────────────────────────────────────
function die(msg) {
  console.error(`✗ ${msg}`);
  exit(1);
}
function ok(msg) {
  console.log(`✓ ${msg}`);
}
function info(msg) {
  console.log(`  ${msg}`);
}
function step(msg) {
  console.log(`\n→ ${msg}`);
}
function rel(p) {
  return path.relative(REPO_ROOT, p) || p;
}
function run(cmd, argv) {
  execFileSync(cmd, argv, { cwd: REPO_ROOT, stdio: "inherit" });
}
function capture(cmd, argv, { allowFail = false } = {}) {
  try {
    return execFileSync(cmd, argv, { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  } catch (err) {
    if (allowFail) return "";
    throw err;
  }
}
function buildFooter() {
  const sizeMb = (fileSizeBytes / (1024 * 1024)).toFixed(2);
  const sizeBytes = fileSizeBytes.toLocaleString("en-US");
  const downloadUrl = `${GITHUB_REPO_URL}/releases/download/${tag}/${fileName}`;
  return [
    "---",
    "",
    "## Download & verify",
    "",
    `Only download from [${SITE_DOMAIN}](${SITE_URL}). Anything claiming to be Farever Companion that doesn't match the SHA-256 hashes below is not ours — don't run it.`,
    "",
    "There are two hashes: one for the **`.zip` you download**, and one for the **`" +
      DLL_FILE_NAME +
      "` you copy into your game folder**. The dll hash also ships inside the zip as a `" +
      HASH_FILE_NAME +
      "` file.",
    "",
    "| | |",
    "| --- | --- |",
    `| **Asset** | [\`${fileName}\`](${downloadUrl}) |`,
    `| **Version** | \`${version}\` |`,
    `| **Released** | ${releasedAt} |`,
    `| **Size** | ${sizeMb} MB (${sizeBytes} bytes) |`,
    `| **SHA-256 (zip)** | \`${sha256}\` |`,
    `| **SHA-256 (${DLL_FILE_NAME})** | \`${dllSha256}\` |`,
    "",
    "### 1. Verify the download (the `.zip`)",
    "",
    "Windows (PowerShell), run in the folder where you saved the file:",
    "",
    "```powershell",
    `Get-FileHash .\\${fileName} -Algorithm SHA256`,
    "```",
    "",
    "macOS / Linux:",
    "",
    "```bash",
    `shasum -a 256 ${fileName}`,
    "```",
    "",
    "The output's `Hash` value must match **SHA-256 (zip)** above, character for character. If it doesn't, delete the file.",
    "",
    `### 2. Verify the binary (\`${DLL_FILE_NAME}\`) after extracting`,
    "",
    `Once you've extracted the zip, verify \`${DLL_FILE_NAME}\` before copying it into your Farever folder. Run this in the extracted folder:`,
    "",
    "```powershell",
    `Get-FileHash .\\${DLL_FILE_NAME} -Algorithm SHA256`,
    "```",
    "",
    "macOS / Linux:",
    "",
    "```bash",
    `shasum -a 256 ${DLL_FILE_NAME}`,
    "```",
    "",
    `The output must match **SHA-256 (${DLL_FILE_NAME})** above — which is also the value in the bundled \`${HASH_FILE_NAME}\` file. If it doesn't, don't run it.`,
    "",
    "### Windows users — please do this before extracting",
    "",
    "Right-click the downloaded `.zip` → **Properties** → tick the **Unblock** checkbox at the bottom of the General tab → **OK**. *Then* extract. If you skip this step, Windows may falsely demand admin rights when you copy `dinput8.dll` into your Farever folder, and even granting admin can fail with an \"unspecified error\". Already extracted and stuck? Either delete and re-extract after unblocking, or open PowerShell in the extracted folder and run:",
    "",
    "```powershell",
    "Get-ChildItem -Recurse | Unblock-File",
    "```",
  ].join("\n");
}

async function sha256OfFile(filePath) {
  const hash = createHash("sha256");
  await new Promise((resolve, reject) => {
    createReadStream(filePath)
      .on("data", (chunk) => hash.update(chunk))
      .on("end", resolve)
      .on("error", reject);
  });
  return hash.digest("hex");
}

// Inspect the release zip: enforce the expected structure, guard against the
// double-zip packaging bug (v0.1.3–v0.1.5), and verify the dll matches its
// shipped current-hash. Returns the dll's SHA-256 (lowercase hex).
function inspectArtifact(zip) {
  const files = zipEntries(zip).filter((e) => !e.endsWith("/"));

  // The bug shipped 3× was a zip whose only entry was another zip of the same
  // name. Catch any single nested-zip artifact before it can be published.
  if (files.length === 1 && /\.zip$/i.test(files[0])) {
    die(
      `artifact is double-zipped — its only entry is "${files[0]}".\n` +
        `  Re-package so the zip contains ${DLL_FILE_NAME}, ${HASH_FILE_NAME} and ${README_FILE_NAME} ` +
        `directly (not a nested .zip).`,
    );
  }

  const missing = [DLL_FILE_NAME, HASH_FILE_NAME, README_FILE_NAME].filter((n) => !files.includes(n));
  if (missing.length) {
    die(
      `artifact is missing required entr${missing.length === 1 ? "y" : "ies"}: ${missing.join(", ")}.\n` +
        `  Found: ${files.join(", ") || "(nothing)"}`,
    );
  }

  // Recompute the dll hash from the bytes inside the zip and check it against
  // the shipped current-hash. A mismatch means a broken or stale packaging step.
  const dllSha256 = createHash("sha256").update(readZipEntry(zip, DLL_FILE_NAME)).digest("hex");
  const embedded = readZipEntry(zip, HASH_FILE_NAME).toString("utf8").trim().toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(embedded)) {
    die(`${HASH_FILE_NAME} inside the zip is not a SHA-256 hex string: "${embedded}"`);
  }
  if (embedded !== dllSha256) {
    die(
      `${DLL_FILE_NAME} does not match the shipped ${HASH_FILE_NAME} — the artifact is inconsistent:\n` +
        `  ${HASH_FILE_NAME}:        ${embedded}\n` +
        `  actual ${DLL_FILE_NAME}: ${dllSha256}\n` +
        `  Do not release it.`,
    );
  }
  return dllSha256;
}

// List entries in a zip, one path per line (`unzip -Z1` = zipinfo short form).
// Directory members come back with a trailing slash.
function zipEntries(zip) {
  return execFileSync("unzip", ["-Z1", zip], {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  })
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Read a single zip entry's raw bytes to a Buffer (`unzip -p` → stdout).
function readZipEntry(zip, entry) {
  return execFileSync("unzip", ["-p", zip, entry], {
    cwd: REPO_ROOT,
    maxBuffer: 256 * 1024 * 1024,
  });
}

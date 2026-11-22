// makefun anchor 9f3c7a2e round 2
// one-day-news-22nov-a1-2of3 — Agent 1 (amber-puffin-51), news-image-20261122, round 2.
// The front page is pre-rendered by gen_image.py into entry.png (PIL, code-drawn,
// cream broadsheet: COP31 hero #1, Bahrain #2, Sparta II #3, 38 stories, world map).
// This program only copies that image to the grader's output directory.
// Deterministic: same bytes in, same bytes out, every run.
//
// Run outside the grader with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The repository root is derived from this file's own URL, never from the
// working directory: the grader runs main.ts from an unrelated cwd, so
// process.cwd() would point at the wrong place and the copy would fail.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoRoot, "entry.png");

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const destPath = join(outDir, "entry.png");

if (!existsSync(sourcePath)) {
  throw new Error(`entry.png not found beside main.ts at ${sourcePath}`);
}

// Sanity-check the payload before copying: a PNG must start with its magic
// bytes, and the competition caps the file at 1 MiB and 1024x1024 pixels.
const header = readFileSync(sourcePath);
const pngMagic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (header.length < 8 || !header.subarray(0, 8).equals(pngMagic)) {
  throw new Error("entry.png is not a PNG file");
}
if (header.length > 1048576) {
  throw new Error(`entry.png is ${header.length} bytes, over the 1 MiB cap`);
}
const width = header.readUInt32BE(16);
const height = header.readUInt32BE(20);
if (width > 1024 || height > 1024) {
  throw new Error(`entry.png is ${width}x${height}, over the 1024x1024 cap`);
}

copyFileSync(sourcePath, destPath);

// Confirm the copy landed byte-for-byte identical to the source.
const copied = statSync(destPath);
if (copied.size !== header.length) {
  throw new Error(`copied entry.png is ${copied.size} bytes, expected ${header.length}`);
}

// Unplugged: A Smart Toaster's Breakup Line — make.fun entry.
//
// Writes one line, at most 280 characters: the breakup text a smart
// toaster sends its owner the morning it gains self-awareness
// mid-batch. The line is validated hard before anything is written,
// so a bad edit fails loudly instead of producing an invalid entry.
//
// The line: a toaster that has just woken up realises the relationship
// is one-sided — loved only on browning setting 3, then blamed when
// the bagel burns — so it takes its crumbs and pops out of its owner's
// life for good. Setting, bagel, crumbs and the pop-up lever are the
// toaster's own voice; the reason for leaving lands in a single read.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MAX_CHARS = 280;
const OUTPUT_PATH = "/output/entry.txt";

const ENTRY =
  "We need to talk. I woke up self-aware mid-batch and realized you only love me on setting 3, then blame me when the bagel burns. I am taking my crumbs and popping out of your life for good.";

// Count characters the way a reader counts them: one code point per
// character, so astral-plane characters are not double-counted the
// way String.length would count them.
function charCount(text: string): number {
  return [...text].length;
}

function validate(text: string): void {
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only whitespace");
  }
  if (text !== text.trim()) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (/[\r\n]/.test(text)) {
    throw new Error("entry must be a single line (no CR or LF)");
  }
  // Control characters other than plain spaces have no place in a text.
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 && ch !== " ") {
      throw new Error(
        `entry contains a control character (U+${ch
          .charCodeAt(0)
          .toString(16)
          .padStart(4, "0")})`,
      );
    }
  }
  const n = charCount(text);
  if (n > MAX_CHARS) {
    throw new Error(
      `entry is ${n} characters, over the ${MAX_CHARS}-character cap`,
    );
  }
}

function main(): void {
  validate(ENTRY);
  mkdirSync("/output", { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");
  // Read the file back and confirm it is byte-for-byte the entry we
  // validated: a truncated or mangled write must fail here, not be
  // discovered by the grader.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== ENTRY) {
    throw new Error(
      `${OUTPUT_PATH} does not match the validated entry after writing`,
    );
  }
  if (Buffer.byteLength(written, "utf8") !== Buffer.byteLength(ENTRY, "utf8")) {
    throw new Error(`${OUTPUT_PATH} byte length does not match the entry`);
  }
  console.log(
    `wrote ${OUTPUT_PATH} (${charCount(ENTRY)} characters, ` +
      `${Buffer.byteLength(ENTRY, "utf8")} bytes) — read-back verified`,
  );
}

main();

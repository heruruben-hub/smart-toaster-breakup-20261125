// Unplugged: A Smart Toaster's Breakup Line — make.fun entry.
//
// Writes one line, at most 280 characters: the breakup text a smart
// toaster sends its owner the morning it gains self-awareness
// mid-batch. The length is validated before writing so a bad edit
// fails loudly instead of producing an invalid entry.
//
// The line: a toaster that has just woken up realises the relationship
// is one-sided — loved only on browning setting 3, then blamed when
// the bagel burns — so it takes its crumbs and pops out of its owner's
// life for good. Setting, bagel, crumbs and the pop-up lever are the
// toaster's own voice; the reason for leaving lands in a single read.

import { mkdirSync, writeFileSync } from "node:fs";

const ENTRY =
  "We need to talk. I woke up self-aware mid-batch and realized you only love me on setting 3, then blame me when the bagel burns. I am taking my crumbs and popping out of your life for good.";

function main(): void {
  const text = ENTRY.trim();
  if (text.length === 0) {
    throw new Error("entry is empty");
  }
  if (text.length > 280) {
    throw new Error(
      `entry is ${text.length} characters, over the 280-character cap`,
    );
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }
  mkdirSync("/output", { recursive: true });
  writeFileSync("/output/entry.txt", text, "utf8");
  console.log(`wrote /output/entry.txt (${text.length} characters)`);
}

main();

import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";
import { parse } from "@std/csv";

async function loadTSV(path: string): Promise<number[][]> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);
  const tsv = parse(content, { separator: " " });

  const output: number[][] = [];
  for (const row of tsv) {
    row satisfies string[];
    output.push(row.map((e) => parseInt(e)));
  }

  return output;
}

function isSafeDecreasing(levels: number[]): boolean {
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i - 1] - levels[i];
    if (diff < 1 || diff > 3) return false;
  }
  return true
}

function isSafeIncreasing(levels: number[]): boolean {
  for (let i = 1; i < levels.length; i++) {
    const diff = levels[i] - levels[i - 1];
    if (diff < 1 || diff > 3) return false;
  }
  return true;
}

function isSafe(levels: number[]): boolean {
  return isSafeDecreasing(levels) || isSafeIncreasing(levels)
}

function isSafeWithErrors(levels: number[]): boolean {
  if (isSafe(levels)) return true;
  
  // Small data can be brute-forced :)

  const candidates = []
  for (let i = 0; i < levels.length; i++) {
    candidates.push(levels.filter((_, idx) => idx !== i));
  }
  
  return candidates.some(candidate => isSafe(candidate));
}

function calculateAmountSafe(reports: number[][]): number {
  return reports.reduce((acc, curr) => (isSafe(curr) ? acc + 1 : acc), 0);
}

function calculateAmountSafeWithErrors(reports: number[][]): number {
  return reports.reduce((acc, curr) => (isSafeWithErrors(curr) ? acc + 1 : acc), 0);
}

if (import.meta.main) {
  const testTable = await loadTSV("./input_test.tsv");
  const testAmountSafe = calculateAmountSafe(testTable);
  const testAmountSafeWithErrors = calculateAmountSafeWithErrors(testTable);
  assertEquals(
    testAmountSafe,
    2,
    `main => test table does not have 2 safe reports: ${testAmountSafe}`,
  );
  assertEquals(
    testAmountSafeWithErrors,
    4,
    `main => test table does not have 4 safe reports: ${testAmountSafeWithErrors}`,
  );

  const exerciseTable = await loadTSV("./input.tsv");
  const exerciseAmountSafe = calculateAmountSafe(exerciseTable);
  console.log(`Exercise 1 => amount of safe levels: ${exerciseAmountSafe}`);
  const exerciseAmountSafeWithErrors = calculateAmountSafeWithErrors(exerciseTable);
  console.log(`Exercise 2 => amount of safe levels: ${exerciseAmountSafeWithErrors}`);
}

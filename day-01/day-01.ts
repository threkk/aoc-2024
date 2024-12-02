import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";
import { parse } from "@std/csv";

async function loadTSV(path: string): Promise<number[][]> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);
  const tsv = parse(content, { separator: "   " });

  const output: number[][] = [[], []];
  for (const row of tsv) {
    row satisfies string[];
    for (let i = 0; i < row.length; i++) {
      output[i].push(parseInt(row[i]));
    }
  }

  return output;
}

function calculateDistance(table: number[][]): number {
  let distance = 0;
  const left = [...table[0]];
  const right = [...table[1]];
  left.sort();
  right.sort();
  assertEquals(
    left.length,
    right.length,
    `calculateDistance => left and right list have different length: ${left.length} ${right.length}`,
  );
  for (let i = 0; i < left.length; i++) {
    distance += Math.abs(left[i] - right[i]);
  }

  return distance;
}

function calculateSimilarity(table: number[][]): number {
  let similarity = 0;
  const left = [...table[0]];
  const right = [...table[1]];

  assertEquals(
    left.length,
    right.length,
    `calculateDistance => left and right list have different length: ${left.length} ${right.length}`,
  );

  for (const item of left) {
    similarity += item * right.filter((n) => n === item).length;
  }

  return similarity;
}

if (import.meta.main) {
  const testTable = await loadTSV("./input_test.tsv");
  const testDistance = calculateDistance(testTable);
  const testSimilarity = calculateSimilarity(testTable);
  assertEquals(
    testDistance,
    11,
    `main => test table does not have distance 11: ${testDistance}`,
  );
  assertEquals(
    testSimilarity,
    31,
    `main => test table does not have similarity 31: ${testSimilarity}`,
  );

  const exerciseTable = await loadTSV("./input.tsv");
  const exerciseDistance = calculateDistance(exerciseTable);
  console.log(`Exercise 1 => output distance: ${exerciseDistance}`);
  const exerciseSimilarity = calculateSimilarity(exerciseTable);
  console.log(`Exercise 2 => output similarity: ${exerciseSimilarity}`);
}

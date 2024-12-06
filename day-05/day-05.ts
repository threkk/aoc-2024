import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";

type Rule = {
  lower: number;
  higher: number;
};

type Update = number[];
type Program = {
  rules: Rule[];
  updates: Update[];
};

function isSorted(rules: Rule[], update: Update): boolean {
  for (let i = 0; i < update.length; i++) {
    const valueChecked = update[i];
    const rulesToCheck = rules.filter((rule) => rule.lower === valueChecked);
    const rulesChecked = rulesToCheck.map((ruleToCheck) => {
      for (let j = i; j >= 0; j--) {
        const valueToCheck = update[j];
        if (valueToCheck === ruleToCheck.higher) return false;
      }

      return true;
    });

    if (rulesChecked.some((r) => !r)) return false;
  }
  return true;
}

// function sort(rules: Rule, update: Update): Update {
//
// }
//
async function loadInput(path: string): Promise<Program> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);
  const [rulesRaw, inputRaw] = content.split("\n\n");
  const rules = rulesRaw.split("\n").map((r) => {
    const [lower, higher] = r.split("|");
    return { lower: parseInt(lower), higher: parseInt(higher) } satisfies Rule;
  });
  const updates = inputRaw
    .split("\n")
    .map((i) => i.split(",").map((v) => parseInt(v)));

  return {
    rules,
    updates,
  };
}

function exerciseOne(program: Program): number {
  let counter = 0;

  for (const update of program.updates) {
    if (update.length === 1) continue;
    if (isSorted(program.rules, update)) {
      const value = update[Math.floor(update.length / 2)];
      counter += value;
    }
  }

  return counter;
}

if (import.meta.main) {
  const program = await loadInput("./input_test.txt");

  const testExerciseOne = exerciseOne(program);
  assertEquals(
    testExerciseOne,
    143,
    `main => Program does not return 143: ${testExerciseOne}`,
  );
  // const testExerciseTwo = exerciseTwo(testLetters);
  // assertEquals(
  //   testExerciseTwo,
  //   9,
  //   `main => Program does not return 9: ${testExerciseTwo}`,
  // );
  const exerciseProgram = await loadInput("./input.txt");
  const exerciseExerciseOne = exerciseOne(exerciseProgram);
  console.log(`Exercise 1 => program output: ${exerciseExerciseOne}`);

  // const exerciseExerciseTwo = exerciseTwo(exerciseTable);
  // console.log(`Exercise 2 => fixed program output: ${exerciseExerciseTwo}`);
}

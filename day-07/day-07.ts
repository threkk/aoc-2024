import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";

type Operation = {
  result: number;
  operators: number[];
};

type Program = Operation[];

async function loadInput(path: string): Promise<Program> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);

  const out = [];
  for (const line of content.split("\n")) {
    if (!line) continue;
    const [result, operatorsRaw] = line.split(":");
    const operators = operatorsRaw
      .split(" ")
      .map((op: string) => parseInt(op.trim()))
      .filter((e) => !isNaN(e));
    out.push({
      result: parseInt(result),
      operators,
    });
  }

  return out;
}

function combine(acc: number, operators: number[]): number[] {
  const [op, ...ops] = operators;
  if (!op) return [acc];
  return [combine(acc + op, ops), combine(acc * op, ops)].flat();
}

function exerciseOne(program: Program): number {
  let counter = 0;
  for (const operation of program) {
    const [op, ...ops] = operation.operators;
    const results = combine(op, ops);
    if (results.some((result) => result === operation.result))
      counter += operation.result;
  }

  return counter;
}

function extendedCombine(acc: number, operators: number[]): number[] {
  const [op, ...ops] = operators;
  if (!op) return [acc];
  return [
    extendedCombine(acc + op, ops),
    extendedCombine(acc * op, ops),
    extendedCombine(parseInt(`${acc}${op}`), ops),
  ].flat();
}

function exerciseTwo(program: Program): number {
  let counter = 0;
  for (const operation of program) {
    const [op, ...ops] = operation.operators;
    const results = extendedCombine(op, ops);
    if (results.some((result) => result === operation.result))
      counter += operation.result;
  }

  return counter;
}
if (import.meta.main) {
  const program: Program = await loadInput("./input_test.txt");

  const testExerciseOne = exerciseOne(program);
  assertEquals(
    testExerciseOne,
    3749,
    `main => Program does not return 3749: ${testExerciseOne}`,
  );

  const exerciseProgram = await loadInput("./input.txt");
  const exerciseExerciseOne = exerciseOne(exerciseProgram);
  console.log(`Exercise 1 => program output: ${exerciseExerciseOne}`);
  const exerciseExerciseTwo = exerciseTwo(exerciseProgram);
  console.log(`Exercise 2 => program output: ${exerciseExerciseTwo}`);
}

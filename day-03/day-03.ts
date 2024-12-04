import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";

const MUL_OP = /mul\((\w+),(\w+)\)/gm;
const MUL_COND_OP = /mul\((\w+),(\w+)\)|don't()|do()/gm;
const DO = "do";
const DONT = "don't";

async function loadProgram(path: string): Promise<string> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);
  return content;
}

function fixProgram(program: string): number {
  const ops = [...program.matchAll(MUL_OP)];
  return ops.reduce(
    (acc, curr) => acc + parseInt(curr[1]) * parseInt(curr[2]),
    0,
  );
}

function fixProgramWithCond(program: string): number {
  const ops = program.matchAll(MUL_COND_OP);

  let enabled = true;
  let acc = 0;
  for (const op of ops) {
    switch (op[0]) {
      case DO:
        enabled = true;
        break;
      case DONT:
        enabled = false;
        break;
      default:
        if (enabled) acc += parseInt(op[1]) * parseInt(op[2]);
    }
  }
  return acc;
}

if (import.meta.main) {
  const testTable = await loadProgram("./input_test.txt");
  const testFixProgram = fixProgram(testTable);
  assertEquals(
    testFixProgram,
    161,
    `main => Program does not return 161: ${testFixProgram}`,
  );
  const test2Table = await loadProgram("./input2_test.txt");
  const test2FixProgramWithCond = fixProgramWithCond(test2Table);
  assertEquals(
    test2FixProgramWithCond,
    48,
    `main => Program does not return 48: ${test2FixProgramWithCond}`,
  );

  const exerciseTable = await loadProgram("./input.txt");
  const exerciseFixProgram1 = fixProgram(exerciseTable);
  console.log(`Exercise 1 => fixed program output: ${exerciseFixProgram1}`);

  const exerciseFixProgram2 = fixProgramWithCond(exerciseTable);
  console.log(`Exercise 2 => fixed program output: ${exerciseFixProgram2}`);
}

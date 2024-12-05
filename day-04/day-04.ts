import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";

// grid[y][x], with 0,0 on top-left corner
type Grid = string[][];
type Direction = { x: number; y: number };
type Orientation =
  | "UP"
  | "UP_RIGHT"
  | "RIGHT"
  | "DOWN_RIGHT"
  | "DOWN"
  | "DOWN_LEFT"
  | "LEFT"
  | "UP_LEFT";

const XMAS = "XMAS".split("");
const DIRECTIONS: { [key in Orientation]: Direction } = {
  UP: { y: -1, x: 0 },
  UP_RIGHT: { y: -1, x: 1 },
  RIGHT: { y: 0, x: 1 },
  DOWN_RIGHT: { y: 1, x: 1 },
  DOWN: { y: 1, x: 0 },
  DOWN_LEFT: { y: 1, x: -1 },
  LEFT: { y: 0, x: -1 },
  UP_LEFT: { y: -1, x: -1 },
};

// An X is composed from two lines.
type Line = { m: Orientation; s: Orientation };
type XShape = [Line, Line];
// All possible combinations to make an X
const X_SHAPES: XShape[] = [
  [
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
  ],
  [
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
  ],
  [
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
  ],
  [
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
  ],
  [
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
  ],
  [
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
    { m: "UP_RIGHT", s: "DOWN_LEFT" },
  ],
  [
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
    { m: "DOWN_RIGHT", s: "UP_LEFT" },
  ],
  [
    { m: "DOWN_LEFT", s: "UP_RIGHT" },
    { m: "UP_LEFT", s: "DOWN_RIGHT" },
  ],
];

async function loadLetters(path: string): Promise<Grid> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);
  return content.split("\n").map((line) => line.split(""));
}

function checkXmas(
  grid: Grid,
  direction: Direction,
  x0: number,
  y0: number,
): boolean {
  let x = x0;
  let y = y0;
  for (const letter of XMAS) {
    if (Array.isArray(grid[y]) && grid[y][x] === letter) {
      y += direction.y;
      x += direction.x;
    } else {
      return false;
    }
  }
  return true;
}

function exerciseOne(grid: Grid): number {
  let counter = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "X") {
        counter += Object.values(DIRECTIONS)
          .map((direction) => checkXmas(grid, direction, x, y))
          .reduce((acc, curr) => acc + (curr ? 1 : 0), 0);
      }
    }
  }
  return counter;
}

function checkMas(grid: Grid, x0: number, y0: number): boolean {
  for (const shape of X_SHAPES) {
    const isX = shape
      .map((line) => {
        const mx = DIRECTIONS[line.m].x;
        const my = DIRECTIONS[line.m].y;
        const sx = DIRECTIONS[line.s].x;
        const sy = DIRECTIONS[line.s].y;
        const isM =
          Array.isArray(grid[y0 + my]) && grid[y0 + my][x0 + mx] === "M";
        const isS =
          Array.isArray(grid[y0 + sy]) && grid[y0 + sy][x0 + sx] === "S";
        return isM && isS;
      })
      .reduce((acc, curr) => acc && curr, true);
    if (isX) return true;
  }

  return false;
}

function exerciseTwo(grid: Grid): number {
  let counter = 0;
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "A" && checkMas(grid, x, y)) {
        counter++;
      }
    }
  }
  return counter;
}

if (import.meta.main) {
  const testLetters = await loadLetters("./input_test.txt");
  const testExerciseOne = exerciseOne(testLetters);
  assertEquals(
    testExerciseOne,
    18,
    `main => Program does not return 18: ${testExerciseOne}`,
  );
  const testExerciseTwo = exerciseTwo(testLetters);
  assertEquals(
    testExerciseTwo,
    9,
    `main => Program does not return 9: ${testExerciseTwo}`,
  );
  const exerciseTable = await loadLetters("./input.txt");
  const exerciseExerciseOne = exerciseOne(exerciseTable);
  console.log(`Exercise 1 => program output: ${exerciseExerciseOne}`);

  const exerciseExerciseTwo = exerciseTwo(exerciseTable);
  console.log(`Exercise 2 => fixed program output: ${exerciseExerciseTwo}`);
}

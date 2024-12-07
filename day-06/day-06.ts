import { fromFileUrl } from "@std/path";
import { assertEquals } from "@std/assert";

type Coordinate = {
  x: number;
  y: number;
};

enum Direction {
  UP = 0,
  RIGHT = 90,
  DOWN = 180,
  LEFT = 270,
}

// grid[y][x] with 0,0 on the top left corner.
type Map = Cell[][];

type Cell = {
  isBlocked: boolean;
  visited: boolean;
};

type Guard = {
  facing: Direction;
  position: Coordinate;
};

type Program = {
  guard: Guard;
  map: Map;
};

const VECTOR: Readonly<{ [key: number]: Coordinate }> = {
  [Direction.UP]: { y: -1, x: 0 },
  [Direction.RIGHT]: { y: 0, x: 1 },
  [Direction.DOWN]: { y: 1, x: 0 },
  [Direction.LEFT]: { y: 0, x: -1 },
};

async function loadInput(path: string): Promise<Program> {
  const resolvedPath = fromFileUrl(import.meta.resolve(path));
  const content = await Deno.readTextFile(resolvedPath);

  const guard: Guard = { facing: Direction.UP, position: { x: 0, y: 0 } };
  const cells: Cell[][] = content.split("\n").map((line, j) =>
    line.split("").map((cell, i) => {
      if (cell === "#") {
        return { isBlocked: true, visited: false };
      } else {
        if (cell === "^") guard.position = { x: i, y: j };
        return { isBlocked: false, visited: false };
      }
    }),
  );
  return { map: cells, guard };
}

function turnRight(guard: Guard) {
  const newDirection: Direction = (guard.facing + 90) % 360;
  guard.facing = newDirection;
}

function moveForward(guard: Guard) {
  const vector = VECTOR[guard.facing];
  guard.position.x += vector.x;
  guard.position.y += vector.y;
}

function nextStep(guard: Guard): Coordinate {
  const vector = VECTOR[guard.facing];
  return {
    x: guard.position.x + vector.x,
    y: guard.position.y + vector.y,
  };
}

function exerciseOne(program: Program): number {
  const width = program.map[0].length;
  const height = program.map.length;

  const isOut = (c: Coordinate): boolean => c.x < 0 || c.y < 0 || c.x >= width || c.y >= height;
  
  while(true) {
    const next = nextStep(program.guard)
    if (isOut(next)) break;

    program.map[program.guard.position.y][program.guard.position.x].visited = true;
    const nextCell = program.map[next.y][next.x]
    if (nextCell.isBlocked) {
      turnRight(program.guard)
    } else {
      moveForward(program.guard)
    }
  }

  let counter = 1;
  for(const line of program.map) {
    for(const cell of line) {
      if (cell.visited) counter++
    } 
  }

  return counter;
}

if (import.meta.main) {
  const program: Program = await loadInput("./input_test.txt");

  const testExerciseOne = exerciseOne(program);
  assertEquals(
    testExerciseOne,
    41,
    `main => Program does not return 41: ${testExerciseOne}`,
  );

  const exerciseProgram = await loadInput("./input.txt");
  const exerciseExerciseOne = exerciseOne(exerciseProgram);
  console.log(`Exercise 1 => program output: ${exerciseExerciseOne}`);
}

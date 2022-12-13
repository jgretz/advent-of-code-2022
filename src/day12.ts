import {data} from './data-test/day12';

type Point = {
  x: number;
  y: number;
};

type Grid = number[][];

type World = {
  grid: Grid;
  start: Point;
  target: Point;
};

type Path = Point[];

const LETTERS = `abcdefghijklmnopqrstuvwxyz`;
const START = 'S';
const TARGET = 'E';

const START_VALUE = -2;
const TARGET_VALUE = -3;

const parsePoint = (char: string) => {
  if (char === START) {
    return START_VALUE;
  }

  if (char === TARGET) {
    return TARGET_VALUE;
  }

  return LETTERS.indexOf(char);
};

const parseGrid = (lines: string[]) => lines.map((line) => Array.from(line).map(parsePoint));

const findPointByValue = (grid: Grid, value: number) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === value) {
        return {x, y};
      }
    }
  }

  return {x: -1, y: -1};
};

const parseWorld = (lines: string[]) => {
  const grid = parseGrid(lines);
  const start = findPointByValue(grid, START_VALUE);
  const target = findPointByValue(grid, TARGET_VALUE);

  grid[start.y][start.x] = 0;
  grid[target.y][target.x] = LETTERS.length - 1;

  return {
    grid,
    start,
    target,
  };
};

const pointEquals = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

const pathContainsPoint = (point: Point, path: Path) => {
  const test = path.find((p) => pointEquals(point, p));

  return !!test;
};

const canStep = (existing: Point, potential: Point, grid: Grid, path: Path) => {
  if (potential.x < 0 || potential.y < 0) {
    return false;
  }

  if (potential.y >= grid.length) {
    return false;
  }

  if (potential.x >= grid[potential.y].length) {
    return false;
  }

  if (pathContainsPoint(potential, path)) {
    return false;
  }

  return grid[potential.y][potential.x] <= grid[existing.y][existing.x] + 1;
};

const validNextSteps = (point: Point, path: Path, grid: Grid) =>
  [
    {x: point.x - 1, y: point.y},
    {x: point.x + 1, y: point.y},
    {x: point.x, y: point.y - 1},
    {x: point.x, y: point.y + 1},
  ].filter((potential) => canStep(point, potential, grid, path));

const walkPath = (path: Path, grid: Grid): Path[] => {
  const current = path[path.length - 1];
  const stepsToTravel = validNextSteps(current, path, grid);

  // no valid ends for this path
  if (stepsToTravel.length === 0) {
    return [];
  }

  return stepsToTravel.map((step) => [...path, step]);
};

const pathScore = (path: Path, target: Point) => {
  const current = path[path.length - 1];

  return Math.sqrt(Math.pow(target.x - current.x, 2) + Math.pow(target.y - current.y, 2));
};

const findShortestPath = ({start, target, grid}: World) => {
  const pathsToExplore = [[start]];
  let shortestPath: Path = null;
  let count = 0;

  while (true) {
    count++;
    const pathToExplore = pathsToExplore.shift();
    if (!pathToExplore) {
      break;
    }

    console.log(`Path Score: ${pathScore(pathToExplore, target)}`);

    const iterations = walkPath(pathToExplore, grid);
    if (iterations.length === 0) {
      continue;
    }

    iterations.forEach((path) => {
      if (shortestPath && path.length >= shortestPath.length) {
        return;
      }

      const lastPoint = path[path.length - 1];
      if (pointEquals(lastPoint, target)) {
        shortestPath = path;
      } else {
        pathsToExplore.push(path);
      }
    });

    // sort by the closest point
    pathsToExplore.sort((a: Path, b: Path) => {
      const aScore = pathScore(a, target);
      const bScore = pathScore(b, target);

      return aScore - bScore;
    });
  }

  console.log(`Search Iterations ${count}`);
  return shortestPath;
};

const world = parseWorld(data.split('\n'));
const shortestPath = findShortestPath(world);

// Challenge 1
console.log(`Challenge Shortest Path Found: ${shortestPath.length - 1}`);

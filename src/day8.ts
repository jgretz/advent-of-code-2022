import {data} from './data-prod/day8';

// Shared
type Grid = number[][];

type Point = {
  x: number;
  y: number;
};

const createGrid = (lines: string[]): Grid => {
  const grid = [];
  for (let x = 0; x < lines.length; x++) {
    grid[x] = [];

    for (let y = 0; y < lines[x].length; y++) {
      grid[x][y] = parseInt(lines[x][y], 10);
    }
  }

  return grid;
};

const grid = createGrid(data.split('\n'));

// Challenge 1
const isVisibleFromLeft = ({x, y}: Point, grid: Grid) => {
  for (let i = x - 1; i >= 0; i--) {
    if (grid[y][i] >= grid[y][x]) {
      return false;
    }
  }

  return true;
};

const isVisibleFromRight = ({x, y}: Point, grid: Grid) => {
  for (let i = x + 1; i < grid[y].length; i++) {
    if (grid[y][i] >= grid[y][x]) {
      return false;
    }
  }

  return true;
};

const isVisibleFromTop = ({x, y}: Point, grid: Grid) => {
  for (let i = y - 1; i >= 0; i--) {
    if (grid[i][x] >= grid[y][x]) {
      return false;
    }
  }

  return true;
};

const isVisibleFromBottom = ({x, y}: Point, grid: Grid) => {
  for (let i = y + 1; i < grid.length; i++) {
    if (grid[i][x] >= grid[y][x]) {
      return false;
    }
  }

  return true;
};

const isVisibleFromExterior = (tree: Point, grid: Grid) => {
  return (
    isVisibleFromLeft(tree, grid) ||
    isVisibleFromRight(tree, grid) ||
    isVisibleFromBottom(tree, grid) ||
    isVisibleFromTop(tree, grid)
  );
};

const findVisibleFromExterior = (grid: Grid) => {
  const visible = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (isVisibleFromExterior({x, y}, grid)) {
        visible.push({x, y});
      }
    }
  }

  return visible;
};

const visible = findVisibleFromExterior(grid);
console.log(`Challenge 1: Visible ${visible.length}`);

// Challenge 2
const scenicScoreFromLeft = ({x, y}: Point, grid: Grid) => {
  let score = 1;
  for (let i = x - 1; i >= 0; i--) {
    if (grid[y][i] >= grid[y][x]) {
      return score;
    }

    score++;
  }

  return score - 1;
};

const scenicScoreFromRight = ({x, y}: Point, grid: Grid) => {
  let score = 1;
  for (let i = x + 1; i < grid[y].length; i++) {
    if (grid[y][i] >= grid[y][x]) {
      return score;
    }

    score++;
  }

  return score - 1;
};

const scenicScoreFromTop = ({x, y}: Point, grid: Grid) => {
  let score = 1;
  for (let i = y - 1; i >= 0; i--) {
    if (grid[i][x] >= grid[y][x]) {
      return score;
    }

    score++;
  }

  return score - 1;
};

const scenicScoreFromBottom = ({x, y}: Point, grid: Grid) => {
  let score = 1;
  for (let i = y + 1; i < grid.length; i++) {
    if (grid[i][x] >= grid[y][x]) {
      return score;
    }

    score++;
  }

  return score - 1;
};

const scenicScoreForTree = (tree: Point, grid: Grid) => {
  return (
    scenicScoreFromLeft(tree, grid) *
    scenicScoreFromRight(tree, grid) *
    scenicScoreFromBottom(tree, grid) *
    scenicScoreFromTop(tree, grid)
  );
};

const findMostScenicTree = (grid: Grid) => {
  let mostScenicTree: Point = null;
  let scenicScore = 0;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const score = scenicScoreForTree({x, y}, grid);
      if (score > scenicScore) {
        mostScenicTree = {x, y};
        scenicScore = score;
      }
    }
  }

  return {tree: mostScenicTree, score: scenicScore};
};

const mostScenic = findMostScenicTree(grid);
console.log(
  `Challenge 2: Scenic Tree {${mostScenic.tree.x}, ${mostScenic.tree.y}} - ${mostScenic.score}`,
);

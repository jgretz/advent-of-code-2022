import {data} from './data-prod/day9';

type Point = {
  x: number;
  y: number;
};

const BLANK = '.';
const START = 'S';
const VISITED = 'X';
const HEIGHT = 1000;
const WIDTH = 1000;

type Map = string[][];

type World = {
  map: Map;
  knots: Point[];
};

type Movement = {
  direction: 'R' | 'L' | 'U' | 'D';
  steps: number;
};

const parseMove = (line: string) => {
  const [direction, steps] = line.split(' ');

  return {
    direction,
    steps: parseInt(steps, 10),
  } as Movement;
};

const parseMoves = (lines: string[]) => lines.map(parseMove);

// const printMap = ({map}: World) => console.log(map.map((x) => x.join('')).join('\n'));

const setMark = (map: Map, {x, y}: Point, mark = VISITED) => (map[HEIGHT - y - 1][x] = mark);

const snapTailX = (head: Point, tail: Point) => {
  if (head.y === tail.y) {
    if (head.x - tail.x > 1) {
      tail.x++;
      return true;
    } else if (tail.x - head.x > 1) {
      tail.x--;
      return true;
    }
  } else if (head.y - tail.y === 1) {
    if (head.x - tail.x > 1) {
      tail.x++;
      tail.y++;
      return true;
    } else if (tail.x - head.x > 1) {
      tail.x--;
      tail.y++;
      return true;
    }
  } else if (tail.y - head.y === 1) {
    if (head.x - tail.x > 1) {
      tail.x++;
      tail.y--;
      return true;
    } else if (tail.x - head.x > 1) {
      tail.x--;
      tail.y--;
      return true;
    }
  }

  return false;
};

const snapTailsX = (map: Map, knots: Point[]) => {
  for (let i = 1; i < knots.length; i++) {
    const change = snapTailX(knots[i - 1], knots[i]);
    if (change) {
      setMark(map, knots[i]);
    }
  }
};

const moveRight = ({map, knots}: World) => {
  knots[0].x++;

  snapTailsX(map, knots);
};

const moveLeft = ({map, knots}: World) => {
  knots[0].x--;

  snapTailsX(map, knots);
};

const snapTailY = (head: Point, tail: Point) => {
  if (head.x === tail.x) {
    if (head.y - tail.y > 1) {
      tail.y++;
      return true;
    } else if (tail.y - head.y > 1) {
      tail.y--;
      return true;
    }
  } else if (head.x - tail.x === 1) {
    if (head.y - tail.y > 1) {
      tail.x++;
      tail.y++;
      return true;
    } else if (tail.y - head.y > 1) {
      tail.x++;
      tail.y--;
      return true;
    }
  } else if (tail.x - head.x === 1) {
    if (head.y - tail.y > 1) {
      tail.x--;
      tail.y++;
      return true;
    } else if (tail.y - head.y > 1) {
      tail.x--;
      tail.y--;
      return true;
    }
  }

  return false;
};

const snapTailsY = (map: Map, knots: Point[]) => {
  for (let i = 1; i < knots.length; i++) {
    const change = snapTailY(knots[i - 1], knots[i]);
    if (change) {
      setMark(map, knots[i]);
    }
  }
};

const moveUp = ({map, knots}: World) => {
  knots[0].y++;

  snapTailsY(map, knots);
};

const moveDown = ({map, knots}: World) => {
  knots[0].y--;

  snapTailsY(map, knots);
};

const directionMap = {
  R: moveRight,
  L: moveLeft,
  U: moveUp,
  D: moveDown,
};

const newMap = () => {
  const map = [];
  for (let y = 0; y < HEIGHT; y++) {
    map[y] = [];

    for (let x = 0; x < WIDTH; x++) {
      map[y][x] = BLANK;
    }
  }

  setMark(map, {x: 0, y: 0}, START);

  return map;
};

const newWorld = (knotCount: number) => {
  const knots = [];
  for (let i = 0; i < knotCount; i++) {
    knots.push({x: WIDTH / 2, y: HEIGHT / 2});
  }

  const world = {
    map: newMap(),
    knots,
  };

  return world;
};

const traverse = (world: World, moves: Movement[]) => {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const func = directionMap[move.direction];

    for (let j = 0; j < move.steps; j++) {
      func(world);

      // printMap(world);
      // console.log();
    }
  }
};

const countVisits = (world: World) =>
  world.map.reduce((acc, row) => acc + row.filter((x) => x === VISITED || x === START).length, 0);

const moves = parseMoves(data.split('\n'));

// Challenge 1
const challenge1World = newWorld(2);
traverse(challenge1World, moves);

const challenge1Count = countVisits(challenge1World);

console.log(`Challenge 1: Visited Squares: ${challenge1Count}`);

// Challenge 2
const challenge2World = newWorld(10);
traverse(challenge2World, moves);

const challenge2Count = countVisits(challenge2World);

console.log(`Challenge 2: Visited Squares: ${challenge2Count}`);

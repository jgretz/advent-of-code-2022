import {data} from './data-prod/day2';

const games = data.split('\n');

// A / X = Rock, B / Y = Paper, C / Z = Scissor
const vsShapMape = {
  A: {
    X: 3,
    Y: 6,
    Z: 0,
  },
  B: {
    X: 0,
    Y: 3,
    Z: 6,
  },
  C: {
    X: 6,
    Y: 0,
    Z: 3,
  },
};

const shapeMap = {
  X: 1,
  Y: 2,
  Z: 3,
};

const scoreSingleGame = (opponent: string, player: string) =>
  shapeMap[player] + vsShapMape[opponent][player];

// Challenge 1
const scoreAllGamesV1 = games.reduce((total, game) => {
  const plays = game.split(' ');
  return total + scoreSingleGame(plays[0], plays[1]);
}, 0);

console.log(`Total Challenge 1 Score: ${scoreAllGamesV1}`);

// Challenge 2
// X = lose, Y = draw, Z = win
const outcomePlayMap = {
  A: {
    X: 'Z',
    Y: 'X',
    Z: 'Y',
  },
  B: {
    X: 'X',
    Y: 'Y',
    Z: 'Z',
  },
  C: {
    X: 'Y',
    Y: 'Z',
    Z: 'X',
  },
};

const scoreAllGamesV2 = games.reduce((total, game) => {
  const plays = game.split(' ');
  const desiredPlay = outcomePlayMap[plays[0]][plays[1]];

  return total + scoreSingleGame(plays[0], desiredPlay);
}, 0);

console.log(`Total Challenge 2 Score: ${scoreAllGamesV2}`);

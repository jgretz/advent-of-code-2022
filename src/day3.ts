import {data} from './data-prod/day3';

// brute force I know but the US game is soon :)
const letters = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`;
const numericValue = (letter: string) => letters.indexOf(letter) + 1;

const lines = data.split('\n');

const findDupe = ([first, ...rest]: string[]) => {
  const searchSpace = rest.map((l) => Array.from(l));
  const dupeIndex = Array.from(first).findIndex((c) => searchSpace.every((s) => s.indexOf(c) >= 0));

  return first[dupeIndex];
};

// *************
// Challenge 1
const splitInTwo = (line: string) => [
  line.substring(0, line.length / 2),
  line.substring(line.length / 2),
];

// I really want the |> syntax here
const challenge1Sum = lines
  .map((l) => {
    const dupe = findDupe(splitInTwo(l));

    return numericValue(dupe);
  })
  .reduce((acc, n) => acc + n, 0);

console.log(`Challenge 1: ${challenge1Sum}`);

// *************
// Challenge 2
const challenge2Sum = lines.reduce((acc, line, index) => {
  if (index % 3 !== 0) {
    return acc;
  }

  const dupe = findDupe([line, lines[index + 1], lines[index + 2]]);
  return acc + numericValue(dupe);
}, 0);

console.log(`Challenge 2: ${challenge2Sum}`);

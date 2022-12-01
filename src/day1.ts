import {data} from './data-prod/day1';

const lines = data.split('\n');

const elves = lines.reduce(
  (acc, value) => {
    if (value.length === 0) {
      acc.push(0);
    } else {
      acc[acc.length - 1] = acc[acc.length - 1] + parseInt(value, 0);
    }

    return acc;
  },
  [0],
);

// challenge 1
const maxElfCalories = Math.max(...elves);
const maxElfIndex = elves.indexOf(maxElfCalories);

console.log(`Elf ${maxElfIndex} has ${maxElfCalories} calories`);

// challenge 2
const sortedElves = elves.sort().reverse();
const top3Total = sortedElves[0] + sortedElves[1] + sortedElves[2];

console.log(sortedElves);
console.log(`The top 3 elves are carrying ${top3Total} calories`);

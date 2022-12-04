import {data} from './data-prod/day4';

// parse
type Assignment = {
  min: number;
  max: number;
};

const parseAssignment = (assignment: string) => {
  const parts = assignment.split('-');
  return {min: parseInt(parts[0], 10), max: parseInt(parts[1], 10)};
};

const parseLine = (line: string) => line.split(',').map(parseAssignment);

const assignments = data.split('\n').map(parseLine);

//***************
// Challenge #1

const contains = (x: Assignment, y: Assignment) => x.min <= y.min && x.max >= y.max;

const completeOverlap = assignments.filter(
  (dual) => contains(dual[0], dual[1]) || contains(dual[1], dual[0]),
);

console.log(`Challenge 1: ${completeOverlap.length}`);

//***************
// Challenge #2

const partial = (x: Assignment, y: Assignment) => {
  return x.max >= y.min && x.max <= y.max;
};

const partialOverlap = assignments.filter(
  (dual) => partial(dual[0], dual[1]) || partial(dual[1], dual[0]),
);

console.log(`Challenge 2: ${partialOverlap.length}`);

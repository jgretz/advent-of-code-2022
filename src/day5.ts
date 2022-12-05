import {data} from './data-prod/day5';

const findSplitLine = (lines: string[]) => lines.findIndex((x) => x.length === 0);

const STACK_WIDTH = 3;
const parseStacks = (lines: string[]) => {
  const split = findSplitLine(lines);
  const [stackTitles, ...rawStacks] = lines.slice(0, split).reverse();

  const stackCount = parseInt(
    stackTitles
      .split(' ')
      .filter((x) => x.length > 0)
      .reverse()[0],
  );

  const stacks = [];
  for (let x = 0; x < stackCount; x++) {
    stacks.push([]);
  }

  for (let x = 0; x < rawStacks.length; x++) {
    const line = rawStacks[x];

    for (let y = 0; y < stackCount; y++) {
      const item = line[y * STACK_WIDTH + y + 1];
      if (item.length > 0 && item !== ' ') {
        stacks[y].push(item);
      }
    }
  }

  return stacks;
};

type Instruction = {
  sourceStack: number;
  targetStack: number;
  count: number;
};

const parseInstruction = (line: string) => {
  const parts = line.split(' ');

  return {
    sourceStack: parseInt(parts[3]) - 1,
    targetStack: parseInt(parts[5]) - 1,
    count: parseInt(parts[1]),
  };
};

const parseInstructions = (lines: string[]) => {
  const split = findSplitLine(lines);
  const instructions = lines.slice(split + 1);

  return instructions.map(parseInstruction);
};

const nameOfStacks = (stacks: string[][]) => {
  return stacks.reduce((acc, stack) => {
    return `${acc}${stack[stack.length - 1]}`;
  }, '');
};

// parse
const lines = data.split('\n');
const instructions = parseInstructions(lines);

// ************
// Challenge 1

const executeInstructionsCrane9000 = (stacks: string[][], instructions: Instruction[]) => {
  for (let x = 0; x < instructions.length; x++) {
    const instruction = instructions[x];

    for (let y = 0; y < instruction.count; y++) {
      const item = stacks[instruction.sourceStack].pop();
      stacks[instruction.targetStack].push(item);
    }
  }
};

const ch1Copy = parseStacks(lines);
executeInstructionsCrane9000(ch1Copy, instructions);

console.log(`Challenge 1: Name of Stacks: ${nameOfStacks(ch1Copy)}`);

// ************
// Challenge 2

const executeInstructionsCrane9001 = (stacks: string[][], instructions: Instruction[]) => {
  for (let x = 0; x < instructions.length; x++) {
    const instruction = instructions[x];

    const items = [];
    for (let y = 0; y < instruction.count; y++) {
      items.push(stacks[instruction.sourceStack].pop());
    }

    items.reverse();
    stacks[instruction.targetStack].push(...items);
  }
};

const ch2Copy = parseStacks(lines);
executeInstructionsCrane9001(ch2Copy, instructions);

console.log(`Challenge 2: Name of Stacks: ${nameOfStacks(ch2Copy)}`);

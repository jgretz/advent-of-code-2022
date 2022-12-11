import {data} from './data-prod/day11';

type Operation = {
  type: '*' | '+' | '^';
  value: number;
};

type Monkey = {
  id: number;
  items: number[];
  operation: Operation;
  testFactor: number;
  trueTarget: number;
  falseTarget: number;

  inspections: number;
};

type World = {
  round: number;
  superMod: number;
  monkeys: Monkey[];
};

// Parse
const parseId = (line: string) => parseInt(line.replace('Monkey ', ' ').replace(':', ''), 10);
const parseItems = (line: string) =>
  line
    .replace('Starting items: ', '')
    .split(',')
    .map((x) => parseInt(x, 10));
const parseOperations = (line: string) => {
  let parts = line.replace('Operation: new = old ', '').split(' ');

  if (parts[1] === 'old') {
    parts = ['^', '2'];
  }

  return {
    type: parts[0],
    value: parseInt(parts[1], 10),
  };
};
const parseTestFactor = (line: string) => parseInt(line.replace('Test: divisible by ', ''), 10);
const parseTrueTarget = (line: string) =>
  parseInt(line.replace('If true: throw to monkey ', ''), 10);
const parseFalseTarget = (line: string) =>
  parseInt(line.replace('If false: throw to monkey ', ''), 10);

const parseMonkey = (lines: string[]) => {
  return {
    id: parseId(lines[0]),
    items: parseItems(lines[1]),
    operation: parseOperations(lines[2]),
    testFactor: parseTestFactor(lines[3]),
    trueTarget: parseTrueTarget(lines[4]),
    falseTarget: parseFalseTarget(lines[5]),

    inspections: 0,
  } as Monkey;
};

const splitLinesIntoMonkeysDefinition = (lines: string[]) => {
  const splits = [];
  for (let i = 0; i < lines.length; i += 7) {
    splits.push(lines.slice(i, i + 6));
  }

  return splits;
};

const takeTurn = (monkey: Monkey, world: World) => {
  monkey.items.forEach((item) => {
    let worry = item;

    switch (monkey.operation.type) {
      case '*':
        worry *= monkey.operation.value;
        break;

      case '+':
        worry += monkey.operation.value;
        break;

      case '^':
        worry = Math.pow(worry, monkey.operation.value);
        break;
    }

    // worry = Math.round(worry / 3 - 0.5);
    worry = worry % world.superMod;

    const target = worry % monkey.testFactor === 0 ? monkey.trueTarget : monkey.falseTarget;
    world.monkeys.find((x) => x.id === target).items.push(worry);

    monkey.inspections++;
  });

  monkey.items = [];
};

const runRound = (world: World) => {
  world.monkeys.forEach((m) => {
    takeTurn(m, world);
  });

  world.round++;
};

const runRounds = (world: World, rounds: number) => {
  for (let i = 0; i < rounds; i++) {
    runRound(world);
  }
};

const monkeys = splitLinesIntoMonkeysDefinition(data.split('\n')).map(parseMonkey);
const superMod = monkeys.reduce((acc, m) => acc * m.testFactor, 1);
const world = {
  round: 0,
  superMod,
  monkeys,
};

runRounds(world, 10000);

// Challenge 1 vs 2 is if the worry is / 3 vs supermodulo - just configuring that by a comment
const sorted = world.monkeys.sort((x, y) =>
  x.inspections > y.inspections ? -1 : x.inspections < y.inspections ? 1 : 0,
);

// console.log(monkeys);
console.log(`Monkey Business: ${sorted[0].inspections * sorted[1].inspections}`);

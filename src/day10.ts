import {data} from './data-prod/day10';

type CRT = string[][];

type CPU = {
  cycle: number;
  xRegister: number;
  frequencies: {[key: number]: number};
};

type Instruction = {
  operation: 'noop' | 'addx';
  value: number;
};

const parseInstruction = (line: string) => {
  const [operation, value] = line.split(' ');

  return {
    operation,
    value: parseInt(value, 10),
  } as Instruction;
};

const addx = (cpu: CPU, value: number) => {
  cpu.xRegister += value;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

const operationMap = {
  noop: noop,
  addx: addx,
};

const operationCycleCount = {
  noop: 1,
  addx: 2,
};

const CRT_WIDTH = 40;
const CRT_HEIGHT = 6;

const printCRT = (crt: CRT) => console.log(crt.map((x) => x.join('')).join('\n'));

const resetCrt = (crt?: CRT) => {
  if (crt) {
    printCRT(crt);
  }

  crt = [];
  for (let y = 0; y < CRT_HEIGHT; y++) {
    crt[y] = [];

    for (let x = 0; x < CRT_WIDTH; x++) {
      crt[y][x] = ' ';
    }
  }

  return crt;
};

const applyPixel = (crt: CRT, cycle: number, pixelIndex: number) => {
  const x = cycle % 40;
  const y = Math.round(cycle / 40 - 0.5);

  const char = Math.abs(x - pixelIndex) <= 1 ? '#' : '.';

  crt[y][x] = char;
};

const executeInstruction = (cpu: CPU, crt: CRT) => (instruction: Instruction) => {
  const op = operationMap[instruction.operation];
  const cycles = operationCycleCount[instruction.operation];

  for (let i = 0; i < cycles; i++) {
    applyPixel(crt, cpu.cycle, cpu.xRegister);

    cpu.cycle++;

    if (cpu.cycle % 20 === 0) {
      cpu.frequencies[cpu.cycle] = cpu.cycle * cpu.xRegister;
    }

    if (cpu.cycle % (CRT_HEIGHT * CRT_WIDTH) === 0) {
      crt = resetCrt(crt);
    }
  }

  op(cpu, instruction.value);
};

const runProgram = (instructionSet: Instruction[]) => {
  const cpu = {
    cycle: 0,
    xRegister: 1,
    frequencies: {},
  };

  const crt = resetCrt();

  instructionSet.forEach(executeInstruction(cpu, crt));

  return cpu;
};

const instructions = data.split('\n').map(parseInstruction);

// Challenge 1
const result = runProgram(instructions);

const sum = [20, 60, 100, 140, 180, 220].reduce((acc, index) => acc + result.frequencies[index], 0);

console.log(`Challenge 1: Sum: ${sum}`);

// Challenge 2 - will be done as part of Challenge 1

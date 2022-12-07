import {data} from './data-prod/day7';

// types
type File = {
  name: string;
  size: number;
};

type Directory = {
  name: string;
  files: File[];
  size: number;

  parent?: Directory;
  subDirectories: Directory[];
};

enum LineType {
  Command = 1,
  DirInfo,
  FileInfo,
}

enum Command {
  ChangeDir = 1,
  ListDir,
}

const tokenMap = {
  $: LineType.Command,
  dir: LineType.DirInfo,

  cd: Command.ChangeDir,
  ls: Command.ListDir,
};

// build tree
const parseFileInfo = (line: string): File => {
  const [size, name] = line.split(' ');

  return {
    name,
    size: parseInt(size, 10),
  };
};

const parseDirInfo = (line: string): Directory => {
  const [_cmd, name] = line.split(' ');

  return {
    name,
    size: 0,
    files: [],
    subDirectories: [],
  };
};

const changeDir = (directory: Directory, dir: string) => {
  if (dir === '..') {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return directory.parent!;
  }

  return directory.subDirectories.find((x) => x.name === dir) || directory;
};

const listDir = (directory: Directory) => {
  return directory;
};

const executeCommand = (directory: Directory, token: string, args: string[]) => {
  switch (tokenMap[token]) {
    case Command.ChangeDir:
      return changeDir(directory, args[0]);

    case Command.ListDir:
      return listDir(directory);
  }

  return directory;
};

const addDirectory = (parent: Directory, line: string) => {
  const dir = parseDirInfo(line);
  if (parent.subDirectories.findIndex((x) => x.name === dir.name) > -1) {
    console.log('foo');
    return;
  }

  dir.parent = parent;
  parent.subDirectories.push(dir);
};

const addFile = (parent: Directory, line: string) => {
  const file = parseFileInfo(line);
  if (parent.files.findIndex((x) => x.name === file.name) > -1) {
    console.log('foo');
    return;
  }

  parent.files.push(file);
};

const parseLineType = (line: string): LineType => {
  const token = line.split(' ');

  return tokenMap[token[0]] || LineType.FileInfo;
};

const sizeOfDirectory = (directory: Directory) => {
  const fileSize = directory.files.reduce((acc, file) => acc + file.size, 0);
  const subSize = directory.subDirectories.reduce(
    (acc, subDir) => acc + sizeOfDirectory(subDir),
    0,
  );

  directory.size = fileSize + subSize;

  return directory.size;
};

const buildSystemFromOutput = (lines: string[]) => {
  const root = {name: '/', size: 0, files: [], subDirectories: []};
  let current = root;

  for (let x = 0; x < lines.length; x++) {
    const line = lines[x];
    const lineType = parseLineType(line);

    switch (lineType) {
      case LineType.Command:
        const [_prompt, token, ...args] = line.split(' ');

        current = executeCommand(current, token, args);
        break;

      case LineType.DirInfo:
        addDirectory(current, line);
        break;

      case LineType.FileInfo:
        addFile(current, line);
        break;
    }
  }

  sizeOfDirectory(root);

  return root;
};

const root = buildSystemFromOutput(data.split('\n'));

//**************
// Challenge 1

const registerDirectory = (map: {[key: string]: Directory}, directory: Directory) => {
  map[directory.name] = directory;

  directory.subDirectories.forEach((dir) => registerDirectory(map, dir));
};

const directoryMap = {} as {[key: string]: Directory};
registerDirectory(directoryMap, root);

const findDirectoriesUnder = (size: number) =>
  Object.keys(directoryMap).reduce((acc, name) => {
    const dir = directoryMap[name];
    if (dir.size <= size) {
      return [...acc, dir];
    }

    return acc;
  }, []);

const smallDirectories = findDirectoriesUnder(100000);

const sumOfSmallDirectories = smallDirectories.reduce((acc, dir) => acc + dir.size, 0);
console.log(`Challenge 1: ${sumOfSmallDirectories}`);

// Challenge 2
const HD = 70000000;
const INSTALL = 30000000;
const unusedSpace = HD - root.size;
const spaceNeeded = INSTALL - unusedSpace;

const smallestDirectoryToDelete = Object.values(directoryMap)
  .sort((a, b) => a.size - b.size)
  .find((x) => x.size >= spaceNeeded);
console.log(`Challenge 2: ${smallestDirectoryToDelete.name}: ${smallestDirectoryToDelete.size}`);

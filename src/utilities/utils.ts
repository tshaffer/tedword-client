import { cloneDeep } from 'lodash';
import {
  Guess,
  CluesByDirection,
  GridSquareSpec,
  RowOfGridSquareSpecs,
  GridSpec,
  GuessesGrid,
  RowOfGuesses,
  Clues,
  ClueAtLocation,
  Clue
} from '../types';

// TEDTODO types
const directionInfo = {
  across: {
    primary: 'col',
    orthogonal: 'row',
  },
  down: {
    primary: 'row',
    orthogonal: 'col',
  },
};

export const bothDirections: string[] = Object.keys(directionInfo);

export function isAcross(direction): boolean {
  return direction === 'across';
}

export function otherDirection(direction): string {
  return isAcross(direction) ? 'down' : 'across';
}

// TEDTODO - types for return value
export function calculateExtents(data: CluesByDirection, direction: string) {
  const dir = directionInfo[direction];
  let primaryMax = 0;
  let orthogonalMax = 0;

  Object.entries(data[direction]).forEach(([i, info]) => {
    const primary = info[dir.primary] + (info as ClueAtLocation).answer.length - 1;
    if (primary > primaryMax) {
      primaryMax = primary;
    }

    const orthogonal = info[dir.orthogonal];
    if (orthogonal > orthogonalMax) {
      orthogonalMax = orthogonal;
    }
  });

  return {
    [dir.primary]: primaryMax,
    [dir.orthogonal]: orthogonalMax,
  };
}

const emptyCellData: GridSquareSpec = {
  used: false,
  number: null,
  // answer: '',
  // locked: false,
  across: null,
  down: null,
  row: null,
  col: null,
};

export function createEmptyGrid(size): GridSpec {
  const gridData = Array(size) as GridSpec;
  // Rather than [x][y] in column-major order, the cells are indexed as
  // [row][col] in row-major order.
  for (let r = 0; r < size; r++) {
    gridData[r] = Array(size) as RowOfGridSquareSpecs;
    for (let c = 0; c < size; c++) {
      gridData[r][c] = {
        ...emptyCellData,
        row: r,
        col: c,
      };
    }
  }

  return gridData;
}

// sort helper for clues...
function byNumber(a, b) {
  const aNum = Number.parseInt(a.number, 10);
  const bNum = Number.parseInt(b.number, 10);
  return aNum - bNum;
}

function fillClues(gridData: GridSpec, clues: Clues, data: CluesByDirection, direction: string): void {

  // TEDTODO type
  const dir = directionInfo[direction];

  Object.entries(data[direction]).forEach(([number, info]) => {

    const clueAtLocation: ClueAtLocation = info as ClueAtLocation;
    const { row: rowStart, col: colStart, clue, answer } = clueAtLocation;
    for (let i = 0; i < answer.length; i++) {
      const row = rowStart + (dir.primary === 'row' ? i : 0);
      const col = colStart + (dir.primary === 'col' ? i : 0);
      const cellData: GridSquareSpec = gridData[row][col];

      // TODO?: check to ensure the answer is the same if it's already set?
      cellData.used = true;
      // cellData.answer = answer[i];
      cellData[direction] = number;

      if (i === 0) {
        // TODO?: check to ensure the number is the same if it's already set?
        cellData.number = number;
      }
    }

    const simpleClue: Clue = {
      clue,
      number,
    };
    
    clueAtLocation.clueIndex = clues[direction].length;

    clues[direction].push(simpleClue);
  });

  clues[direction].sort(byNumber);
}

export const createGridData = (data: CluesByDirection): any => {

  // TEDTODO type
  const acrossMax = calculateExtents(data, 'across');
  const downMax = calculateExtents(data, 'down');

  const size: number =
    Math.max(...Object.values(acrossMax), ...Object.values(downMax)) + 1;

  const gridData: GridSpec = createEmptyGrid(size);

  // Now fill with answers... and also collect the clues
  const clues: Clues = {
    across: [],
    down: [],
  };

  fillClues(gridData, clues, data, 'across');
  fillClues(gridData, clues, data, 'down');

  return {
    size,
    gridData,
    clues
  };
};

export const createEmptyGuessesGrid = (displayedPuzzle: CluesByDirection): GuessesGrid => {

  // TEDTODO - type
  const rowCount = calculateExtents(displayedPuzzle, 'across');
  const colCount = calculateExtents(displayedPuzzle, 'down');

  const size: number =
    Math.max(...Object.values(rowCount), ...Object.values(colCount)) + 1;

  const emptyCellGuess: Guess = {
    value: '',
    guessIsRemote: false,
    remoteUser: null,
  };
  const guesses: GuessesGrid = [];
  for (let row = 0; row < size; row++) {
    const guessesInRow: RowOfGuesses = [];
    for (let col = 0; col < size; col++) {
      guessesInRow.push(cloneDeep(emptyCellGuess));
    }
    guesses.push(guessesInRow);
  }
  return guesses;
};



export interface FileInput {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
}

export interface TedwordState {
  puzzleSpec: PuzzleSpec;
}

export interface PuzzleSpec {
  name: string;
}

export interface PuzCrosswordSpec {
  title: string;
  author: string;
  copyright: string;
  note: string;
  width: number;
  height: number;
  clues: string[];
  solution: string;
  state: string;
  hasState: boolean;
  parsedClues: ParsedClue[];
}

export interface ParsedClue {
  col: number;
  isAcross: boolean;
  length: number;
  number: number;
  row: number;
  solution: string;
  state: string;
  text: string;
}

export interface DisplayedPuzzleCell {
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface PuzzleElementByNumber {
  [id: number]: DisplayedPuzzleCell;
}

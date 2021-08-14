// export const serverUrl = 'http://localhost:8888';
// export const serverUrl = 'https://damp-falls-28733.herokuapp.com';
export const serverUrl = 'http://localhost:5000';
// export const serverUrl = 'https://tedword.herokuapp.com';
export const apiUrlFragment = '/api/v1/';

export interface FileInput {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
}

export interface TedwordState {
  appState: AppState;
  boardsState: BoardsState;
  puzCrosswordSpec: PuzCrosswordSpec;
  puzzlesState: PuzzlesState,
  users: UsersMap;
}

export interface AppState {
  uiState: UiState;
  userName: string;
  puzzleId: string;
  boardId: string;
  focusedAcrossClue: ParsedClue;
  focusedDownClue: ParsedClue;
}

export interface BoardsState {
  boards: BoardsMap;
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

export interface PuzzlesState {
  puzzlesMetadata: PuzzlesMetadataMap,
  puzzles: PuzzlesMap;
}

export interface UsersMap {
  [id: string]: User; // userName
}

export enum UiState {
  SelectUser = 'SelectUser',
  SelectPuzzleOrBoard = 'SelectPuzzleOrBoard',
  NewBoardPlay = 'NewBoardPlay',
  ExistingBoardPlay = 'ExistingBoardPlay',
}

export interface PuzzleSpec {
  name: string;
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

export interface DisplayedPuzzle {
  across: PuzzleElementByNumber;
  down: PuzzleElementByNumber;
}

export interface PuzzleMetadata {
  id: string;
  author: string;
  title: string;
}

export interface PuzzlesMetadataMap {
  [id: string]: PuzzleMetadata; // puzzle id
}

export interface PuzzlesMap {
  [id: string]: PuzzleEntity; // puzzle id
}

export interface BoardsMap {
  [id: string]: BoardEntity; // board id
}

export interface User {
  userName: string;
  password: string;
  email: string;
  cellTextColorPartnerBoard: string;
}

export interface PuzzleSpec {
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

export interface PuzzleEntity extends PuzzleSpec {
  id: string;
}

export interface CellContentsMap {
  [id: string]: string;
}

export interface BoardEntity {
  id: string;
  puzzleId: string;
  title: string;
  users: string[];
  cellContents: CellContentsMap;
  startDateTime: Date;
  lastPlayedDateTime: Date;
  elapsedTime: number;
  solved: boolean;
  difficulty: number;
}

export interface PuzzleSpec {
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


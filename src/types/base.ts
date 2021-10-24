export const serverUrl = 'http://localhost:8000';
// export const serverUrl = 'https://tedword.herokuapp.com';

export const apiUrlFragment = '/api/v1/';

export interface TedwordState {
  appState: AppState;
  boardsState: BoardsState;
  chat: ChatState;
  derivedCrosswordData: DerivedCrosswordData | null;
  gameState: GameState;
  guessesState: GuessesState;
  puzzlesState: PuzzlesState,
  users: UsersMap;
}

export interface AppState {
  uiState: UiState;
  userName: string;
  puzzleId: string;
  boardId: string;
  fileUploadStatus: string;
  puzzlePlayActive: boolean;
}

export interface BoardsState {
  boards: BoardsMap;
}

export interface ChatMember {
  userName: string;
}

export interface Chat {
  sender: string;
  message: string;
  timestamp: Date;
}

export interface ChatState {
  joined: boolean;
  members: ChatMember[];
  chats: Chat[];
}

export interface GameState {
  focusedAcrossClue: ParsedClue;
  focusedDownClue: ParsedClue;
}

export interface PuzzlesState {
  puzzlesMetadata: PuzzlesMetadataMap,
  puzzles: PuzzlesMap;
  puzzlesByFileName: PuzzleExistsByFileNameMap;
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
  sourceFileName: string;
  author: string;
  title: string;
}

export interface PuzzlesMetadataMap {
  [id: string]: PuzzleMetadata; // puzzle id
}

export interface PuzzlesMap {
  [id: string]: PuzzleEntity; // puzzle id
}

export interface PuzzleExistsByFileNameMap {
  [id: string]: boolean; // sourceFileName
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
  sourceFileName: string;
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

export interface CellContentsValue {
  user: string;
  typedChar: string;
}

export interface CellContentsMap {
  [id: string]: CellContentsValue;
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

export interface Guess {
  value: string;
  guessIsRemote: boolean;
  remoteUser: string | null;
}

export interface ClueAtLocation {
  clue: string;
  answer: string;
  row: number;
  col: number;
  clueIndex: number;
  completelyFilledIn: boolean;
}

export interface CluesByNumber {
  [id: number]: ClueAtLocation;
}

export interface CluesByDirection {
  across: CluesByNumber;
  down: CluesByNumber;
}

export interface Guess {
  value: string;
  guessIsRemote: boolean;
  remoteUser: string | null;
}

export type RowOfGuesses = Guess[];
export type GuessesGrid = RowOfGuesses[];

export interface GridSquareSpec {
  used: boolean;
  number: string;
  // answer: string;
  // locked: boolean;
  row: number | null;
  col: number | null;
  across: boolean;
  down: boolean;
}
export type RowOfGridSquareSpecs = GridSquareSpec[];
export type GridSpec = RowOfGridSquareSpecs[];

export interface GridSquare extends GridSquareSpec {
  guess: Guess;
}

export interface DerivedCrosswordData {
  size: number;
  gridData: GridSpec;
  cluesByDirection: CluesByDirection | null;
}

export interface GuessesState {
  guessesGrid: GuessesGrid | null;
}

export interface FileInput {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  lastModifiedDate: string;
}


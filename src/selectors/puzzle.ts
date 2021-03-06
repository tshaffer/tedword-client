import {
  DisplayedPuzzle,
  ParsedClue,
  PuzzleEntity,
  TedwordState
} from '../types';

export const getPuzzle = (state: TedwordState, puzzleId: string): PuzzleEntity => {
  // eslint-disable-next-line no-prototype-builtins
  if (state.puzzlesState.puzzles.hasOwnProperty(puzzleId)) {
    return state.puzzlesState.puzzles[puzzleId];
  }
  return null;
};

export const getDisplayedPuzzle = (state: TedwordState): DisplayedPuzzle => {
  
  const displayedPuzzle: DisplayedPuzzle = {
    across: {},
    down: {},
  };

  const puzzleId: string = state.appState.puzzleId;
  // eslint-disable-next-line no-prototype-builtins
  if (!state.puzzlesState.puzzles.hasOwnProperty(puzzleId)) {
    return displayedPuzzle;
  }

  const puzzleEntity: PuzzleEntity = state.puzzlesState.puzzles[puzzleId];
  const parsedClues: ParsedClue[] = puzzleEntity.parsedClues;
  for (const parsedClue of parsedClues) {
    const { col, isAcross, row, solution, text } = parsedClue;
    if (isAcross) {
      displayedPuzzle.across[parsedClue.number] = {
        clue: text,
        answer: solution,
        row,
        col,
      };
    } else {
      displayedPuzzle.down[parsedClue.number] = {
        clue: text,
        answer: solution,
        row,
        col,
      };
    }
  }
  
  return displayedPuzzle;
};

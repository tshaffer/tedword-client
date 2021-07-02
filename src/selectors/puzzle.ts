import {
  DisplayedPuzzle,
  ParsedClue,
  PuzCrosswordSpec,
  TedwordState
} from '../types';

export const getDisplayedPuzzle = (state: TedwordState): DisplayedPuzzle => {
  
  const displayedPuzzle: DisplayedPuzzle = {
    across: {},
    down: {},
  };

  const puzCrosswordSpec: PuzCrosswordSpec = state.puzCrosswordSpec;

  const parsedClues: ParsedClue[] = puzCrosswordSpec.parsedClues;
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

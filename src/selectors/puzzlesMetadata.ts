import {
  TedwordState,
  PuzzlesMap,
  PuzzlesMetadataMap,
  PuzzleExistsByFileNameMap,
} from '../types';

export const getPuzzlesMetadata = (state: TedwordState): PuzzlesMetadataMap => {
  return state.puzzlesState.puzzlesMetadata;
};

export const getPuzzlesMap = (state: TedwordState): PuzzlesMap => {
  return state.puzzlesState.puzzles;
};

export const getPuzzleExistsByFileNameMap = (state: TedwordState): PuzzleExistsByFileNameMap => {
  return  state.puzzlesState.puzzlesByFileName;
};

// export const puzzleExists = (state: TedwordState, fileName: string): boolean => {
//   const puzzlesByFileName: PuzzleExistsByFileNameMap = state.puzzlesState.puzzlesByFileName;
//   // eslint-disable-next-line no-prototype-builtins
//   return puzzlesByFileName.hasOwnProperty(fileName);
// };

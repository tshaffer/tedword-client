import {
  TedwordState,
  PuzzlesMap,
  PuzzlesMetadataMap,
} from '../types';

export const getPuzzlesMetadata = (state: TedwordState): PuzzlesMetadataMap => {
  return state.puzzlesState.puzzlesMetadata;
};

export const getPuzzlesMap = (state: TedwordState): PuzzlesMap => {
  return state.puzzlesState.puzzles;
};

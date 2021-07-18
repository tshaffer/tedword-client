import {
  TedwordState,
  PuzzlesMetadataMap,
} from '../types';

export const getPuzzlesMetadata = (state: TedwordState): PuzzlesMetadataMap => {
  return state.puzzlesMetadata;
};

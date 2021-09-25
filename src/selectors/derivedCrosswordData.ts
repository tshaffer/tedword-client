import { CluesByDirection, GridSpec, TedwordState } from '../types';

export const getSize = (state: TedwordState): number => {
  return state.derivedCrosswordData.size;
};

export const getGridData = (state: TedwordState): GridSpec => {
  return state.derivedCrosswordData.gridData;
};

export const getCrosswordClues = (state: TedwordState): CluesByDirection | null => {
  return state.derivedCrosswordData.cluesByDirection;
};

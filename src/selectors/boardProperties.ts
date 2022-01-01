import {
  BoardProperties,
  TedwordState
} from '../types';

export const getBoardProperties = (state: TedwordState): BoardProperties => {
  return state.boardProperties;
};

export const getFocused = (state: TedwordState): boolean => {
  return state.boardProperties.focused;
};

export const getCurrentDirection = (state: TedwordState): string => {
  return state.boardProperties.currentDirection;
};

export const getCurrentNumber = (state: TedwordState): string => {
  return state.boardProperties.currentNumber;
};

export const getSelectedDirection = (state: TedwordState): string => {
  return state.boardProperties.selectedDirection;
};

export const getSelectedNumber = (state: TedwordState): string => {
  return state.boardProperties.selectedNumber;
};

export const getFocusedRow = (state: TedwordState): number => {
  return state.boardProperties.focusedRow;
};

export const getFocusedCol = (state: TedwordState): number => {
  return state.boardProperties.focusedCol;
};

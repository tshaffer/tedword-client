import {
  AppState,
  TedwordState
} from '../types';

export const getAppState = (state: TedwordState): AppState => {
  return state.appState;
};

export const getAppInitialized = (state: TedwordState): boolean => {
  return state.appState.appInitialized;
};

export const getBoardId = (state: TedwordState): string => {
  return state.appState.boardId;
};

export const getCurrentUser = (state: TedwordState): string | null => {
  return state.appState.userName;
};

export const getPuzzlePlayActive = (state: TedwordState): boolean => {
  return state.appState.puzzlePlayActive;
};

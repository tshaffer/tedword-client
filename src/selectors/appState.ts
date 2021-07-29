import {
  AppState,
  TedwordState
} from '../types';

export const getAppState = (state: TedwordState): AppState => {
  return state.appState;
};

export const getBoardId = (state: TedwordState): string => {
  return state.appState.boardId;
};
import {
  AppState,
  TedwordState
} from '../types';

export const getAppState = (state: TedwordState): AppState => {
  return state.appState;
};

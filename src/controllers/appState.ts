import { isString } from 'lodash';

import {
  StartPage,
  TedwordState,
  UiState,
} from '../types';
import {
  setUiState
} from '../models';
import {
  getStartPage,
  getStartupBoardId,
} from '../selectors';
import {
  launchExistingGame,
} from './board';

export const setStartupAppState = () => {
  return (dispatch: any, getState: any) => {
    const state: TedwordState = getState();
    const startPage: StartPage = getStartPage(state);
    if (startPage === StartPage.JoinGame) {
      const startupBoardId = getStartupBoardId(state);
      if (isString(startupBoardId)) {
        dispatch(setUiState(UiState.SelectPuzzleOrBoard));
        dispatch(launchExistingGame(startupBoardId));
        return;
      }
    }
    dispatch(setUiState(UiState.SelectPuzzleOrBoard));
  };
};
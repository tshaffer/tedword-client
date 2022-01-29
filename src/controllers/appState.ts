import { isEmpty, isNil, isString } from 'lodash';

import * as QueryString from 'query-string';

import {
  StartPage,
  StartupParams,
  TedwordState,
  UiState,
} from '../types';

import { loadBoards, launchExistingGame } from './board';
import { loadPuzzlesMetadata } from './puzzle';
import { loadUsers, loginPersistentUser } from './user';
import { getVersions } from './versionInfo';

import {
  setAppInitialized,
  setStartPage,
  setStartupBoardId,
  setUiState
} from '../models';

import {
  getStartPage,
  getStartupBoardId,
} from '../selectors';

const getStartupParams = () => {

  return (dispatch: any) => {

    console.log(window.location.href);

    // updated code based on new form of url
    const urlParts: string[] = window.location.href.split('/');
    const indexOfGame = urlParts.lastIndexOf('game');
    if (indexOfGame >= 0) {
      const indexOfExisting = urlParts.lastIndexOf('existing');
      if (indexOfExisting > 0 && indexOfExisting === (indexOfGame + 1)) {
        if (urlParts.length > (indexOfExisting + 1)) {
          const boardId = urlParts[indexOfExisting + 1];

          console.log('join game with boardId', boardId);
          dispatch(setStartPage(StartPage.JoinGame));
          dispatch(setStartupBoardId(boardId as string));

          return {
            startPage: StartPage.JoinGame,
            startupBoardId: boardId,
          };
        }
      }
    }

    return {
      startPage: StartPage.Standard,
      startupBoardId: null,
    } as StartupParams;
  };
};

export const initializeApp = () => {
  return (dispatch: any) => {

    dispatch(getVersions());

    const startupParams: StartupParams = dispatch(getStartupParams());

    const loadPuzzlesMetadataPromise = dispatch(loadPuzzlesMetadata());
    const loadBoardsPromise = dispatch(loadBoards());
    const loadUsersPromise = dispatch(loadUsers());
    Promise.all([loadPuzzlesMetadataPromise, loadBoardsPromise, loadUsersPromise])
      .then(() => {

        const loggedInUser = dispatch(loginPersistentUser());

        if (isNil(loggedInUser)) {
          dispatch(setUiState(UiState.SelectUser));
        } else if (startupParams.startPage === StartPage.JoinGame && isString(startupParams.startupBoardId)) {
          dispatch(setUiState(UiState.SelectPuzzleOrBoard));
          dispatch(launchExistingGame(startupParams.startupBoardId));
        } else {
          dispatch(setUiState(UiState.SelectPuzzleOrBoard));
        }

        dispatch(setAppInitialized());
      });
  };
};

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
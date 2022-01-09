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
    const parsedQueryParams = QueryString.parse(window.location.search);
    console.log(parsedQueryParams);

    if (!isEmpty(parsedQueryParams)) {

      if (isString(parsedQueryParams.startpage) && parsedQueryParams.startpage === 'joinGame' && !isNil(parsedQueryParams.boardId)) {
        // TEDTODO - validity checking
        // http://localhost:8000/?user=Ted&boardId=863c7139-6b17-4762-95a7-37fe65747719

        const boardId = parsedQueryParams.boardId;
        // TEDTODO - typescript thinks that boardId could be an array

        dispatch(setStartPage(StartPage.JoinGame));
        dispatch(setStartupBoardId(boardId as string));

        return {
          startPage: StartPage.JoinGame,
          startupBoardId: boardId,
        };
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
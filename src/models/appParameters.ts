import { AppParameters, StartPage } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_START_PAGE = 'SET_START_PAGE';
export const SET_STARTUP_BOARD_ID = 'SET_STARTUP_BOARD_ID';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetStartPagePayload {
  startPage: StartPage;
}

export const setStartPage = (
  startPage: StartPage,
): any => {
  return {
    type: SET_START_PAGE,
    payload: {
      startPage,
    },
  };
};

export interface SetStartupBoardIdPayload {
  boardId: string;
}

export const setStartupBoardId = (
  boardId: string,
): any => {
  return {
    type: SET_STARTUP_BOARD_ID,
    payload: {
      boardId,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppParameters = {
  startPage: StartPage.Standard,
  startupBoardId: null,
};

export const appParametersReducer = (
  state: AppParameters = initialState,
  action: TedwordModelBaseAction<SetStartPagePayload & SetStartupBoardIdPayload>
): AppParameters => {
  switch (action.type) {
    case SET_START_PAGE: {
      return { ...state, startPage: action.payload.startPage };
    }
    case SET_STARTUP_BOARD_ID: {
      return { ...state, startupBoardId: action.payload.boardId };
    }
    default:
      return state;
  }
};

import { cloneDeep } from 'lodash';
import { AppState, UiState, User, UsersMap } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER = 'SET_USER';
export const SET_PUZZLE_ID = 'SET_PUZZLE_ID';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetUiStatePayload {
  uiState: UiState;
}

export const setUiState = (
  uiState: UiState,
): any => {
  return {
    type: SET_UI_STATE,
    payload: {
      uiState,
    },
  };
};

export interface SetUserPayload {
  userName: string;
}

export const setUser = (
  userName: string,
): any => {
  return {
    type: SET_USER,
    payload: {
      userName,
    },
  };
};

export interface SetPuzzleIdPayload {
  puzzleId: string;
}

export const setPuzzleId = (
  puzzleId: string,
): any => {
  return {
    type: SET_PUZZLE_ID,
    payload: {
      puzzleId,
    },
  };
};


// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  uiState: UiState.SelectUser,
  userName: '',
  puzzleId: '',
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedwordModelBaseAction<SetUiStatePayload & SetUserPayload & SetPuzzleIdPayload>
): AppState => {
  switch (action.type) {
    case SET_UI_STATE: {
      return { ...state, uiState: action.payload.uiState };
    }
    case SET_USER: {
      return { ...state, userName: action.payload.userName };
    }
    case SET_PUZZLE_ID: {
      return { ...state, puzzleId: action.payload.puzzleId };
    }
    default:
      return state;
  }
};

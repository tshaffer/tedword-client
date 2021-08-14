import { AppState, ParsedClue, UiState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_PUZZLE_ID = 'SET_PUZZLE_ID';
export const SET_BOARD_ID = 'SET_BOARD_ID';
export const SET_FOCUSED_CLUES = 'SET_FOCUSED_CLUES';

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

export interface SetUserNamePayload {
  userName: string;
}

export const setUserName = (
  userName: string,
): any => {
  return {
    type: SET_USER_NAME,
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

export interface SetBoardIdPayload {
  boardId: string;
}

export const setBoardId = (
  boardId: string,
): any => {
  return {
    type: SET_BOARD_ID,
    payload: {
      boardId,
    },
  };
};

export interface SetFocusedClues {
  focusedAcrossClue: ParsedClue;
  focusedDownClue: ParsedClue;
}

export const setFocusedClues = (
  focusedAcrossClue: ParsedClue,
  focusedDownClue: ParsedClue,
): any => {
  return {
    type: SET_FOCUSED_CLUES,
    payload: {
      focusedAcrossClue,
      focusedDownClue,
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
  boardId: '',
  focusedAcrossClue: null,
  focusedDownClue: null,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedwordModelBaseAction<SetUiStatePayload & SetUserNamePayload & SetPuzzleIdPayload & SetBoardIdPayload & SetFocusedClues>
): AppState => {
  switch (action.type) {
    case SET_UI_STATE: {
      return { ...state, uiState: action.payload.uiState };
    }
    case SET_USER_NAME: {
      return { ...state, userName: action.payload.userName };
    }
    case SET_PUZZLE_ID: {
      return { ...state, puzzleId: action.payload.puzzleId };
    }
    case SET_BOARD_ID: {
      return { ...state, boardId: action.payload.boardId };
    }
    case SET_FOCUSED_CLUES:
      // return { ...state, focusedAcrossClue: action.payload.focusedAcrossClue, focusedDownClue: action.payload.focusedDownClue };
      return state;
    default:
      return state;
  }
};

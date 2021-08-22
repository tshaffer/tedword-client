import { AppState, UiState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_PUZZLE_ID = 'SET_PUZZLE_ID';
export const SET_BOARD_ID = 'SET_BOARD_ID';
export const SET_FILE_UPLOAD_STATUS = 'SET_FILE_UPLOAD_STATUS';

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

export interface SetFileUploadStatusPayload {
  fileUploadStatus: string;
}

export const setFileUploadStatus = (
  fileUploadStatus: string,
): any => {
  return {
    type: SET_FILE_UPLOAD_STATUS,
    payload: {
      fileUploadStatus,
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
  fileUploadStatus: '',
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedwordModelBaseAction<SetUiStatePayload & SetUserNamePayload & SetPuzzleIdPayload & SetBoardIdPayload & SetFileUploadStatusPayload>
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
    case SET_FILE_UPLOAD_STATUS: {
      return { ...state, fileUploadStatus: action.payload.fileUploadStatus };
    }
    default:
      return state;
  }
};

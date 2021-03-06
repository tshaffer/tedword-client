import { AppState, UiState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_APP_INITIALIZED = 'SET_APP_INITIALIZED';
export const SET_UI_STATE = 'SET_UI_STATE';
export const SET_USER_NAME = 'SET_USER_NAME';
export const SET_PUZZLE_ID = 'SET_PUZZLE_ID';
export const SET_BOARD_ID = 'SET_BOARD_ID';
export const SET_FILE_UPLOAD_STATUS = 'SET_FILE_UPLOAD_STATUS';
export const SET_PUZZLE_PLAY_ACTIVE = 'SET_PUZZLE_PLAY_ACTIVE';

// ------------------------------------
// Actions
// ------------------------------------

export const setAppInitialized = (): any => {
  return {
    type: SET_APP_INITIALIZED,
  };
};

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

export interface SetPuzzlePlayActivePayload {
  puzzlePlayActive: boolean;
}

export const setPuzzlePlayActive = (
  puzzlePlayActive: boolean,
): any => {
  return {
    type: SET_PUZZLE_PLAY_ACTIVE,
    payload: {
      puzzlePlayActive,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: AppState = {
  appInitialized: false,
  uiState: UiState.SelectUser,
  userName: null,
  puzzleId: '',
  boardId: '',
  fileUploadStatus: '',
  puzzlePlayActive: false,
};

export const appStateReducer = (
  state: AppState = initialState,
  action: TedwordModelBaseAction<SetUiStatePayload & SetUserNamePayload & SetPuzzleIdPayload & SetBoardIdPayload & SetFileUploadStatusPayload & SetPuzzlePlayActivePayload>
): AppState => {
  switch (action.type) {
    case SET_APP_INITIALIZED: {
      return { ...state, appInitialized: true};
    }
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
    case SET_PUZZLE_PLAY_ACTIVE: {
      return { ...state, puzzlePlayActive: action.payload.puzzlePlayActive };
    }
    default:
      return state;
  }
};

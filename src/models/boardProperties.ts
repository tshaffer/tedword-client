import { BoardProperties } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_FOCUSED = 'SET_FOCUSED';
export const SET_CURRENT_DIRECTION = 'SET_CURRENT_DIRECTION';
export const SET_CURRENT_NUMBER = 'SET_CURRENT_NUMBER';
export const SET_FOCUSED_ROW = 'SET_FOCUSED_ROW';
export const SET_FOCUSED_COL = 'SET_FOCUSED_COL';
export const SET_INPUT_ELEMENT = 'SET_INPUT_ELEMENT';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetFocusedPayload {
  focused: boolean;
}

export const setFocused = (
  focused: boolean,
): any => {
  return {
    type: SET_FOCUSED,
    payload: {
      focused,
    },
  };
};

export interface SetCurrentDirectionPayload {
  currentDirection: string;
}

export const setCurrentDirection = (
  currentDirection: string,
): any => {
  return {
    type: SET_CURRENT_DIRECTION,
    payload: {
      currentDirection,
    },
  };
};

export interface SetCurrentNumberPayload {
  currentNumber: string;
}

export const setCurrentNumber = (
  currentNumber: string,
): any => {
  return {
    type: SET_CURRENT_NUMBER,
    payload: {
      currentNumber,
    },
  };
};

export interface SetFocusedRowPayload {
  focusedRow: number;
}

export const setFocusedRow = (
  focusedRow: number,
): any => {
  return {
    type: SET_FOCUSED_ROW,
    payload: {
      focusedRow,
    },
  };
};

export interface SetFocusedColPayload {
  focusedCol: number;
}

export const setFocusedCol = (
  focusedCol: number,
): any => {
  return {
    type: SET_FOCUSED_COL,
    payload: {
      focusedCol,
    },
  };
};

export interface SetInputElementPayload {
  inputElement: HTMLInputElement;
}

export const setInputElement = (
  inputElement: HTMLInputElement,
): any => {
  return {
    type: SET_INPUT_ELEMENT,
    payload: {
      inputElement,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: BoardProperties = {
  focused: false,
  currentDirection: 'across',
  currentNumber: '1',
  focusedRow: 0,
  focusedCol: 0,
  inputElement: null,
};

export const boardPropertiesReducer = (
  state: BoardProperties = initialState,
  action: TedwordModelBaseAction<SetFocusedPayload & SetCurrentDirectionPayload & SetCurrentNumberPayload & SetCurrentDirectionPayload & SetFocusedRowPayload & SetFocusedColPayload & SetInputElementPayload>
): BoardProperties => {
  switch (action.type) {
    case SET_FOCUSED: {
      return { ...state, focused: action.payload.focused };
    }
    case SET_CURRENT_DIRECTION: {
      return { ...state, currentDirection: action.payload.currentDirection };
    }
    case SET_CURRENT_NUMBER: {
      return { ...state, currentNumber: action.payload.currentNumber };
    }
    case SET_FOCUSED_ROW: {
      return { ...state, focusedRow: action.payload.focusedRow };
    }
    case SET_FOCUSED_COL: {
      return { ...state, focusedCol: action.payload.focusedCol };
    }
    case SET_INPUT_ELEMENT: {
      return { ...state, inputElement: action.payload.inputElement };
    }
    default:
      return state;
  }
};

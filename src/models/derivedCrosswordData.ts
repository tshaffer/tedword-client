import { Clues, CluesByDirection, DerivedCrosswordData, GridSpec } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_GRID_DATA = 'SET_GRID_DATA';
export const SET_SIZE = 'SET_SIZE';
export const SET_CROSSSWORD_CLUES = 'SET_CROSSSWORD_CLUES';
export const SET_CLUES = 'SET_CLUES';
export const SET_ACTIVE_PUZZLE = 'SET_ACTIVE_PUZZLE';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetSizePayload {
  size: number;
}

export const setSize = (
  size: number
): any => {
  return {
    type: SET_SIZE,
    payload: {
      size
    }
  };
};

export interface SetGridDataPayload {
  gridData: GridSpec | null;
}

export const setGridData = (
  gridData: GridSpec | null,
): any => {
  return {
    type: SET_GRID_DATA,
    payload: {
      gridData,
    },
  };
};

export interface SetCrosswordCluesPayload {
  crosswordClues: CluesByDirection | null;
}

export const setCrosswordClues = (
  crosswordClues: CluesByDirection | null,
): any => {
  return {
    type: SET_CROSSSWORD_CLUES,
    payload: {
      crosswordClues,
    }
  };
};

export interface SetCluesPayload {
  clues: Clues | null;
}

export const setClues = (
  clues: Clues | null,
): any => {
  return {
    type: SET_CLUES,
    payload: {
      clues,
    }
  };
};
// ------------------------------------
// Reducer
// ------------------------------------

const initialState: DerivedCrosswordData = {
  size: 0,
  gridData: [],
  cluesByDirection: null,
  clues: {
    across: [],
    down: [],
  },
};

export const derivedCrosswordDataReducer = (
  state: DerivedCrosswordData = initialState,
  action: TedwordModelBaseAction<SetSizePayload & SetGridDataPayload & SetCrosswordCluesPayload & SetCluesPayload>
): DerivedCrosswordData => {
  switch (action.type) {
    case SET_SIZE: {
      return { ...state, size: action.payload.size };
    }
    case SET_GRID_DATA: {
      return { ...state, gridData: action.payload.gridData };
    }
    case SET_CROSSSWORD_CLUES: {
      return { ...state, cluesByDirection: action.payload.crosswordClues };
    }
    case SET_CLUES: {
      return { ...state, clues: action.payload.clues };
    }
    default:
      return state;
  }
};

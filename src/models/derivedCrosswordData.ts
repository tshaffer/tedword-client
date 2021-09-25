import { cloneDeep } from 'lodash';
import { ClueAtLocation, CluesByDirection, DerivedCrosswordData, GridSpec } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_GRID_DATA = 'SET_GRID_DATA';
export const SET_SIZE = 'SET_SIZE';
export const SET_CROSSSWORD_CLUES = 'SET_CROSSSWORD_CLUES';
export const SET_ACTIVE_PUZZLE = 'SET_ACTIVE_PUZZLE';
export const UPDATE_COMPLETELY_FILLED_IN = 'UPDATE_COMPLETELY_FILLED_IN';

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

export interface UpdateCompletelyFilledInPayload {
  direction: string,
  clueNumber: number,
  completelyFilledIn: boolean,
}

export const updateCompletelyFilledIn = (
  direction: string,
  clueNumber: number,
  completelyFilledIn: boolean,
): any => {
  return {
    type: UPDATE_COMPLETELY_FILLED_IN,
    payload: {
      direction,
      clueNumber,
      completelyFilledIn,
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
};

export const derivedCrosswordDataReducer = (
  state: DerivedCrosswordData = initialState,
  action: TedwordModelBaseAction<SetSizePayload & SetGridDataPayload & SetCrosswordCluesPayload & UpdateCompletelyFilledInPayload>
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
    case UPDATE_COMPLETELY_FILLED_IN: {
      const { direction, clueNumber, completelyFilledIn } = action.payload;

      const newState = cloneDeep(state) as DerivedCrosswordData;
      const clueAtLocation: ClueAtLocation = newState.cluesByDirection[direction][clueNumber];
      clueAtLocation.completelyFilledIn = completelyFilledIn;

      return newState;
    }
    default:
      return state;
  }
};

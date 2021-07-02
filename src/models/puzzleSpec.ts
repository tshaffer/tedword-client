import { cloneDeep } from 'lodash';
import { PuzzleSpec } from '../types';
import { TedwordApiAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------

export const SET_PUZZLE_NAME = 'SET_PUZZLE_NAME';


// ------------------------------------
// Actions
// ------------------------------------

export interface SetPuzzleNamePayload {
  puzzleName: string;
}

export const setPuzzleName = (
  puzzleName: string,
): TedwordApiAction<SetPuzzleNamePayload> => {

  return {
    type: SET_PUZZLE_NAME,
    payload: {
      puzzleName,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

// TEDTODO - initialize
const initialState: PuzzleSpec = {
  name: '',
};

export const puzzleSpecReducer = (
  state: PuzzleSpec = initialState,
  action: TedwordApiAction<SetPuzzleNamePayload>
): PuzzleSpec => {
  switch (action.type) {
    case SET_PUZZLE_NAME: {
      const newState = cloneDeep(state);
      const { puzzleName } = action.payload;
      newState.name = puzzleName;
      return newState;
    }
    default:
      return state;
  }
};


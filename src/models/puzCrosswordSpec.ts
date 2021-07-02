import { cloneDeep } from 'lodash';
import { PuzzleSpec, PuzCrosswordSpec } from '../types';
import { TedwordApiAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------

export const SET_PUZCROSSWORD_SPEC = 'SET_PUZCROSSWORD_SPEC';


// ------------------------------------
// Actions
// ------------------------------------

export interface SetPuzCrosswordSpecPayload {
  puzCrosswordSpec: PuzCrosswordSpec;
}

export const setPuzCrosswordSpec = (
  puzCrosswordSpec: PuzCrosswordSpec,
): TedwordApiAction<any> => {

  return {
    type: SET_PUZCROSSWORD_SPEC,
    payload: puzCrosswordSpec,
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

// TEDTODO - initialize
const initialState: PuzCrosswordSpec = {
  title: '',
  author: '',
  copyright: '',
  note: '',
  width: 0,
  height: 0,
  clues: [],
  solution: '',
  state: '',
  hasState: false,
  parsedClues: []
};

export const puzCrosswordSpecReducer = (
  state: PuzCrosswordSpec = initialState,
  action: TedwordApiAction<any>
): PuzCrosswordSpec => {
  switch (action.type) {
    case SET_PUZCROSSWORD_SPEC: {
      // const newState = cloneDeep(state);
      // const { puzCrosswordSpec } = action.payload;
      return action.payload;
    }
    default:
      return state;
  }
};


import { GameState, ParsedClue } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_FOCUSED_CLUES = 'SET_FOCUSED_CLUES';

// ------------------------------------
// Actions
// ------------------------------------

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

const initialState: GameState = {
  focusedAcrossClue: null,
  focusedDownClue: null,
};

export const gameStateReducer = (
  state: GameState = initialState,
  action: TedwordModelBaseAction<SetFocusedClues>
): GameState => {
  switch (action.type) {
    case SET_FOCUSED_CLUES:
      return { ...state, focusedAcrossClue: action.payload.focusedAcrossClue, focusedDownClue: action.payload.focusedDownClue };
    default:
      return state;
  }
};

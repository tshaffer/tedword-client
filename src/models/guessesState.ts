import { cloneDeep } from 'lodash';
import { GuessesState, Guess, GuessesGrid } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const INITIALIZE_GUESS_GRID = 'INITIALIZE_GUESS_GRID';
export const UPDATE_GUESS = 'UPDATE_GUESS';
export const UPDATE_ALL_GUESSSES = 'UPDATE_ALL_GUESSSES';

// ------------------------------------
// Actions
// ------------------------------------

export interface InitializeGuessGridPayload {
  guesses: GuessesGrid,
}

export const initializeGuesses = (
  guesses: GuessesGrid,
): any => {
  return {
    type: INITIALIZE_GUESS_GRID,
    payload: {
      guesses,
    },
  };
};

export interface UpdateGuessPayload {
  row: number;
  col: number;
  puzzleGuess: Guess;
}

export const updateGuess = (
  row: number,
  col: number,
  puzzleGuess: Guess,
): any => {
  return {
    type: UPDATE_GUESS,
    payload: {
      row,
      col,
      puzzleGuess,
    },
  };
};

export interface UpdateAllGuessesPayload {
  guesses: GuessesGrid,
}

export const updateAllGuesses = (
  guesses: GuessesGrid,
): any => {
  return {
    type: UPDATE_ALL_GUESSSES,
    payload: {
      guesses,
    },
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GuessesState = {
  guessesGrid: null,
};

export const guessesStateReducer = (
  state: GuessesState = initialState,
  action: TedwordModelBaseAction<InitializeGuessGridPayload & UpdateGuessPayload & UpdateAllGuessesPayload>
): GuessesState => {
  switch (action.type) {
    case INITIALIZE_GUESS_GRID:
    case UPDATE_ALL_GUESSSES: {
      return { ...state, guessesGrid: action.payload.guesses };
    }
    case UPDATE_GUESS: {
      const newState = cloneDeep(state);
      newState.guessesGrid[action.payload.row][action.payload.col] = action.payload.puzzleGuess;
      return newState;
    }
    default:
      return state;
  }
};

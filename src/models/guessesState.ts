import { cloneDeep } from 'lodash';
import { GuessesState, Guess, GuessesGrid } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const INITIALIZE_GUESS_GRID = 'INITIALIZE_GUESS_GRID';
export const UPDATE_GUESS = 'UPDATE_GUESS';

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

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: GuessesState = {
  guessesGrid: null,
};

export const guessesStateReducer = (
  state: GuessesState = initialState,
  action: TedwordModelBaseAction<InitializeGuessGridPayload & UpdateGuessPayload>
): GuessesState => {
  switch (action.type) {
    case INITIALIZE_GUESS_GRID: {
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

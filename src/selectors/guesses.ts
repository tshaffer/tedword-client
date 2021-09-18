import { GuessesGrid, TedwordState } from '../types';

export const getGuesses = (state: TedwordState): GuessesGrid | null => {
  return state.guessesState.guessesGrid;
};

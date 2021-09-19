/** @module Model:base */

import { combineReducers } from 'redux';
import { TedwordState } from '../types';
import { puzzlesStateReducer } from './puzzles';
import { usersReducer } from './users';
import { appStateReducer } from './appState';
import { boardsStateReducer } from './boards';
import { gameStateReducer } from './gameState';
import { guessesStateReducer } from './guessesState';
import { derivedCrosswordDataReducer } from './derivedCrosswordData';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedwordState>({
  users: usersReducer,
  boardsState: boardsStateReducer,
  puzzlesState: puzzlesStateReducer,
  appState: appStateReducer,
  gameState: gameStateReducer,

  derivedCrosswordData: derivedCrosswordDataReducer,
  guessesState: guessesStateReducer,

});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


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
import { chatStateReducer } from './chat';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedwordState>({
  appState: appStateReducer,
  boardsState: boardsStateReducer,
  chat: chatStateReducer,
  users: usersReducer,
  puzzlesState: puzzlesStateReducer,
  gameState: gameStateReducer,
  derivedCrosswordData: derivedCrosswordDataReducer,
  guessesState: guessesStateReducer,

});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


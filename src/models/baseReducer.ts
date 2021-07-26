/** @module Model:base */

import { combineReducers } from 'redux';
import { TedwordState } from '../types';
import { puzCrosswordSpecReducer } from './puzCrosswordSpec';
import { puzzlesStateReducer } from './puzzles';
import { usersReducer } from './users';
import { appStateReducer } from './appState';
import { boardsStateReducer } from './boards';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedwordState>({
  puzCrosswordSpec: puzCrosswordSpecReducer,
  users: usersReducer,
  boardsState: boardsStateReducer,
  puzzlesState: puzzlesStateReducer,
  appState: appStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


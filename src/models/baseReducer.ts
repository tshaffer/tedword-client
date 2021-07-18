/** @module Model:base */

import { combineReducers } from 'redux';
import { TedwordState } from '../types';
import { puzCrosswordSpecReducer } from './puzCrosswordSpec';
import { puzzlesMetadataReducer } from './puzzles';
import { puzzleSpecReducer } from './puzzleSpec';
import { usersReducer } from './users';
import { appStateReducer } from './appState';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedwordState>({
  puzzleSpec: puzzleSpecReducer,
  puzCrosswordSpec: puzCrosswordSpecReducer,
  users: usersReducer,
  puzzlesMetadata: puzzlesMetadataReducer,
  appState: appStateReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


/** @module Model:base */

import { combineReducers } from 'redux';
import { TedwordState } from '../types';
import { puzCrosswordSpecReducer } from './puzCrosswordSpec';
import { puzzleSpecReducer } from './puzzleSpec';

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export const rootReducer = combineReducers<TedwordState>({
  puzzleSpec: puzzleSpecReducer,
  puzCrosswordSpec: puzCrosswordSpecReducer,
});

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------


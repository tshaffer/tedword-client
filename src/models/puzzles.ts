import { cloneDeep } from 'lodash';
import { PuzzleMetadata, PuzzlesMetadataMap, User, UsersMap } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PUZZLE_METADATA = 'ADD_PUZZLE_METADATA';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddPuzzleMetadataPayload {
  id: string;
  puzzleMetadata: PuzzleMetadata;
}

export const addPuzzleMetadata = (
  id: string,
  puzzleMetadata: PuzzleMetadata
): any => {
  return {
    type: ADD_PUZZLE_METADATA,
    payload: {
      id,
      puzzleMetadata,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PuzzlesMetadataMap = {};

export const puzzlesMetadataReducer = (
  state: PuzzlesMetadataMap = initialState,
  action: TedwordModelBaseAction<AddPuzzleMetadataPayload>
): PuzzlesMetadataMap => {
  switch (action.type) {
    case ADD_PUZZLE_METADATA: {
      const newState = cloneDeep(state);
      newState[action.payload.id] = action.payload.puzzleMetadata;
      return newState;
    }
    default:
      return state;
  }
};

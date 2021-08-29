import { cloneDeep } from 'lodash';
import { PuzzleMetadata, PuzzlesMetadataMap, PuzzleEntity, PuzzlesState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_PUZZLE_METADATA = 'ADD_PUZZLE_METADATA';
export const ADD_PUZZLE = 'ADD_PUZZLE';

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

export interface AddPuzzlePayload {
  id: string;
  puzzle: PuzzleEntity;
}

export const addPuzzle = (
  id: string,
  puzzle: PuzzleEntity
): any => {
  return {
    type: ADD_PUZZLE,
    payload: {
      id,
      puzzle,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: PuzzlesState = 
{
  puzzlesMetadata: {},
  puzzles: {},
  puzzlesByFileName: {},
};

export const puzzlesStateReducer = (
  state: PuzzlesState = initialState,
  action: TedwordModelBaseAction<AddPuzzleMetadataPayload & AddPuzzlePayload>
): PuzzlesState => {
  switch (action.type) {
    case ADD_PUZZLE_METADATA: {
      const newState = cloneDeep(state) as PuzzlesState;
      newState.puzzlesMetadata[action.payload.id] = action.payload.puzzleMetadata;
      newState.puzzlesByFileName[action.payload.puzzleMetadata.sourceFileName] = true;
      return newState;
    }
    case ADD_PUZZLE: {
      const newState = cloneDeep(state) as PuzzlesState;
      newState.puzzles[action.payload.id] = action.payload.puzzle;
      return newState;
    }
    default:
      return state;
  }
};

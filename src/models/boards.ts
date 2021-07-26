import { cloneDeep } from 'lodash';
import { BoardEntity, BoardsState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_BOARD = 'ADD_BOARD';

// ------------------------------------
// Actions
// ------------------------------------

export interface AddBoardPayload {
  id: string;
  board: BoardEntity;
}

export const addBoard = (
  id: string,
  board: BoardEntity
): any => {
  return {
    type: ADD_BOARD,
    payload: {
      id,
      board,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: BoardsState = 
{
  boards: {},
};

export const boardsStateReducer = (
  state: BoardsState = initialState,
  action: TedwordModelBaseAction<AddBoardPayload>
): BoardsState => {
  switch (action.type) {
    case ADD_BOARD: {
      const newState = cloneDeep(state) as BoardsState;
      newState.boards[action.payload.id] = action.payload.board;
      return newState;
    }
    default:
      return state;
  }
};

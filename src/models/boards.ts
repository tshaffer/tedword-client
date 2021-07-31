import { cloneDeep } from 'lodash';
import { BoardEntity, BoardsState, CellContentsMap } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_BOARD = 'ADD_BOARD';
export const SET_CELL_CONTENTS = 'SET_CELL_CONTENTS';

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

export interface SetCellContentsPayload {
  id: string;
  cellContents: CellContentsMap;
}

export const setCellContents = (
  id: string,
  cellContents: CellContentsMap
): any => {
  return {
    type: SET_CELL_CONTENTS,
    payload: {
      id,
      cellContents,
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
  action: TedwordModelBaseAction<AddBoardPayload & SetCellContentsPayload>
): BoardsState => {
  switch (action.type) {
    case ADD_BOARD: {
      const newState = cloneDeep(state) as BoardsState;
      newState.boards[action.payload.id] = action.payload.board;
      return newState;
    }
    case SET_CELL_CONTENTS: {
      const newState = cloneDeep(state) as BoardsState;
      const boardEntity: BoardEntity = newState.boards[action.payload.id];
      boardEntity.cellContents = action.payload.cellContents;
      return newState;
    }
    default:
      return state;
  }
};

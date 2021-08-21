import { cloneDeep } from 'lodash';
import { BoardEntity, BoardsState, CellContentsMap } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_BOARD = 'ADD_BOARD';
export const ADD_USER_TO_BOARD = 'ADD_USER_TO_BOARD';
export const SET_CELL_CONTENTS = 'SET_CELL_CONTENTS';
export const UPDATE_LAST_PLAYED_DATE_TIME = 'UPDATE_LAST_PLAYED_DATE_TIME';

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

export interface AddUserToBoardPayload {
  id: string;
  userName: string;
}

export const addUserToBoard = (
  id: string,
  userName: string,
): any => {
  return {
    type: ADD_USER_TO_BOARD,
    payload: {
      id,
      userName,
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

export interface UpdateLastPlayedDateTimePayload {
  id: string;
  lastPlayedDateTime: Date;
}

export const updateLastPlayedDateTimeRedux = (
  id: string,
  lastPlayedDateTime: Date,
): any => {
  return {
    type: UPDATE_LAST_PLAYED_DATE_TIME,
    payload: {
      id,
      lastPlayedDateTime,
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
  action: TedwordModelBaseAction<AddBoardPayload & AddUserToBoardPayload & SetCellContentsPayload & UpdateLastPlayedDateTimePayload>
): BoardsState => {
  switch (action.type) {
    case ADD_BOARD: {
      const newState = cloneDeep(state) as BoardsState;
      newState.boards[action.payload.id] = action.payload.board;
      return newState;
    }
    case ADD_USER_TO_BOARD: {
      const newState = cloneDeep(state) as BoardsState;
      const boardEntity: BoardEntity = newState.boards[action.payload.id];
      boardEntity.users.push(action.payload.userName);
      return newState;
    }
    case SET_CELL_CONTENTS: {
      const newState = cloneDeep(state) as BoardsState;
      const boardEntity: BoardEntity = newState.boards[action.payload.id];
      boardEntity.cellContents = action.payload.cellContents;
      return newState;
    }
    case UPDATE_LAST_PLAYED_DATE_TIME: {
      const newState = cloneDeep(state) as BoardsState;
      const boardEntity: BoardEntity = newState.boards[action.payload.id];
      boardEntity.lastPlayedDateTime = action.payload.lastPlayedDateTime;
      return newState;
    }
    default:
      return state;
  }
};

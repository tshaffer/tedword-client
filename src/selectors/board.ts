/* eslint-disable no-prototype-builtins */
import {
  BoardEntity,
  BoardsMap,
  CellContentsMap,
  TedwordState
} from '../types';
import {
  getBoardId
} from '../selectors';


export const getBoards = (state: TedwordState): BoardsMap => {
  return state.boardsState.boards;
};

export const getBoard = (state: TedwordState, boardId: string): BoardEntity => {
  const boardsMap: BoardsMap = getBoards(state);
  if (boardsMap.hasOwnProperty(boardId)) {
    return boardsMap[boardId];
  }
  return null;
};

export const getCellContents = (state: TedwordState): CellContentsMap => {
  const boardId: string = getBoardId(state);
  const boardsMap: BoardsMap = getBoards(state);
  if (boardsMap.hasOwnProperty(boardId)) {
    return boardsMap[boardId].cellContents;
  }
  return null;
};

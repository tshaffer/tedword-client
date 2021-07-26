import {
  // BoardEntity,
  BoardsMap,
  TedwordState
} from '../types';

export const getBoards = (state: TedwordState): BoardsMap => {
  
  return state.boardsState.boards;
  // const boardEntities: BoardEntity[] = [];

  // const boardMaps: BoardsMap =  state.boardsState.boards;

  // for (const boardId in boardMaps) {
  //   if (Object.prototype.hasOwnProperty.call(boardMaps, boardId)) {
  //     const boardEntity: BoardEntity = boardMaps[boardId];
  //     boardEntities.push(boardEntity);
  //   }
  // }

  // return boardEntities;
};

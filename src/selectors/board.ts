/* eslint-disable no-prototype-builtins */
import {
  BoardEntity,
  BoardsMap,
  CellContentsMap,
  DisplayedPuzzle,
  ParsedClue,
  PuzzleEntity,
  TedwordState
} from '../types';
import {
  getBoardId
} from '../selectors';

import { boardPlayCrossword } from '../components/BoardPlay';

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
  console.log('getCellContents');
  console.log(state);
  const boardId: string = getBoardId(state);
  console.log(boardId);
  const boardsMap: BoardsMap = getBoards(state);
  console.log(boardsMap);
  if (boardsMap.hasOwnProperty(boardId)) {
    return boardsMap[boardId].cellContents;
  }
  return null;
};

// export const getBoardData = (state: TedwordState): DisplayedPuzzle => {
  
//   console.log('boardPlayCrossword');
//   console.log(boardPlayCrossword);

//   //         (boardPlayCrossword as any).current.remoteSetCell(row, col, typedChar);

//   const displayedPuzzle: DisplayedPuzzle = {
//     across: {},
//     down: {},
//   };

//   const puzzleId: string = state.appState.puzzleId;
//   if (!state.puzzlesState.puzzles.hasOwnProperty(puzzleId)) {
//     return displayedPuzzle;
//   }

//   const boardId: string = getBoardId(state);
//   const board: BoardEntity = getBoard(state, boardId);
//   const cellContents: CellContentsMap = board.cellContents;

//   const puzzleEntity: PuzzleEntity = state.puzzlesState.puzzles[puzzleId];
//   const parsedClues: ParsedClue[] = puzzleEntity.parsedClues;
//   for (const parsedClue of parsedClues) {
//     const { col, isAcross, row, text } = parsedClue;

//     let mySolution = '';

//     const key = row.toString() + '_' + col.toString();
//     if (cellContents.hasOwnProperty(key)) {
//       mySolution = cellContents[key];
//     }

//     if (isAcross) {
//       displayedPuzzle.across[parsedClue.number] = {
//         clue: text,
//         answer: mySolution,
//         row,
//         col,
//       };
//     } else {
//       displayedPuzzle.down[parsedClue.number] = {
//         clue: text,
//         answer: mySolution,
//         row,
//         col,
//       };
//     }
//   }
  
//   // for (const cellSpec in cellContents) {
//   //   if (cellContents.prototype.hasOwnProperty.call(cellContents, cellSpec)) {
//   //     const rowAndCol: string[] = cellSpec.split('_');
//   //     const row: number = parseInt(rowAndCol[0], 10);
//   //     const col: number = parseInt(rowAndCol[1], 10);
//   //     const typedChar: string = cellContents[cellSpec];
//   //     (boardPlayCrossword as any).current.remoteSetCell(row, col, typedChar);
//   //   }
//   // }

//   return displayedPuzzle;
// };


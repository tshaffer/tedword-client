/* eslint-disable no-prototype-builtins */
import axios from 'axios';
import {
  AppState,
  BoardEntity,
  CellContentsMap,
  PuzzleMetadata,
  PuzzlesMetadataMap,
  TedwordState
} from '../types';

import { apiUrlFragment, serverUrl } from '../index';
import {
  getBoard,
  getBoardId,
  getPuzzlesMetadata
} from '../selectors';
import { addBoard, setBoardId } from '../models';
import { boardPlayCrossword } from '../components/BoardPlay';
import { isNil } from 'lodash';

// import { boardPlayCrossword } from '../components/BoardPlay';

export const loadBoards = () => {
  return (dispatch: any) => {
    // const path = 'http://localhost:8888/api/v1/boards';
    const path = serverUrl + apiUrlFragment + 'boards';

    return axios.get(path)
      .then((boardsResponse: any) => {
        console.log('loadBoards response:');
        console.log(boardsResponse);
        const boardEntities: BoardEntity[] = (boardsResponse as any).data;
        // // TEDTODO - add all in a single call
        for (const boardEntity of boardEntities) {
          dispatch(addBoard(boardEntity.id, boardEntity));
        }
        if (boardEntities.length > 0) {
          dispatch(setBoardId(boardEntities[0].id));
        }
      });
  };
};

export const loadBoardCellContents = () => {
  return (dispatch: any, getState: any) => {

    if (isNil(boardPlayCrossword)) {
      return;
    }

    (boardPlayCrossword as any).current.reset();

    const state: TedwordState = getState();
    const boardId: string = getBoardId(state);
    const board: BoardEntity = getBoard(state, boardId);
    const cellContents: CellContentsMap = board.cellContents;
    for (const cellSpec in cellContents) {
      if (cellContents.hasOwnProperty(cellSpec)) {
        const rowAndCol: string[] = cellSpec.split('_');
        const row: number = parseInt(rowAndCol[0], 10);
        const col: number = parseInt(rowAndCol[1], 10);
        const typedChar: string = cellContents[cellSpec];
        (boardPlayCrossword as any).current.remoteSetCell(row, col, typedChar);
      }
    }
  };
};

export const createBoard = () => {

  return ((dispatch: any, getState: any): any => {

    const state: TedwordState = getState();

    const appState: AppState = state.appState;
    const puzzleId: string = appState.puzzleId;

    const puzzlesMetadataMap: PuzzlesMetadataMap = getPuzzlesMetadata(state);
    const puzzleMetadata: PuzzleMetadata = puzzlesMetadataMap[puzzleId];

    const currentDate = new Date();
    const currentDateTime = currentDate.toString();
    const title = puzzleMetadata.title + ' ' + currentDateTime;

    const path = serverUrl + apiUrlFragment + 'board';

    const createBoardBody: any = {
      puzzleId: puzzleId,
      title,
      users: [appState.userName],
      startDateTime: currentDate,
      lastPlayedDateTime: currentDate,
      elapsedTime: 0,
      solved: false,
      difficulty: 0
    };

    return axios.post(
      path,
      createBoardBody
    ).then((response) => {
      console.log(response);
      const boardId: string = response.data.data.id;
      dispatch(setBoardId(boardId));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });
  });
};


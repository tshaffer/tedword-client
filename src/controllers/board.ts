/* eslint-disable no-prototype-builtins */
import axios from 'axios';
import {
  AppState,
  BoardEntity,
  ParsedClue,
  PuzzleMetadata,
  PuzzlesMetadataMap,
  TedwordState
} from '../types';

import { apiUrlFragment, serverUrl } from '../index';
import {
  getBoard,
  getPuzzlesMetadata
} from '../selectors';
import { addBoard, addUser, addUserToBoard, setBoardId, setFocusedClues } from '../models';
import { isNil } from 'lodash';
import { getAppState, getPuzzle } from '../selectors';

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

        boardEntities.sort((a: BoardEntity, b: BoardEntity) => {
          return a.startDateTime > b.startDateTime
            ? -1
            : 1;
        });
        if (boardEntities.length > 0) {
          dispatch(setBoardId(boardEntities[0].id));
        }

      });
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
    const currentDateTime = currentDate.toLocaleDateString(
      'en',
      {
        month: 'long',
        day: 'numeric',
      }
    );

    // possible components of the title
    //    users (only a single user at the time of create)
    //    current date/time - formatting options
    //      day of week, day, month
    //      ??
    //    puzzle title
    const userName: string = appState.userName;
    const weekdayMonthDay: string = currentDate.toLocaleDateString(
      'en',
      {
        weekday: 'long',
        month: 'long',
        day: 'numeric',

      }
    );
    const puzzleTitle: string = puzzleMetadata.title.trim();
    // eslint-disable-next-line quotes
    const title = userName + ': ' + weekdayMonthDay + '. "' + puzzleTitle + '"';

    // const title = puzzleMetadata.title + ' ' + currentDateTime;

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

export const addUserToExistingBoard = (id: string, userName: string) => {

  return ((dispatch: any, getState: any): any => {

    const path = serverUrl + apiUrlFragment + 'addUserToBoard';

    const addUserToBoardBody: any = {
      boardId: id,
      userName,
    };

    return axios.post(
      path,
      addUserToBoardBody
    ).then((response) => {
      console.log(response);
      dispatch(addUserToBoard(id, userName));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

// TEDTODO - several ways to improve performance.
export const updateFocusedClues = (
  row: number,
  col: number,
) => {

  return ((dispatch: any, getState: any): any => {

    const state = getState();

    const appState: AppState = getAppState(state);
    if (isNil(appState)) {
      return;
    }
    const boardId: string = appState.boardId;
    const board: BoardEntity = getBoard(state, boardId);
    if (isNil(board)) {
      return;
    }
    const puzzleSpec = getPuzzle(state, board.puzzleId);
    if (isNil(puzzleSpec)) {
      return null;
    }
    const parsedClues: ParsedClue[] = puzzleSpec.parsedClues;

    const focusedRow = row;

    let matchedDownClue: ParsedClue | null = null;
    let matchedAcrossClue: ParsedClue | null = null;

    // get match for row
    while (row >= 0) {
      for (const parsedClue of parsedClues) {
        if (parsedClue.row === row && parsedClue.col === col && !parsedClue.isAcross) {
          matchedDownClue = parsedClue;
          break;
        }
      }
      if (!isNil(matchedDownClue)) {
        break;
      }
      row--;
    }

    // get match for col
    row = focusedRow;
    while (col >= 0) {
      for (const parsedClue of parsedClues) {
        if (parsedClue.row === row && parsedClue.col === col && parsedClue.isAcross) {
          matchedAcrossClue = parsedClue;
          break;
        }
      }
      if (!isNil(matchedAcrossClue)) {
        break;
      }
      col--;
    }

    console.log('downMatch');
    if (isNil(matchedDownClue)) {
      console.log('none found');
    } else {
      console.log(matchedDownClue);
    }

    console.log('acrossMatch');
    if (isNil(matchedAcrossClue)) {
      console.log('none found');
    } else {
      console.log(matchedAcrossClue);
    }

    // debugger;

    // dispatch(setFocusedClues(matchedAcrossClue, matchedDownClue));
    // dispatch(addUser(
    //   'Fred',
    //   {
    //     userName: '',
    //     password: '',
    //     email: '',
    //     cellTextColorPartnerBoard: '',
    //   }
    // ));
  });
};

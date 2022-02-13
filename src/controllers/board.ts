/* eslint-disable no-prototype-builtins */
import axios from 'axios';
import {
  AppState,
  BoardEntity,
  BoardsState,
  ParsedClue,
  PuzzleEntity,
  PuzzleMetadata,
  PuzzlesMetadataMap,
  TedwordState,
  UiState
} from '../types';

import { apiUrlFragment, serverUrl } from '../index';
import {
  getBoard,
  getCurrentUser,
  getPuzzlesMetadata
} from '../selectors';
import { addBoard, addUserToBoard, setBoardId, setFocusedClues, setPuzzleId, setUiState, updateElapsedTimeRedux, updateLastPlayedDateTimeRedux } from '../models';
import { isNil } from 'lodash';
import { getAppState, getPuzzle } from '../selectors';

export const loadBoards = () => {
  return (dispatch: any) => {
    // const path = 'http://localhost:8888/api/v1/boards';
    const path = serverUrl + apiUrlFragment + 'boards';

    return axios.get(path)
      .then((boardsResponse: any) => {
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
      const boardId: string = response.data.data.id;
      const newBoard: BoardEntity = {
        id: boardId,
        puzzleId,
        title,
        users: [appState.userName],
        startDateTime: currentDate,
        lastPlayedDateTime: currentDate,
        elapsedTime: 0,
        solved: false,
        difficulty: 0,
        cellContents: {},
      };
      dispatch(addBoard(boardId, newBoard));
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
      dispatch(addUserToBoard(id, userName));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

export const updateLastPlayedDateTime = (
  id: string,
  lastPlayedDateTime: Date,
): any => {
  return ((dispatch: any, getState: any): any => {

    const path = serverUrl + apiUrlFragment + 'updateLastPlayedDateTime';

    const updateLastPlayedDateTimeBody: any = {
      boardId: id,
      lastPlayedDateTime,
    };

    return axios.post(
      path,
      updateLastPlayedDateTimeBody
    ).then((response) => {
      dispatch(updateLastPlayedDateTimeRedux(id, lastPlayedDateTime));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

export const updateElapsedTime = (
  id: string,
  elapsedTime: number,
): any => {
  return ((dispatch: any): any => {

    const path = serverUrl + apiUrlFragment + 'updateElapsedTime';

    const updateElapsedTimeBody: any = {
      boardId: id,
      elapsedTime,
    };

    return axios.post(
      path,
      updateElapsedTimeBody
    ).then((response) => {
      dispatch(updateElapsedTimeRedux(id, elapsedTime));
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
    const puzzleSpec: PuzzleEntity = getPuzzle(state, board.puzzleId);
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

    dispatch(setFocusedClues(matchedAcrossClue, matchedDownClue));

  });
};

export const launchExistingGame = (boardId: string) => {
  return ((dispatch: any, getState: any): any => {
    const state: TedwordState = getState();
    const boardsState: BoardsState = state.boardsState;
    if (boardsState.boards.hasOwnProperty(boardId)) {
      const boardEntity: BoardEntity = boardsState.boards[boardId];
      dispatch(setPuzzleId(boardEntity.puzzleId));
      dispatch(setBoardId(boardEntity.id));
      dispatch(updateElapsedTimeRedux(boardEntity.id, boardEntity.elapsedTime));
      const currentUser = getCurrentUser(state);
      if (!boardEntity.users.includes(currentUser)) {
        dispatch(addUserToBoard(boardEntity.id, currentUser));
      }
      dispatch(updateLastPlayedDateTime(boardEntity.id, new Date(Date())));
      dispatch(setUiState(UiState.ExistingBoardPlay));
    }
  });
};

export const deleteGames = (boardIds: string[]) => {
  return ((dispatch: any, getState: any): any => {
    console.log('delete existing games');
    console.log(boardIds);

    const path = serverUrl + apiUrlFragment + 'deleteGames';

    const deleteGamesBody: string[] = boardIds;

    return axios.post(
      path,
      deleteGamesBody
    ).then((response) => {
      console.log('return from deleteGames - update reduxy');
      // dispatch(updateElapsedTimeRedux(id, elapsedTime));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  });
};

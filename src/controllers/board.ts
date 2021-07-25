import axios from 'axios';
import { AppState, PuzzleMetadata, PuzzlesMetadataMap, TedwordState } from '../types';

import { apiUrlFragment, serverUrl } from '../index';
import { getPuzzlesMetadata } from '../selectors';
import { setBoardId } from '../models';

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


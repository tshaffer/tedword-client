import axios from 'axios';
import { FileInput, PuzCrosswordSpec, PuzzleEntity, PuzzleMetadata, PuzzleSpec } from '../types';
import { addPuzzle, addPuzzleMetadata, setPuzCrosswordSpec, setPuzzleId } from '../models';

import { apiUrlFragment, serverUrl } from '../index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export const loadPuzzle = (id: string) => {
  return ((dispatch: any, getState: any): any => {
    // const path = 'http://localhost:8888/api/v1/puzzle?id=' + id;
    const path = serverUrl + apiUrlFragment + 'puzzle?id=' + id;

    return axios.get(path)
      .then((puzzleResponse: any) => {
        const puzzleEntity: PuzzleEntity = puzzleResponse.data as PuzzleEntity;
        dispatch(addPuzzle(id, puzzleEntity));
        // // TEDTODO - add all in a single call
        // for (const puzzleMetadata of puzzlesMetadata) {
        //   dispatch(addPuzzleMetadata(puzzleMetadata.id, puzzleMetadata));
        // }
        // if (puzzlesMetadata.length > 0) {
        //   dispatch(setPuzzleId(puzzlesMetadata[0].id));
        // }
      });
  });
};

export const loadPuzzlesMetadata = () => {
  return (dispatch: any) => {
    // const path = 'http://localhost:8888/api/v1/allPuzzlesMetadata';
    const path = serverUrl + apiUrlFragment + 'allPuzzlesMetadata';

    return axios.get(path)
      .then((puzzlesMetadataResponse: any) => {
        console.log('loadPuzzlesMetadata response:');
        console.log(puzzlesMetadataResponse);
        const puzzlesMetadata: PuzzleMetadata[] = (puzzlesMetadataResponse as any).data;
        console.log('puzzlesMetadata');
        console.log(puzzlesMetadata);
        // TEDTODO - add all in a single call
        for (const puzzleMetadata of puzzlesMetadata) {
          dispatch(addPuzzleMetadata(puzzleMetadata.id, puzzleMetadata));
        }
        if (puzzlesMetadata.length > 0) {
          dispatch(setPuzzleId(puzzlesMetadata[0].id));
        }
      });
  };
};

export const cellChange = (boardId: string, user: string, row: number, col: number, typedChar: string, localChange: boolean) => {
  return (dispatch: any) => {

    if (!localChange) {
      console.log('cellChange - remote change - server update not required');
      return;
    }

    // const path = 'http://localhost:8888/api/v1/cellChange';
    const path = serverUrl + apiUrlFragment + 'cellChange';

    const cellChangeBody: any = {
      boardId,
      user,
      row,
      col,
      typedChar,
    };

    return axios.post(
      path,
      cellChangeBody,
    ).then((response) => {
      console.log(response);
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });

  };

};

export const uploadPuzFiles = (puzFiles: File[]) => {

  return (dispatch: any) => {

    parsePuzzleFiles(puzFiles)
      .then((puzzleSpecs: PuzzleSpec[]) => {
        const path = serverUrl + apiUrlFragment + 'uploadPuzzles';
        const uploadPuzzlesRequestBody: any = {
          uploadDateTime: Date.now(),
          puzzleSpecs,
        };
        return axios.post(
          path,
          uploadPuzzlesRequestBody,
        ).then((response) => {
          console.log(response);
          return;
        }).catch((error) => {
          console.log('error');
          console.log(error);
          return;
        });
      });
  };
};

const parsePuzzleFile = (puzFile: File): Promise<PuzzleSpec> => {

  return new Promise((resolve, reject) => {

    const fileReader: FileReader = new FileReader();

    // TEDTODO - err event
    fileReader.onload = function () {

      console.log('onload event received');

      console.log(fileReader.result);
      const puzData: Buffer = Buffer.from(fileReader.result as ArrayBuffer);
      const puzzleSpec: PuzzleSpec = PuzCrossword.from(puzData);
      resolve(puzzleSpec);
    };

    fileReader.readAsArrayBuffer(puzFile);
  });
};

const parsePuzzleFiles = (puzFiles: File[]): Promise<PuzzleSpec[]> => {

  const puzzleSpecs: PuzzleSpec[] = [];

  const parseNextPuzzleFile = (index: number): Promise<PuzzleSpec[]> => {

    if (index >= puzFiles.length) {
      return Promise.resolve(puzzleSpecs);
    }

    return parsePuzzleFile(puzFiles[index])
      .then((puzzleSpec: PuzzleSpec) => {
        puzzleSpecs.push(puzzleSpec);
        return parseNextPuzzleFile(index + 1);
      });
  };

  return parseNextPuzzleFile(0);
};

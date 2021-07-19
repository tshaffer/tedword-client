import axios from 'axios';
import { FileInput, PuzCrosswordSpec, PuzzleEntity, PuzzleMetadata } from '../types';
import { addPuzzle, addPuzzleMetadata, setPuzCrosswordSpec, setPuzzleId } from '../models';
import { ContactSupportOutlined } from '@material-ui/icons';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export const loadPuzzle = (id: string) => {
  return ((dispatch: any, getState: any): any => {
    const path = 'http://localhost:8888/api/v1/puzzle?id=' + id;
    return axios.get(path)
      .then((puzzleResponse: any) => {
        console.log('loadPuzzle response:');
        console.log(puzzleResponse);
        const puzzleEntity: PuzzleEntity = puzzleResponse.data as PuzzleEntity;
        console.log(puzzleEntity);
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

export const oldLoadPuzzle = (file: FileInput) => {
  return ((dispatch: any, getState: any): any => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      const pc: PuzCrosswordSpec = PuzCrossword.from(reader.result);
      console.log(pc);

      dispatch(setPuzCrosswordSpec(pc));
    };

    reader.readAsArrayBuffer(file as any as Blob);
  });
};

export const loadPuzzlesMetadata = () => {
  return (dispatch: any) => {
    const path = 'http://localhost:8888/api/v1/allPuzzlesMetadata';
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

export const cellChange = (user: string, row: number, col: number, typedChar: string, localChange: boolean) => {
  return (dispatch: any) => {

    if (!localChange) {
      console.log('cellChange - remote change - server update not required');
      return;
    }

    const path = 'http://localhost:8888/cellChange';
    const cellChangeBody: any = {
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


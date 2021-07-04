import axios from 'axios';
import { FileInput, PuzCrosswordSpec } from '../types';
import { setPuzCrosswordSpec } from '../models';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export const loadPuzzle = (file: FileInput) => {
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

export const cellChange = (row: number, col: number, typedChar: string) => {
  return (dispatch: any) => {

    const path = 'http://localhost:8888/cellChange';
    const cellChangeBody: any = {
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

}
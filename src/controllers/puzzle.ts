import { FileInput } from '../types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export const loadPuzzle = (file: FileInput) => {
  return ((dispatch: any, getState: any): any => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      const pc: any = PuzCrossword.from(reader.result);
      console.log(pc);

      debugger;
    };

    reader.readAsArrayBuffer(file as any as Blob);
  });
};
import axios from 'axios';
import { CluesByDirection, DerivedCrosswordData, Guess, ParsedClue, PuzzleEntity, PuzzleMetadata, PuzzleSpec, TedwordState } from '../types';
import {
  addPuzzle,
  addPuzzleMetadata,
  initializeGuesses,
  setClues,
  setCrosswordClues,
  setFileUploadStatus,
  setGridData,
  setPuzzleId,
  setSize,
  updateGuess
} from '../models';
import {
  createEmptyGuessesGrid, createGridData
} from '../utilities';
import {
  getBoardId,
  getCurrentUser,
} from '../selectors';

import { apiUrlFragment, serverUrl } from '../index';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export const loadPuzzle = (id: string) => {
  return ((dispatch: any, getState: any): any => {
    const path = serverUrl + apiUrlFragment + 'puzzle?id=' + id;

    return axios.get(path)
      .then((puzzleResponse: any) => {
        const puzzleEntity: PuzzleEntity = puzzleResponse.data as PuzzleEntity;
        dispatch(addPuzzle(id, puzzleEntity));

        const derivedCrosswordData: DerivedCrosswordData = generateDerivedCrosswordData(puzzleEntity);

        // not the correct way to do this, in my opinion. it should be done when the user chooses
        // to play the game
        dispatch(setCrosswordClues(derivedCrosswordData.cluesByDirection));
        dispatch(setSize(derivedCrosswordData.size));
        dispatch(setGridData(derivedCrosswordData.gridData));
        dispatch(setClues(derivedCrosswordData.clues));

        const guesses = createEmptyGuessesGrid(derivedCrosswordData.cluesByDirection);
        dispatch(initializeGuesses(guesses));
      });
  });
};

export const generateDerivedCrosswordData = (puzzleEntity: PuzzleEntity): DerivedCrosswordData => {
  const crosswordClues: CluesByDirection = buildDisplayedPuzzle(puzzleEntity);
  const { size, gridData, clues } = createGridData(crosswordClues);
  return {
    size,
    gridData,
    cluesByDirection: crosswordClues,
    clues,
  };
};

export const buildDisplayedPuzzle = (puzzleEntity: PuzzleEntity): CluesByDirection => {

  const cluesByDirection: CluesByDirection = {
    across: {},
    down: {},
  };

  const parsedClues: ParsedClue[] = puzzleEntity.parsedClues;
  for (const parsedClue of parsedClues) {
    const { col, isAcross, row, solution, text } = parsedClue;
    if (isAcross) {
      cluesByDirection.across[parsedClue.number] = {
        clue: text,
        answer: solution,
        row,
        col,
      };
    } else {
      cluesByDirection.down[parsedClue.number] = {
        clue: text,
        answer: solution,
        row,
        col,
      };
    }
  }

  return cluesByDirection;
};

export const loadPuzzlesMetadata = () => {
  return (dispatch: any) => {
    // const path = 'http://localhost:8888/api/v1/allPuzzlesMetadata';
    const path = serverUrl + apiUrlFragment + 'allPuzzlesMetadata';

    return axios.get(path)
      .then((puzzlesMetadataResponse: any) => {
        const puzzlesMetadata: PuzzleMetadata[] = (puzzlesMetadataResponse as any).data;
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

export const processInputEvent = (row: number, col: number, typedChar: string) => {
  return (dispatch: any, getState: any) => {

    const state: TedwordState = getState();
    
    const guess: Guess =  {
      value: typedChar,
      guessIsRemote: false,
      remoteUser: null,
    };
    dispatch(updateGuess(row, col, guess));
    
    const path = serverUrl + apiUrlFragment + 'cellChange';

    const cellChangeBody: any = {
      boardId: getBoardId(state),
      user: getCurrentUser(state),
      row,
      col,
      typedChar,
    };

    return axios.post(
      path,
      cellChangeBody,
    ).then((response) => {
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
          dispatch(setFileUploadStatus('Upload successful'));
          return;
        }).catch((error) => {
          console.log('error');
          console.log(error);
          dispatch(setFileUploadStatus('Upload failed: ' + error.toString()));
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

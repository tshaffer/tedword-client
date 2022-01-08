import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Buffer = require('buffer/').Buffer;

import { CellContentsMap, CellContentsValue, ClueAtLocation, CluesByDirection, CluesByNumber, DerivedCrosswordData, Guess, GuessesGrid, ParsedClue, PuzzleEntity, PuzzleMetadata, PuzzleSpec, TedwordState } from '../types';
import {
  addPuzzle,
  addPuzzleMetadata,
  initializeGuesses,
  setCrosswordClues,
  setFileUploadStatus,
  setGridData,
  setPuzzleId,
  setSize,
  updateGuess,
  updateAllGuesses
} from '../models';
import {
  createEmptyGuessesGrid, createGridData
} from '../utilities';
import {
  getBoardId,
  getCellContents,
  getCurrentUser,
} from '../selectors';

import { apiUrlFragment, serverUrl } from '../index';
import { getCrosswordClues, getGuesses } from '../selectors';
import { isNil, cloneDeep } from 'lodash';

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

        const guesses = createEmptyGuessesGrid(derivedCrosswordData.cluesByDirection);
        dispatch(initializeGuesses(guesses));

        const state = getState();
        console.log('loadPuzzle', state);

        // TEDTODO - why is this getting loaded here? Shouldn't it get loaded when Board is opened?
        // maybe it is - why is this called loadPuzzle?
        const cellContents: CellContentsMap = getCellContents(state);

        const puzzleGuesses: GuessesGrid = cloneDeep(guesses);

        for (const cellContentsKey in cellContents) {
          if (Object.prototype.hasOwnProperty.call(cellContents, cellContentsKey)) {
            const cellPosition = cellContentsKey.split('_');
            const row: number = parseInt(cellPosition[0], 10);
            const col: number = parseInt(cellPosition[1], 10);
            const cellContentsValue: CellContentsValue = cellContents[cellContentsKey];
            const guessValue: string = cellContentsValue.typedChar;
            const user: string = cellContentsValue.user;
            const currentUser: string = getCurrentUser(state);

            const guessIsRemote = user.toString() !== currentUser.toString();
            const remoteUser = guessIsRemote
              ? cellContentsValue.user
              : null;

            const guess: Guess = {
              value: guessValue,
              guessIsRemote,
              remoteUser,
            };
            puzzleGuesses[row][col] = guess;
          }
        }

        dispatch(updateAllGuesses(puzzleGuesses));

        dispatch(refreshCompletedClues());
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
        completelyFilledIn: false,
        clueIndex: -1,
      };
    } else {
      cluesByDirection.down[parsedClue.number] = {
        clue: text,
        answer: solution,
        row,
        col,
        completelyFilledIn: false,
        clueIndex: -1,
      };
    }
  }

  return cluesByDirection;
};

export const loadPuzzlesMetadata = () => {
  return (dispatch: any) => {

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

    const guess: Guess = {
      value: typedChar,
      guessIsRemote: false,
      remoteUser: null,
    };
    dispatch(updateGuess(row, col, guess));
    dispatch(refreshCompletedClues());

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

const refreshCompletedClues = () => {
  return ((dispatch: any, getState: any): any => {
    const state = getState();
    const crosswordClues: CluesByDirection | null = cloneDeep(getCrosswordClues(state));
    if (!isNil(crosswordClues)) {
      const guesses: GuessesGrid = getGuesses(state);
      resetCompletedClues(crosswordClues);
      buildCompletedClues(crosswordClues, guesses);
      dispatch(setCrosswordClues(crosswordClues));
    }
  });
};

const resetCompletedClues = (cluesByDirection: CluesByDirection) => {
  resetCluesInDirection(cluesByDirection['across'], 'across');
  resetCluesInDirection(cluesByDirection['down'], 'down');
};

const resetCluesInDirection = (cluesByNumber: CluesByNumber, direction: string) => {
  for (const clueNumber in cluesByNumber) {
    if (Object.prototype.hasOwnProperty.call(cluesByNumber, clueNumber)) {
      const clueAtLocation: ClueAtLocation = cluesByNumber[clueNumber];
      clueAtLocation.completelyFilledIn = false;
    }
  }
};

const buildCompletedClues = (cluesByDirection: CluesByDirection, guesses: GuessesGrid) => {
  buildCluesInDirection(cluesByDirection, 'across', guesses);
  buildCluesInDirection(cluesByDirection, 'down', guesses);
};

const buildCluesInDirection = (cluesByDirection: CluesByDirection, direction: string, guesses: GuessesGrid) => {
  const cluesByNumber: CluesByNumber = cluesByDirection[direction];
  for (const clueNumber in cluesByNumber) {
    if (Object.prototype.hasOwnProperty.call(cluesByNumber, clueNumber)) {
      const clueAtLocation: ClueAtLocation = cluesByNumber[clueNumber];
      const { answer, row, col } = clueAtLocation;

      let completelyFilledIn = true;
      if (direction === 'across') {
        const startingCol = col;
        for (let j = 0; j < answer.length; j++) {
          const guess: Guess = guesses[row][startingCol + j];
          if (guess.value === '') {
            completelyFilledIn = false;
          }
        }
      } else {
        const startingRow = row;
        for (let j = 0; j < answer.length; j++) {
          const guess: Guess = guesses[startingRow + j][col];
          if (guess.value === '') {
            completelyFilledIn = false;
          }
        }
      }

      console.log('buildCluesInDirection: ', row, col);
      clueAtLocation.completelyFilledIn = completelyFilledIn;
    }
  }
};

export const uploadPuzzleBuffer = (puzFiles: File[]) => {

  return (dispatch: any) => {
    readPuzzleFile(puzFiles[0])
      .then((puzzleBuffer: Buffer) => {
        const path = serverUrl + apiUrlFragment + 'uploadPuzzleBuffer';
        const uploadPuzzlesRequestBody: any = {
          uploadDateTime: Date.now(),
          sourceFileName: puzFiles[0].name,
          puzzleBuffer,
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

const readPuzzleFile = (puzFile: File): Promise<Buffer> => {

  return new Promise((resolve, reject) => {

    const fileReader: FileReader = new FileReader();

    // TEDTODO - err event
    fileReader.onload = function () {
      const puzData: Buffer = Buffer.from(fileReader.result as ArrayBuffer);
      resolve(puzData);
    };

    fileReader.readAsArrayBuffer(puzFile);
  });
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
      puzzleSpec.sourceFileName = puzFile.name;
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

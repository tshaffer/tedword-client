import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  AppState,
  UiState,
  PuzzlesMetadataMap,
  DisplayedPuzzle,
  CellContentsMap,
  BoardEntity,
  PuzzleSpec,
  ParsedClue
} from '../types';
import {
  getAppState,
  getCellContents,
  getDisplayedPuzzle,
  getPuzzlesMetadata,
  getBoard,
  getPuzzle,
  // getBoardData
} from '../selectors';
import { setPuzzleId, setUiState } from '../models';
import {
  cellChange,
  loadPuzzle
} from '../controllers';
import { isNil } from 'lodash';

export interface BoardPlayProps {
  appState: AppState,
  // boardData: DisplayedPuzzle,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onLoadPuzzle: (puzzleId: string) => any;
  onCellChange: (boardId: string, user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
}

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;

export let boardPlayCrossword: any;

const BoardPlay = (props: BoardPlayProps) => {

  console.log('BoardPlay invoked');

  React.useEffect(() => {
    props.onLoadPuzzle(props.appState.puzzleId);
  }, []);


  boardPlayCrossword = React.useRef();

  const getBoardId = (): string => {
    return props.appState.boardId;
  };

  const getPuzzleUser = (): string => {
    return props.appState.userName;
  };

  const handleCellChange = (row: number, col: number, typedChar: string, localChange: boolean) => {
    console.log('handleCellChange');
    console.log(row, col, typedChar);
    props.onCellChange(getBoardId(), getPuzzleUser(), row, col, typedChar, localChange);
  };

  const handleFillAllAnswers = React.useCallback((event) => {
    (boardPlayCrossword as any).current.fillAllAnswers();
  }, []);

  const handleResetPuzzle = React.useCallback((event) => {
    (boardPlayCrossword as any).current.reset();
  }, []);

  const handleRemoteSetCell = React.useCallback((event) => {
    (boardPlayCrossword as any).current.remoteSetCell(0, 1, 'X');
  }, []);

  const handleClueCorrect = (direction: string, number: string, answer: string) => {
    console.log('handleClueCorrect');
    console.log(direction, number, answer);
  };

  const handleLoadedCorrect = (param) => {
    console.log('handleLoadedCorrect');
    console.log(param);
  };

  const handleCrosswordCorrect = (param) => {
    console.log('handleCrosswordCorrect');
    console.log(param);
  };

  // TEDTODO - several ways to improve performance.
  const handleFocusedCellChange = (row: any, col: any, direction: any) => {

    console.log('handleFocusedCellChange', row, col, direction);

    const parsedClues: ParsedClue[] = props.puzzleSpec.parsedClues;

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

    row = focusedRow;

    // get match for col
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
  };

  const displayedPuzzleData: DisplayedPuzzle = props.displayedPuzzle;

  console.log('BoardPlay rendering');

  let cellContents: CellContentsMap = props.cellContents;

  console.log('cellContents');
  console.log(cellContents);

  if (isNil(cellContents)) {
    // return null;
    cellContents = {};
  }


  return (
    <div>
      <p>1A Potato, informally (4)</p>
      <p>1D Weeps loudly (4)</p>
      <Crossword
        data={displayedPuzzleData}
        tedGuesses={cellContents}
        ref={boardPlayCrossword}
        onCellChange={handleCellChange}
        onCorrect={handleClueCorrect}
        onLoadedCorrect={handleLoadedCorrect}
        onCrosswordCorrect={handleCrosswordCorrect}
        onFocusedCellChange={handleFocusedCellChange}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  const appState: AppState = getAppState(state);
  const puzzleId: string = appState.puzzleId;
  const boardId: string = appState.boardId;
  const board: BoardEntity = getBoard(state, boardId);
  return {
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState,
    displayedPuzzle: getDisplayedPuzzle(state),
    cellContents: getCellContents(state),
    puzzleSpec: getPuzzle(state, board.puzzleId),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
    onLoadPuzzle: loadPuzzle,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPlay);


import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Crossword from './Crossword/Crossword';

import { updateGuess } from '../models';

import {
  AppState,
  UiState,
  PuzzlesMetadataMap,
  DisplayedPuzzle,
  DisplayedPuzzleCell,
  CellContentsMap,
  PuzzleSpec,
  Guess
} from '../types';
import { setPuzzleId, setUiState } from '../models';
import {
  processInputEvent,
  loadPuzzle,
  updateFocusedClues
} from '../controllers';
import { isNil } from 'lodash';

export interface BoardPlayPropsFromParent {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
}

export interface BoardPlayProps extends BoardPlayPropsFromParent {
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onLoadPuzzle: (puzzleId: string) => any;
  // onCellChange: (boardId: string, user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
  onUpdateFocusedClues: (row: number, col: number) => any;

  // onCellChange: (row: number, col: number, puzzleGuess: Guess) => any;
  onInputEvent: (row: number, col: number, char: string) => any;

}


export let boardPlayCrossword: any;

const BoardPlay = (props: BoardPlayProps) => {

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

  // const handleCellChange = (row: number, col: number, typedChar: string, localChange: boolean) => {
  const handleCellChange = (row: number, col: number, typedChar: string) => {
    // props.onCellChange(getBoardId(), getPuzzleUser(), row, col, typedChar, localChange);
    // props.onCellChange(getBoardId(), getPuzzleUser(), row, col, typedChar);
    props.onInputEvent(row, col, typedChar);
  };

  const handleFocusedCellChange = (row: any, col: any, direction: any) => {
    props.onUpdateFocusedClues(row, col);
  };

  const handleInputEvent = (row: number, col: number, char: string) => {
    // props.onCellChange(row, col, {
    //   value: char,
    //   guessIsRemote: false,
    //   remoteUser: null,
    // });
    props.onInputEvent(row, col, char);
  };

  const displayedPuzzleData: DisplayedPuzzle = props.displayedPuzzle;


  let cellContents: CellContentsMap = props.cellContents;

  if (isNil(cellContents)) {
    cellContents = {};
  }

  /*
      <Crossword
        data={displayedPuzzleData}
        tedGuesses={cellContents}
        ref={boardPlayCrossword}
        onCellChange={handleCellChange}
        onFocusedCellChange={handleFocusedCellChange}
      />
  */

  return (
    <div>
      <Crossword
        onInput={handleInputEvent}
        onFocusedCellChange={handleFocusedCellChange}
      />
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    puzzlesMetadata: ownProps.puzzleMetadata,
    appState: ownProps.appState,
    displayedPuzzle: ownProps.displayedPuzzle,
    cellContents: ownProps.cellContents,
    puzzleSpec: ownProps.puzzleSpec,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
    onLoadPuzzle: loadPuzzle,
    onInputEvent: processInputEvent,
    onUpdateFocusedClues: updateFocusedClues,
  }, dispatch);
};

export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardPlay),
  (props: BoardPlayPropsFromParent, nextProps: BoardPlayPropsFromParent) => {
    if (props.appState !== nextProps.appState) {
      return false;
    }
    if (props.cellContents !== nextProps.cellContents) {
      return false;
    }
    if (props.puzzlesMetadata !== nextProps.puzzlesMetadata) {
      return false;
    }
    if (props.puzzleSpec !== nextProps.puzzleSpec) {
      return false;
    }
    const displayedPuzzlesIdentical: boolean = displayedPuzzlesEqual(props.displayedPuzzle, nextProps.displayedPuzzle);
    if (!displayedPuzzlesIdentical) {
      return false;
    }
    return displayedPuzzlesIdentical;
  }
);

const displayedPuzzlesEqual = (dp1: DisplayedPuzzle, dp2: DisplayedPuzzle): boolean => {
  for (const id in dp1.across) {
    if (Object.prototype.hasOwnProperty.call(dp1.across, id)) {
      const displayedPuzzleCell1: DisplayedPuzzleCell = dp1.across[id];
      if (Object.prototype.hasOwnProperty.call(dp2.across, id)) {
        const displayedPuzzleCell2: DisplayedPuzzleCell = dp2.across[id];
        if (!displayedPuzzleCellsEqual(displayedPuzzleCell1, displayedPuzzleCell2)) {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};

const displayedPuzzleCellsEqual = (dpc1: DisplayedPuzzleCell, dpc2: DisplayedPuzzleCell): boolean => {
  return (dpc1.answer === dpc2.answer) && (dpc1.clue === dpc2.clue) && (dpc1.col === dpc2.col) && (dpc1.row === dpc2.row);
};

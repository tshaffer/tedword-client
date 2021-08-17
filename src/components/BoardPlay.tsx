import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  AppState,
  UiState,
  PuzzlesMetadataMap,
  DisplayedPuzzle,
  DisplayedPuzzleCell,
  CellContentsMap,
  PuzzleSpec
} from '../types';
import { setPuzzleId, setUiState } from '../models';
import {
  cellChange,
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
  onCellChange: (boardId: string, user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
  onUpdateFocusedClues: (row: number, col: number) => any;
}

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;

export let boardPlayCrossword: any;

const BoardPlay = (props: BoardPlayProps) => {

  console.log('BoardPlay invoked');
  console.log(props);

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

  // const handleFillAllAnswers = React.useCallback((event) => {
  //   (boardPlayCrossword as any).current.fillAllAnswers();
  // }, []);

  // const handleResetPuzzle = React.useCallback((event) => {
  //   (boardPlayCrossword as any).current.reset();
  // }, []);

  // const handleRemoteSetCell = React.useCallback((event) => {
  //   (boardPlayCrossword as any).current.remoteSetCell(0, 1, 'X');
  // }, []);

  const handleClueCorrect = (direction: string, number: string, answer: string) => {
    // console.log('handleClueCorrect');
    // console.log(direction, number, answer);
  };

  const handleLoadedCorrect = (param) => {
    // console.log('handleLoadedCorrect');
    // console.log(param);
  };

  const handleCrosswordCorrect = (param) => {
    // console.log('handleCrosswordCorrect');
    // console.log(param);
  };

  const handleFocusedCellChange = (row: any, col: any, direction: any) => {
    console.log('handleFocusedCellChange', row, col, direction);
    props.onUpdateFocusedClues(row, col);
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
    onCellChange: cellChange,
    onUpdateFocusedClues: updateFocusedClues,
  }, dispatch);
};

// export default connect(mapStateToProps, mapDispatchToProps)(BoardPlay);
export default React.memo(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(BoardPlay),
  (props: BoardPlayPropsFromParent, nextProps: BoardPlayPropsFromParent) => {
    if (props.appState !== nextProps.appState) {
      console.log('appState different');
      return false;
    }
    if (props.cellContents !== nextProps.cellContents) {
      console.log('cellContents different');
      return false;
    }
    if (props.puzzlesMetadata !== nextProps.puzzlesMetadata) {
      console.log('puzzlesMetadata different');
      return false;
    }
    if (props.puzzleSpec !== nextProps.puzzleSpec) {
      console.log('puzzleSpec different');
      return false;
    }
    const displayedPuzzlesIdentical: boolean = displayedPuzzlesEqual(props.displayedPuzzle, nextProps.displayedPuzzle);
    if (!displayedPuzzlesIdentical) {
      console.log('displayedPuzzles different');
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

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CrosswordGame from './Crossword/CrosswordGame';

import {
  AppState,
  UiState,
  PuzzlesMetadataMap,
  DisplayedPuzzle,
  DisplayedPuzzleCell,
  CellContentsMap,
  PuzzleSpec} from '../types';
import { setPuzzleId, setUiState } from '../models';
import {
  processInputEvent,
  loadPuzzle,
  updateFocusedClues
} from '../controllers';
import { isNil } from 'lodash';

export interface CrosswordGameMgrPropsFromParent {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
}

export interface CrosswordGameMgrProps extends CrosswordGameMgrPropsFromParent {
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onLoadPuzzle: (puzzleId: string) => any;
  onUpdateFocusedClues: (row: number, col: number) => any;
  onInputEvent: (row: number, col: number, char: string) => any;
}

const CrosswordGameMgr = (props: CrosswordGameMgrProps) => {

  React.useEffect(() => {
    props.onLoadPuzzle(props.appState.puzzleId);
  }, []);


  const handleInputEvent = (row: number, col: number, char: string) => {
    props.onInputEvent(row, col, char);
  };

  let cellContents: CellContentsMap = props.cellContents;

  if (isNil(cellContents)) {
    cellContents = {};
  }

  return (
    <div style={{ height: '85%' }}>
      <CrosswordGame
        onInput={handleInputEvent}
      />
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any): Partial<CrosswordGameMgrProps> {
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
  )(CrosswordGameMgr),
  (props: CrosswordGameMgrPropsFromParent, nextProps: CrosswordGameMgrPropsFromParent) => {
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

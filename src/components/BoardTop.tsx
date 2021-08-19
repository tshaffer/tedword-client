import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Board from './Board';
import BoardPlay from './BoardPlay';
import { getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';
import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, PuzzlesMetadataMap, PuzzleSpec } from '../types';

export interface BoardTopProps  {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
}

const BoardTop = (props: BoardTopProps) => {

  return (
    <div>
      <Board/>
      <BoardPlay
        appState={props.appState}
        cellContents={props.cellContents}
        displayedPuzzle={props.displayedPuzzle}
        puzzlesMetadata={props.puzzlesMetadata}
        puzzleSpec={props.puzzleSpec}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  const appState: AppState = getAppState(state);
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTop);

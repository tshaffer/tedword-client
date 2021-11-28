import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Board from './Board';
import BoardPlay from './BoardPlay';
import BoardToolbar from './BoardToolbar';
import { getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';
import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, PuzzlesMetadataMap, PuzzleSpec, UiState } from '../types';
import { setUiState, } from '../models';

export interface BoardTopProps {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
  onSetUiState: (uiState: UiState) => any;
}

const BoardTop = (props: BoardTopProps) => {

  //       <Chat/>

  const handleHome = () => {
    console.log('handleHome');
    props.onSetUiState(UiState.SelectPuzzleOrBoard);
  };

  return (
    <div style={{ position: 'relative', height: '1080px' }}>
      <div style={{ maxHeight: '800px', overflow: 'auto' }}>
        <button onClick={handleHome}>Home</button>
        <br />
        <BoardToolbar />
        <Board />
        <BoardPlay
          appState={props.appState}
          cellContents={props.cellContents}
          displayedPuzzle={props.displayedPuzzle}
          puzzlesMetadata={props.puzzlesMetadata}
          puzzleSpec={props.puzzleSpec}
        />
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  const appState: AppState = getAppState(state);
  const boardId: string = appState.boardId;
  const board: BoardEntity = getBoard(state, boardId);
  const puzzleSpec = isNil(board) ? null : getPuzzle(state, board.puzzleId);
  return {
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState,
    displayedPuzzle: getDisplayedPuzzle(state),
    cellContents: getCellContents(state),
    puzzleSpec,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTop);

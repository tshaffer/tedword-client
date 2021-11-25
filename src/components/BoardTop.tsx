import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Board from './Board';
import BoardPlay from './BoardPlay';
import BoardToolbar from './BoardToolbar';
import { getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';
import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, PuzzlesMetadataMap, PuzzleSpec } from '../types';
import Chat from './Chat';

export interface BoardTopProps {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
}

/*
      <div style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
        <p>line one of pizza</p>
        <p>line two of pizza</p>
      </div>
*/
const BoardTop = (props: BoardTopProps) => {

  return (
    <div style={{ position: 'relative', height: '1080px' }}>
      <Chat/>
      <div style={{ maxHeight: '800px', overflow: 'auto' }}>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTop);

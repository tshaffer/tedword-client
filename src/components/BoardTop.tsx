import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Board from './Board';
import BoardPlay from './BoardPlay';
import { getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';
import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, PuzzlesMetadataMap, PuzzleSpec } from '../types';

export interface BoardTopProps {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
}

const BoardTop = (props: BoardTopProps) => {

  let intervalId: NodeJS.Timeout;

  React.useEffect(() => {
    initVisibilityHandler();
    startTimer();
  }, []);

  const initVisibilityHandler = () => {
    let hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('crossword hidden');
      pauseTimer();
    } else {
      console.log('crossword visible');
      startTimer();
    }
  };

  const handleTimerTimeout = () => {
    console.log('crossword timer timeout');
  };

  const startTimer = () => {
    intervalId = setInterval(handleTimerTimeout, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
  };

  return (
    <div>
      <Board />
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

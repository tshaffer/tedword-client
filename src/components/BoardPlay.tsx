import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, DisplayedPuzzle } from '../types';
import { 
  getAppState, 
  getDisplayedPuzzle, 
  getPuzzlesMetadata, 
  // getBoardData
 } from '../selectors';
import { setPuzzleId, setUiState } from '../models';
import { 
  cellChange,
  loadBoardCellContents,
  loadPuzzle
 } from '../controllers';

export interface BoardPlayProps {
  appState: AppState,
  // boardData: DisplayedPuzzle,
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  onLoadBoardCellContents: () => any;
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

  React.useEffect(() => {
    props.onLoadPuzzle(props.appState.puzzleId);
    props.onLoadBoardCellContents();
  }, []);


  boardPlayCrossword = React.useRef();

  const getBoardId = (): string => {
    return props.appState.boardId;
  }

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


  /*
      <Crossword
        data={props.displayedPuzzle}
        ref={boardPlayCrossword}
        onCellChange={handleCellChange}
        onCorrect={handleClueCorrect}
        onLoadedCorrect={handleLoadedCorrect}
        onCrosswordCorrect={handleCrosswordCorrect}
      />
  */

  const displayedPuzzleData: DisplayedPuzzle = props.displayedPuzzle;
  // if (props.appState.uiState === UiState.NewBoardPlay) {
  //   displayedPuzzleData = props.boardData;
  // } else {
  //   displayedPuzzleData = props.displayedPuzzle;
  // }

  return (
    <div>
      <p>
        BoardPlay
      </p>
      <div>
        <button
          type="button"
          onClick={handleFillAllAnswers}
        >
          Fill all answers
        </button>
        <button
          type='button'
          onClick={handleResetPuzzle}
        >
          Reset puzzle
        </button>
        <button
          type='button'
          onClick={handleRemoteSetCell}
        >
          Set cell remote
        </button>
      </div>
      <Crossword
        data={displayedPuzzleData}
        ref={boardPlayCrossword}
        onCellChange={handleCellChange}
        onCorrect={handleClueCorrect}
        onLoadedCorrect={handleLoadedCorrect}
        onCrosswordCorrect={handleCrosswordCorrect}
      />
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState: getAppState(state),
    displayedPuzzle: getDisplayedPuzzle(state),
    // boardData: getBoardData(state),

  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
    onLoadBoardCellContents: loadBoardCellContents,
    onLoadPuzzle: loadPuzzle,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardPlay);


import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, DisplayedPuzzle } from '../types';
import { getAppState, getDisplayedPuzzle, getPuzzlesMetadata } from '../selectors';
import { setPuzzleId, setUiState } from '../models';
import { cellChange, loadPuzzle } from '../controllers';

export interface BoardPlayProps {
  appState: AppState,
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onLoadPuzzle: (puzzleId: string) => any;
  onCellChange: (user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
}

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;

let crossword: any;

const BoardPlay = (props: BoardPlayProps) => {

  React.useEffect(() => {
    props.onLoadPuzzle(props.appState.puzzleId);
  }, []);


  crossword = React.useRef();
  console.log('BoardPlay: crossword');
  console.log(crossword);

  const getPuzzleUser = (): string => {
    return props.appState.userName;
  };

  const handleCellChange = (row: number, col: number, typedChar: string, localChange: boolean) => {
    console.log('handleCellChange');
    console.log(row, col, typedChar);
    props.onCellChange(getPuzzleUser(), row, col, typedChar, localChange);
  };


  const handleFillAllAnswers = React.useCallback((event) => {
    (crossword as any).current.fillAllAnswers();
  }, []);

  const handleResetPuzzle = React.useCallback((event) => {
    (crossword as any).current.reset();
  }, []);

  const handleRemoteSetCell = React.useCallback((event) => {
    (crossword as any).current.remoteSetCell(0, 1, 'X');
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
        ref={crossword}
        onCellChange={handleCellChange}
        onCorrect={handleClueCorrect}
        onLoadedCorrect={handleLoadedCorrect}
        onCrosswordCorrect={handleCrosswordCorrect}
      />
  */
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
        data={props.displayedPuzzle}
        ref={crossword}
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


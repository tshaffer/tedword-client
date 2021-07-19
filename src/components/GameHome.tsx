import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata } from '../types';
import { getAppState, getPuzzlesMetadata } from '../selectors';
import { setPuzzleId, setUiState } from '../models';

export interface GameHomeProps {
  appState: AppState,
  puzzlesMetadata: PuzzlesMetadataMap;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
}

const GameHome = (props: GameHomeProps) => {

  const getPuzzleTitles = (): string[] => {
    const puzzleTitles: string[] = [];
    for (const puzzleId in props.puzzlesMetadata) {
      if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
        const puzzleMetadata: PuzzleMetadata = props.puzzlesMetadata[puzzleId];
        puzzleTitles.push(puzzleMetadata.title);
      }
    }
    return puzzleTitles;
  };

  const getPuzzleOption = (puzzleTitle: string) => {
    return (
      <option
        key={puzzleTitle}
        value={puzzleTitle}
      >
        {puzzleTitle}
      </option>
    );
  };

  const getPuzzleOptions = (puzzleTitles: string[]) => {
    const puzzleOptions = puzzleTitles.map((puzzleTitle: string) => {
      return getPuzzleOption(puzzleTitle);
    });
    return puzzleOptions;
  };

  const handlePuzzleChange = (event) => {
    console.log('handlePuzzleChange');
    console.log(event.target.value);

    const puzzleTitle: string = event.target.value;
    for (const puzzleId in props.puzzlesMetadata) {
      if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
        const puzzleMetadata = props.puzzlesMetadata[puzzleId];
        if (puzzleMetadata.title === puzzleTitle) {
          props.onSetPuzzleId(puzzleId);
        }
      }
    }
  };

  const handleSubmit = () => {
    console.log('handleSubmit invoked');
    props.onSetUiState(UiState.BoardPlay);
  };

  const getSelectedPuzzleTitle = (): string => {

    // eslint-disable-next-line no-prototype-builtins
    if (props.puzzlesMetadata.hasOwnProperty(props.appState.puzzleId)) {
      const puzzleMetadata: PuzzleMetadata = props.puzzlesMetadata[props.appState.puzzleId];
      return puzzleMetadata.title;
    }

    return '';
  };

  const renderSelectPuzzle = () => {

    const puzzleTitles: string[] = getPuzzleTitles();
    if (puzzleTitles.length === 0) {
      return null;
    }

    const selectedPuzzleTitle: string = getSelectedPuzzleTitle();
    if (selectedPuzzleTitle === '') {
      return null;
    }

    const puzzleOptions = getPuzzleOptions(puzzleTitles);

    return (
      <div>
        <p>Select Puzzle</p>
        <select
          tabIndex={-1}
          value={selectedPuzzleTitle}
          onChange={handlePuzzleChange}
        >
          {puzzleOptions}
        </select>
        <p>
          <button
            type="button"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </p>
      </div>
    );

  };

  return renderSelectPuzzle();
};

function mapStateToProps(state: any) {
  return {
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState: getAppState(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);


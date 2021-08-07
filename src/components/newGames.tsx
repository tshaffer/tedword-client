import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, PuzzlesMetadataMap, PuzzleMetadata } from '../types';
import { getAppState, getPuzzlesMetadata } from '../selectors';
import { setPuzzleId } from '../models';
import { isEmpty } from 'lodash';

export interface NewGamesPropsFromParent {
  handleSelectPuzzle: (puzzleId: string) => any;
}

export interface NewGamesProps extends NewGamesPropsFromParent {
  appState: AppState,
  puzzlesMetadata: PuzzlesMetadataMap;
  onSetPuzzleId: (puzzleId: string) => any;
}

const NewGames = (props: NewGamesProps) => {

  const handleSelectPuzzle = (puzzleMetadata: PuzzleMetadata) => {
    console.log('handleSelectPuzzle');
    console.log(puzzleMetadata);
    // props.onSetPuzzleId(puzzleMetadata.id);
    props.handleSelectPuzzle(puzzleMetadata.id);
  };

  const renderPuzzleRow = (puzzleMetadata: PuzzleMetadata) => {
    return (
      <tr key={puzzleMetadata.id}>
        <td>
          <button
            onClick={() => handleSelectPuzzle(puzzleMetadata)}
          >
            Play Me!
          </button>
        </td>
        <td>
          {puzzleMetadata.title}
        </td>
        <td>
          {puzzleMetadata.author}
        </td>
      </tr>
    );
  };

  const renderPuzzleRows = () => {

    const puzzleRows: any[] = [];

    for (const puzzleId in props.puzzlesMetadata) {
      if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
        const puzzleMetadata: PuzzleMetadata = props.puzzlesMetadata[puzzleId];
        puzzleRows.push(renderPuzzleRow(puzzleMetadata));
      }
    }

    return puzzleRows;
  };

  const renderPuzzlesTable = () => {

    if (isEmpty(props.puzzlesMetadata)) {
      return null;
    }

    const puzzleRows = renderPuzzleRows();

    return (
      <div>
        <br />
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
            </tr>
          </thead>
          <tbody>
            {puzzleRows}
          </tbody>
        </table>
      </div>
    );
  };

  const puzzlesTable = renderPuzzlesTable();

  return (
    <div>
      {puzzlesTable}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzleId: setPuzzleId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGames);
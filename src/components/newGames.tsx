import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import { PuzzlesMetadataMap, PuzzleMetadata } from '../types';
import { getPuzzlesMetadata } from '../selectors';

export interface NewGamesPropsFromParent {
  onSelectPuzzle: (puzzleMetadata: PuzzleMetadata) => any;
}

export interface NewGamesProps extends NewGamesPropsFromParent {
  puzzlesMetadata: PuzzlesMetadataMap;
}

const NewGames = (props: NewGamesProps) => {

  const tableColumnSpacing = {
    padding: '0 15px',
  };

  // const handleSelectPuzzle = (puzzleMetadata: PuzzleMetadata) => {
  //   props.onSelectPuzzle(puzzleMetadata);
  // };

  /*
          <button
            onClick={() => handleSelectPuzzle(puzzleMetadata)}
          >
            Play Me!
          </button>
  */
  const renderPuzzleRow = (puzzleMetadata: PuzzleMetadata) => {
    return (
      <tr key={puzzleMetadata.id}>
        <td style={tableColumnSpacing}>
          {puzzleMetadata.title}
        </td>
        <td style={tableColumnSpacing}>
          {puzzleMetadata.author}
        </td>
        <td style={tableColumnSpacing}>
          <Link component={RouterLink} to={'/game/new/' + puzzleMetadata.id}>
            Play Me!
          </Link>
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
              <th></th>
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
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(NewGames);
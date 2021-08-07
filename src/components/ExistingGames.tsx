import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, BoardEntity, BoardsMap } from '../types';
import { getAppState, getBoards, getPuzzlesMetadata } from '../selectors';
import { setBoardId, setPuzzleId, setUiState } from '../models';

export interface ExistingGamesPropsFromParent {
  handleSelectBoard: (boardId: string) => any;
}

export interface ExistingGamesProps extends ExistingGamesPropsFromParent {
  appState: AppState,
  boardsMap: BoardsMap;
  puzzlesMetadata: PuzzlesMetadataMap;
  onSetBoardId: (boardId: string) => any;
  onSetPuzzleId: (puzzleId: string) => any;
}

const ExistingGames = (props: ExistingGamesProps) => {

  const handleSelectBoard = (boardEntity: BoardEntity) => {

    console.log('handleSelectBoard');
    console.log(boardEntity);

    props.onSetPuzzleId(boardEntity.puzzleId);
    props.onSetBoardId(boardEntity.id);

    props.handleSelectBoard(boardEntity.id);

  };

  const renderBoardRow = (boardEntity: BoardEntity) => {
    return (
      <tr key={boardEntity.id}>
        <td>
          <button
            onClick={() => handleSelectBoard(boardEntity)}
          >
            Play Me!
          </button>
        </td>
        <td>
          {boardEntity.title}
        </td>
      </tr>
    );
  };

  const renderBoardRows = () => {

    const boardRows: any[] = [];

    for (const boardId in props.boardsMap) {
      if (Object.prototype.hasOwnProperty.call(props.boardsMap, boardId)) {
        const boardEntity: BoardEntity = props.boardsMap[boardId];
        boardRows.push(renderBoardRow(boardEntity));
      }
    }

    return boardRows;
  };

  const renderBoardsTable = () => {

    if (isEmpty(props.boardsMap)) {
      return null;
    }

    const boardRows = renderBoardRows();

    return (
      <div>
        <br />
        <table>
          <thead>
            <tr>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {boardRows}
          </tbody>
        </table>
      </div>
    );
  };

  const boardsTable = renderBoardsTable();

  return (
    <div>
      {boardsTable}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
    boardsMap: getBoards(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetBoardId: setBoardId,
    onSetPuzzleId: setPuzzleId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingGames);
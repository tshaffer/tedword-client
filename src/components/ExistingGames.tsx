import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { BoardEntity, BoardsMap, PuzzlesMetadataMap } from '../types';
import { getBoards, getPuzzlesMetadata } from '../selectors';

export interface ExistingGamesPropsFromParent {
  onSelectBoard: (boardEntity: BoardEntity) => any;
}

export interface ExistingGamesProps extends ExistingGamesPropsFromParent {
  boardsMap: BoardsMap;
  puzzlesMetadata: PuzzlesMetadataMap;
}

const ExistingGames = (props: ExistingGamesProps) => {

  const tableColumnSpacing = {
    padding: '0 15px',
  };

  const getFormattedLastPlayedDateTime = (dt: string): string => {
    return dt;
  };

  const getPuzzleTitle = (boardEntity: BoardEntity): string => {
    const puzzleId: string = boardEntity.puzzleId;
    if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
      return props.puzzlesMetadata[puzzleId].title;
    }
    return '';
  };

  const getFormattedUsers = (boardEntity: BoardEntity): string => {
    let formattedUsers = '';
    for (let i = 0; i < boardEntity.users.length; i++) {
      const user = boardEntity.users[i];
      formattedUsers += user;
      if (i < (boardEntity.users.length - 1)) {
        formattedUsers += ', ';
      }
    }
    return formattedUsers;
  };

  const handleSelectBoard = (boardEntity: BoardEntity) => {
    props.onSelectBoard(boardEntity);
  };

  const renderBoardRow = (boardEntity: BoardEntity) => {
    return (
      <tr key={boardEntity.id}>
        <td style={tableColumnSpacing}>
          {getFormattedLastPlayedDateTime(boardEntity.lastPlayedDateTime as unknown as string)}
        </td>
        <td style={tableColumnSpacing}>
          {getPuzzleTitle(boardEntity)}
        </td>
        <td style={tableColumnSpacing}>
          {getFormattedUsers(boardEntity)}
        </td>
        <td style={tableColumnSpacing}>
          <button
            onClick={() => handleSelectBoard(boardEntity)}
          >
            Play Me!
          </button>
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
              <th>Last Played</th>
              <th>Title</th>
              <th>Users</th>
              <th></th>
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
    boardsMap: getBoards(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingGames);
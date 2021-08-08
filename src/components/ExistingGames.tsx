import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';

import { BoardEntity, BoardsMap } from '../types';
import { getBoards } from '../selectors';

export interface ExistingGamesPropsFromParent {
  onSelectBoard: (boardEntity: BoardEntity) => any;
}

export interface ExistingGamesProps extends ExistingGamesPropsFromParent {
  boardsMap: BoardsMap;
}

const ExistingGames = (props: ExistingGamesProps) => {

  const handleSelectBoard = (boardEntity: BoardEntity) => {
    props.onSelectBoard(boardEntity);
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
        <td>
          {getFormattedUsers(boardEntity)}
        </td>
        <td>
          {boardEntity.lastPlayedDateTime}
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
              <th></th>
              <th>Title</th>
              <th>Users</th>
              <th>Last Played</th>
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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ExistingGames);
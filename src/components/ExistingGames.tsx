import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty } from 'lodash';
import { cloneDeep } from 'lodash';

import { Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import { BoardEntity, BoardsMap, PuzzlesMetadataMap } from '../types';
import { getBoards, getPuzzlesMetadata } from '../selectors';

export interface ExistingGamesProps {
  boardsMap: BoardsMap;
  puzzlesMetadata: PuzzlesMetadataMap;
}

const ExistingGames = (props: ExistingGamesProps) => {

  interface CheckedById {
    [id: string]: boolean;
  }
  
  const [checkedById, setCheckedById] = React.useState<CheckedById>({});

  const tableColumnSpacing = {
    padding: '0 15px',
  };

  const isToday = (dt: Date): boolean => {
    const today = new Date();
    return dt.getDate() == today.getDate() &&
      dt.getMonth() == today.getMonth() &&
      dt.getFullYear() == today.getFullYear();
  };

  const daysSinceToday = (dt: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const dtNow: number = Date.now();
    const diffDays = Math.round(Math.abs((dtNow - dt.getTime()) / oneDay));
    return diffDays;
  };

  const hoursSinceNow = (dt: Date): number => {
    const oneHour = 60 * 60 * 1000;
    const dtNow: number = Date.now();
    const diffHours = Math.round(Math.abs((dtNow - dt.getTime()) / oneHour));
    return diffHours;
  };

  const minutesSinceNow = (dt: Date): number => {
    const oneMinute = 60 * 1000;
    const dtNow: number = Date.now();
    const diffMinutes = Math.round(Math.abs((dtNow - dt.getTime()) / oneMinute));
    return diffMinutes;
  };

  const getFormattedLastPlayedDateTime = (dt: string): string => {

    let elapsedTimeSincePlayed: string = '';

    const dtGameLastPlayed: Date = new Date(dt);
    if (isToday(dtGameLastPlayed)) {
      const hoursSincePlayed: number = hoursSinceNow(dtGameLastPlayed);
      const minutesSincePlayed: number = minutesSinceNow(dtGameLastPlayed) % 60;

      if (hoursSincePlayed === 0 && minutesSincePlayed === 0) {
        elapsedTimeSincePlayed = 'Just now';
      } else {
        switch (hoursSincePlayed) {
          case 0:
            break;
          case 1:
            elapsedTimeSincePlayed = 'Played 1 hour ';
            break;
          default:
            elapsedTimeSincePlayed = 'Played ' + hoursSincePlayed + ' hours ';
            break;
        }
        switch (minutesSincePlayed) {
          case 0:
            break;
          case 1:
            elapsedTimeSincePlayed = elapsedTimeSincePlayed + '1 minute ';
            break;
          default:
            elapsedTimeSincePlayed = elapsedTimeSincePlayed + minutesSincePlayed + ' minutes ';
            break;
        }
        elapsedTimeSincePlayed += 'ago';
      }
    } else {
      const daysSincePlayed = daysSinceToday(dtGameLastPlayed);
      const dateLastPlayed: string = dtGameLastPlayed.toLocaleDateString(
        'en',
        {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }
      );
      elapsedTimeSincePlayed = 'Played ' + daysSincePlayed + ' days ago on ' + dateLastPlayed;
    }

    return elapsedTimeSincePlayed;
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

  const handleCheckRow = (boardId: string) => {
    console.log('handleCheckRow ', boardId);
    console.log(checkedById);
    const localCheckedById = cloneDeep(checkedById);
    localCheckedById[boardId] = !localCheckedById[boardId];
    setCheckedById(localCheckedById);
  };

  const renderBoardRow = (boardEntity: BoardEntity) => {
    return (
      <tr key={boardEntity.id}>
        <td>
          <input type="checkbox" onClick={() => handleCheckRow(boardEntity.id)}></input>
        </td>
        <td style={tableColumnSpacing}>
          {getFormattedLastPlayedDateTime(boardEntity.lastPlayedDateTime as unknown as string)}
        </td>
        <td style={tableColumnSpacing}>
          <Link component={RouterLink} to={'/game/existing/' + boardEntity.id}>
            {getPuzzleTitle(boardEntity)}
          </Link>
        </td>
        <td style={tableColumnSpacing}>
          {getFormattedUsers(boardEntity)}
        </td>
      </tr>
    );
  };

  const renderBoardRows = () => {

    const boardEntities: BoardEntity[] = [];
    for (const boardId in props.boardsMap) {
      if (Object.prototype.hasOwnProperty.call(props.boardsMap, boardId)) {
        const boardEntity: BoardEntity = props.boardsMap[boardId];
        boardEntities.push(boardEntity);
      }
    }

    boardEntities.sort((a: BoardEntity, b: BoardEntity) => {
      return a.lastPlayedDateTime > b.lastPlayedDateTime
        ? -1
        : 1;
    });

    const boardRows = boardEntities.map((boardEntity: BoardEntity) => {
      return renderBoardRow(boardEntity);
    });

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
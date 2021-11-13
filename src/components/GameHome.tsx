/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { UiState, PuzzleMetadata, BoardEntity, UsersMap } from '../types';
import { getCurrentUser, getUsers } from '../selectors';
import { setBoardId, setPuzzleId, setUiState, setFileUploadStatus, setUserName } from '../models';
import {
  addUserToExistingBoard,
  createBoard,
  updateLastPlayedDateTime,
  launchExistingGame,
} from '../controllers';

import NewGames from './NewGames';
import ExistingGames from './ExistingGames';
import PuzzleUpload from './PuzzleUpload';

export interface GameHomeProps {
  currentUser: string;
  users: UsersMap,
  onAddUserToBoard: (id: string, userName: string) => any;
  onCreateBoard: () => any;
  onSetBoardId: (boardId: string) => any;
  onSetFileUploadStatus: (fileUploadState: string) => any;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onUpdateLastPlayedDateTime: (boardId: string, dt: Date) => any;
  onLaunchExistingGame: (boardId: string) => any;
  onSetUserName: (userName: string) => any;
}

const GameHome = (props: GameHomeProps) => {

  const handleOpenBoard = (boardEntity: BoardEntity) => {
    props.onLaunchExistingGame(boardEntity.id);
  };

  const handleOpenPuzzle = (puzzleMetadata: PuzzleMetadata) => {
    props.onSetPuzzleId(puzzleMetadata.id);
    props.onCreateBoard();
    props.onSetUiState(UiState.NewBoardPlay);
  };

  const renderGameHome = () => {

    const tabcontent = {
      display: 'none',
      padding: '6px 12px',
      border: '1px solid #ccc',
      borderTop: 'none',
    };

    const tab = {
      overflow: 'hidden',
      border: '1px solid #ccc',
      backgroundColor: '#f1f1f1',
    };

    const tabLinks = {
      backgroundColor: 'inherit',
      // float: 'left',
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
      padding: '14px 16px',
      transition: '0.3s'
    };

    function handleSignout() {

      localStorage.setItem('userName', '');

      const users: string[] = [];
      for (const userKey in props.users) {
        if (Object.prototype.hasOwnProperty.call(props.users, userKey)) {
          users.push(userKey);
        }
      }
  
      if (users.length > 0) {
        props.onSetUserName(users[0]);  
      }
      props.onSetUiState(UiState.SelectUser);
    }

    function handleSelectTab(evt: any) {

      const selectedTabId = evt.target.id;

      // Hide content divs
      newGamesContentRef.current.style.display = 'none';
      inProgressGamesContentRef.current.style.display = 'none';
      settingsContentRef.current.style.display = 'none';

      // Show the current tab, and add an 'active' class to the button that opened the tab
      switch (selectedTabId) {
        case 'newGameTabSelect':
          newGamesContentRef.current.style.display = 'block';
          newGameTabSelectRef.current.style.backgroundColor = '#ccc';
          inProgressGamesTabSelectRef.current.style.backgroundColor = 'inherit';
          settingsTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'inProgressGameTabSelect':
          inProgressGamesContentRef.current.style.display = 'block';
          inProgressGamesTabSelectRef.current.style.backgroundColor = '#ccc';
          newGameTabSelectRef.current.style.backgroundColor = 'inherit';
          settingsTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'settingsTabSelect':
          props.onSetFileUploadStatus('');
          settingsContentRef.current.style.display = 'block';
          settingsTabSelectRef.current.style.backgroundColor = '#ccc';
          newGameTabSelectRef.current.style.backgroundColor = 'inherit';
          inProgressGamesTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        default:
          break;
      }
    }

    const newGameTabSelectRef = React.createRef<any>();
    const newGamesContentRef = React.createRef<any>();
    const inProgressGamesTabSelectRef = React.createRef<any>();
    const inProgressGamesContentRef = React.createRef<any>();
    const settingsTabSelectRef = React.createRef<any>();
    const settingsContentRef = React.createRef<any>();

    return (
      <div>
        <div>
          <button onClick={handleSignout}>Signout</button>
        </div>
        <div style={tab}>
          <button style={tabLinks} onClick={handleSelectTab} id='newGameTabSelect' ref={newGameTabSelectRef}>New Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='inProgressGameTabSelect' ref={inProgressGamesTabSelectRef}>In Progress Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='settingsTabSelect' ref={settingsTabSelectRef}>Tools & Settings</button>
        </div>
        <div id='newGameContent' style={tabcontent} ref={newGamesContentRef}>
          <NewGames
            onSelectPuzzle={handleOpenPuzzle}
          />
        </div>
        <div id='inProgressGamesContent' style={tabcontent} ref={inProgressGamesContentRef}>
          <ExistingGames
            onSelectBoard={handleOpenBoard}
          />
        </div>
        <div id='settingsContent' style={tabcontent} ref={settingsContentRef}>
          <PuzzleUpload />
        </div>
      </div>
    );
  };

  return renderGameHome();
};

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddUserToBoard: addUserToExistingBoard,
    onCreateBoard: createBoard,
    onSetBoardId: setBoardId,
    onSetFileUploadStatus: setFileUploadStatus,
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
    onUpdateLastPlayedDateTime: updateLastPlayedDateTime,
    onLaunchExistingGame: launchExistingGame,
    onSetUserName: setUserName,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);


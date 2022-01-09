/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryString from 'query-string';

import { isEmpty, isNil, isString } from 'lodash';

import { AppState, StartPage, UiState, UsersMap } from '../types';
import { getVersions, launchExistingGame, loadBoards, loadPuzzlesMetadata, loadUsers, loginPersistentUser, } from '../controllers';
import { getAppState, getUsers } from '../selectors';
import { setAppInitialized, setUiState, setStartPage, setStartupBoardId, } from '../models';

import Login from './Login';
import Launcher from './Launcher';
import Game from './Game';
import { getCurrentUser } from '../selectors';
import { getStartPage, getStartupBoardId } from '../selectors';

export interface HomeProps {
  startPage: StartPage,
  startupBoardId: string | null,
  appState: AppState,
  currentUser: string | null,
  users: UsersMap;
  onGetVersions: () => any;
  onSetUiState: (uiState: UiState) => any;
  onLoadBoards: () => any;
  onLoadPuzzlesMetadata: () => any;
  onLoadUsers: () => any;
  onLoginPersistentUser: () => any;
  onLaunchExistingGame: (boardId: string) => any;
  onSetAppInitialized: () => any;
  onSetStartPage: (startPage: StartPage) => any;
  onSetStartupBoardId: (boardId: string) => any;
}

const Home = (props: HomeProps) => {

  const [initializationComplete, setInitializationComplete] = React.useState<boolean>(false);

  const getStartupParams = () => {

    console.log(window.location.href);
    const parsedQueryParams = QueryString.parse(window.location.search);
    console.log(parsedQueryParams);

    if (!isEmpty(parsedQueryParams)) {

      if (isString(parsedQueryParams.startpage) && parsedQueryParams.startpage === 'joinGame' && !isNil(parsedQueryParams.boardId)) {
        // TEDTODO - validity checking
        // http://localhost:8000/?user=Ted&boardId=863c7139-6b17-4762-95a7-37fe65747719

        const boardId = parsedQueryParams.boardId;
        // TEDTODO - typescript thinks that boardId could be an array

        props.onSetStartPage(StartPage.JoinGame);
        props.onSetStartupBoardId(boardId as string);

        return {
          startPage: StartPage.JoinGame,
          startupBoardId: boardId,
        };
      }

    }

    return {
      startPage: StartPage.Standard,
      startupBoardId: null,
    };
  };

  React.useEffect(() => {

    console.log('Home React.useEffect invoked');

    props.onGetVersions();

    // TEDTODO - put these startup calls into a controller?

    const startupParams: any = getStartupParams();

    const loadPuzzlesMetadataPromise = props.onLoadPuzzlesMetadata();
    const loadBoardsPromise = props.onLoadBoards();
    const loadUsersPromise = props.onLoadUsers();
    Promise.all([loadPuzzlesMetadataPromise, loadBoardsPromise, loadUsersPromise])
      .then(() => {

        const loggedInUser = props.onLoginPersistentUser();

        if (isNil(loggedInUser)) {
          props.onSetUiState(UiState.SelectUser);
        } else if (startupParams.startPage === StartPage.JoinGame && isString(startupParams.startupBoardId)) {
          props.onSetUiState(UiState.SelectPuzzleOrBoard);
          props.onLaunchExistingGame(startupParams.startupBoardId);
        } else {
          props.onSetUiState(UiState.SelectPuzzleOrBoard);
        }

        setInitializationComplete(true);
        props.onSetAppInitialized();

      });
  }, []);

  const divStyle = {
    height: '98vh',
  };

  if (!initializationComplete) {
    return (
      <div style={divStyle}>Loading...</div>
    );
  }
  switch (props.appState.uiState) {
    case UiState.SelectUser: {
      return (
        <div style={divStyle}>
          <Login />
        </div>
      );
    }
    case UiState.SelectPuzzleOrBoard: {
      return (
        <div style={divStyle}>
          <Launcher />
        </div>
      );
    }
    case UiState.NewBoardPlay:
    case UiState.ExistingBoardPlay: {
      return (
        <div style={divStyle}>
          <Game />
        </div>
      );
    }
  }
};

function mapStateToProps(state: any) {
  return {
    startPage: getStartPage(state),
    startupBoardId: getStartupBoardId(state),
    appState: getAppState(state),
    currentUser: getCurrentUser(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onGetVersions: getVersions,
    onSetUiState: setUiState,
    onLoadBoards: loadBoards,
    onLoadPuzzlesMetadata: loadPuzzlesMetadata,
    onLoadUsers: loadUsers,
    onLoginPersistentUser: loginPersistentUser,
    onLaunchExistingGame: launchExistingGame,
    onSetAppInitialized: setAppInitialized,
    onSetStartPage: setStartPage,
    onSetStartupBoardId: setStartupBoardId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


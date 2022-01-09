/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { AppState, StartPage, UiState, UsersMap } from '../types';
import { getVersions, launchExistingGame, loadBoards, loadPuzzlesMetadata, loadUsers, loginPersistentUser, 
  initializeApp,
} from '../controllers';
import { getAppState, getUsers } from '../selectors';
import { setAppInitialized, setUiState, setStartPage, setStartupBoardId, } from '../models';

import { getCurrentUser } from '../selectors';
import { getAppInitialized, getStartPage, getStartupBoardId } from '../selectors';

export interface HomeProps {
  appInitialized: boolean;
  startPage: StartPage,
  startupBoardId: string | null,
  appState: AppState,
  currentUser: string | null,
  users: UsersMap;
  onInitializeApp: () => any;
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

  React.useEffect(() => {
    console.log('Home: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);


  const divStyle = {
    height: '98vh',
  };

  if (!props.appInitialized) {
    return (
      <div style={divStyle}>Loading...</div>
    );
  }

  switch (props.appState.uiState) {
    case UiState.SelectUser:
      return <Redirect to='/login'/>;
    case UiState.SelectPuzzleOrBoard:
      return <Redirect to='/launcher'/>;
    case UiState.NewBoardPlay:
    case UiState.ExistingBoardPlay: // not implemented yet - old code <Game />
    default:
      return (
        <div style={divStyle}>Loading...</div>
      );
  }
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    startPage: getStartPage(state),
    startupBoardId: getStartupBoardId(state),
    appState: getAppState(state),
    currentUser: getCurrentUser(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
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


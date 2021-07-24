/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { AppState, DisplayedPuzzle, FileInput, UiState, User, UsersMap } from '../types';
import { cellChange, oldLoadPuzzle, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';

import Login from './Login';
import GameHome from './GameHome';
import BoardPlay from './BoardPlay';

const Pusher = require('pusher-js');

// let homeCrossword: any;
import { boardPlayCrossword } from './BoardPlay';

let globalProps: HomeProps = null;

export interface HomeProps {
  appState: AppState,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
  displayedPuzzle: DisplayedPuzzle;
  onLoadPuzzlesMetadata: () => any;
  onLoadUsers: () => any;
  onLoadPuzzle: (file: FileInput) => any;
  onCellChange: (user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
}

const initializePusher = () => {
  const pusher = new Pusher('c6addcc9977bdaa7e8a2', {
    cluster: 'us3',
    // encrypted: true,
  });

  const channel = pusher.subscribe('puzzle');
  channel.bind('cell-change', data => {
    if (isNil(globalProps)) {
      console.log('globalProps null - return');
    }
    console.log('websocket cell-change');
    console.log(data);
    console.log('current user is ', globalProps.appState.userName);
    console.log('external event: ', globalProps.appState.userName !== data.user);

    const { user, row, col, typedChar } = data;

    const externalEvent: boolean = globalProps.appState.userName !== user;
    if (externalEvent) {
      (boardPlayCrossword as any).current.remoteSetCell(row, col, typedChar);
    }
  });
};

const Home = (props: HomeProps) => {

  globalProps = props;

  React.useEffect(() => {
    console.log('useEffect: props');
    console.log(props);
    initializePusher();
    props.onLoadPuzzlesMetadata();
    props.onLoadUsers();
  }, []);

  // homeCrossword = React.useRef();
  // console.log('Home: homeCrossword');
  // console.log(homeCrossword);

  switch (props.appState.uiState) {
    case UiState.SelectUser: {
      return (
        <Login/>
      );
    }
    case UiState.SelectPuzzleOrBoard: {
      return (
        <GameHome/>
      );
    }
    case UiState.BoardPlay: {
      return (
        <BoardPlay/>
      );
    }
  }
};

function mapStateToProps(state: any) {
  return {
    users: getUsers(state),
    appState: getAppState(state),
    displayedPuzzle: getDisplayedPuzzle(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetUserName: setUserName,
    onSetUiState: setUiState,
    onLoadPuzzlesMetadata: loadPuzzlesMetadata,
    onLoadPuzzle: oldLoadPuzzle,
    onLoadUsers: loadUsers,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


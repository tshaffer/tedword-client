/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { AppState, DisplayedPuzzle, UiState, UsersMap } from '../types';
import { cellChange, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';

import Login from './Login';
import GameHome from './GameHome';
import BoardPlay from './BoardPlay';

const Pusher = require('pusher-js');

import { boardPlayCrossword } from './BoardPlay';

export interface HomeProps {
  appState: AppState,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
  displayedPuzzle: DisplayedPuzzle;
  onLoadPuzzlesMetadata: () => any;
  onLoadUsers: () => any;
  onCellChange: (user: string, row: number, col: number, typedChar: string, localChange: boolean) => any;
}

let globalProps;

const Home = (props: HomeProps) => {

  globalProps = props;

  const initializePusher = () => {

    const pusher = new Pusher('c6addcc9977bdaa7e8a2', {
      cluster: 'us3',
      // encrypted: true,
    });
  
    const channel = pusher.subscribe('puzzle');
    channel.bind('cell-change', data => {

      console.log('compare props');
      console.log(props);
      console.log(globalProps);

      if (isNil(props)) {
        console.log('globalProps null - return');
      }
      console.log('websocket cell-change');
      console.log(data);
      console.log('current user is ', props.appState.userName);
      console.log('external event: ', props.appState.userName !== data.user);
  
      const { user, row, col, typedChar } = data;
  
      const externalEvent: boolean = props.appState.userName !== user;
      if (externalEvent) {
        (boardPlayCrossword as any).current.remoteSetCell(row, col, typedChar);
      }
    });
  };
  
  React.useEffect(() => {
    initializePusher();
    props.onLoadPuzzlesMetadata();
    props.onLoadUsers();
  }, []);

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
    onLoadUsers: loadUsers,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


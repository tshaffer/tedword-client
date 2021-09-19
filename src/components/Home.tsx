/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { AppState, DisplayedPuzzle, Guess, UiState, UsersMap } from '../types';
import { loadBoards, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName, updateGuess } from '../models';

import Login from './Login';
import GameHome from './GameHome';
import BoardTop from './BoardTop';

const Pusher = require('pusher-js');

export interface HomeProps {
  appState: AppState,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
  displayedPuzzle: DisplayedPuzzle;
  onLoadBoards: () => any;
  onLoadPuzzlesMetadata: () => any;
  onLoadUsers: () => any;
  onUpdateGuess: (row: number, col: number, puzzleGuess: Guess) => any;
}

let homeProps;

const Home = (props: HomeProps) => {

  homeProps = props;

  const initializePusher = () => {

    const pusher = new Pusher('c6addcc9977bdaa7e8a2', {
      cluster: 'us3',
      // encrypted: true,
    });
  
    const channel = pusher.subscribe('puzzle');
    channel.bind('cell-change', data => {

      console.log(homeProps);

      if (isNil(homeProps)) {
        console.log('homeProps null - return');
      }
      console.log('websocket cell-change');
      console.log(data);
      console.log('current user is ', homeProps.appState.userName);
      console.log('external event: ', homeProps.appState.userName !== data.user);
  
      const { user, row, col, typedChar } = data;
  
      const externalEvent: boolean = homeProps.appState.userName !== user;
      if (externalEvent) {
        const guess: Guess = {
          value: typedChar,
          guessIsRemote: true,
          remoteUser: user,
        };
        homeProps.onUpdateGuess(row, col, guess);
      }
    });
  };
  
  React.useEffect(() => {
    initializePusher();
    props.onLoadPuzzlesMetadata();
    props.onLoadBoards();
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
    case UiState.NewBoardPlay:
    case UiState.ExistingBoardPlay: {
      return (
        <BoardTop/>
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
    onLoadBoards: loadBoards,
    onLoadPuzzlesMetadata: loadPuzzlesMetadata,
    onLoadUsers: loadUsers,
    onUpdateGuess: updateGuess,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


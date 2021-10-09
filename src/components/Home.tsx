/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryString from 'query-string';

import { isEmpty, isNil } from 'lodash';

import { AppState, DisplayedPuzzle, Guess, UiState, UsersMap } from '../types';
import { launchExistingGame, loadBoards, loadPuzzlesMetadata, loadUsers } from '../controllers';
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
  onLaunchExistingGame: (boardId: string) => any;
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

  const getStartupParams = () => {
    console.log(window.location.href);
    const parsedQueryParams = QueryString.parse(window.location.search);
    console.log(parsedQueryParams);

    if (!isEmpty(parsedQueryParams)) {
      if (!isNil(parsedQueryParams.user) && (!isNil(parsedQueryParams.boardId))) {
        // TEDTODO - validity checking
        // http://localhost:8000/?user=Ted&boardId=863c7139-6b17-4762-95a7-37fe65747719
        const { user, boardId } = parsedQueryParams;
        console.log(user, boardId);
        props.onSetUserName(user as string);
        props.onSetUiState(UiState.SelectPuzzleOrBoard);
        props.onLaunchExistingGame(boardId as string);
      }
    }
  };

  React.useEffect(() => {
    
    initializePusher();

    const loadPuzzlesMetadataPromise = props.onLoadPuzzlesMetadata();
    const loadBoardsPromise = props.onLoadBoards();
    const loadUsersPromise = props.onLoadUsers();
    Promise.all([loadPuzzlesMetadataPromise, loadBoardsPromise, loadUsersPromise])
      .then(() => {
        getStartupParams();
      });
  }, []);

  switch (props.appState.uiState) {
    case UiState.SelectUser: {
      return (
        <Login />
      );
    }
    case UiState.SelectPuzzleOrBoard: {
      return (
        <GameHome />
      );
    }
    case UiState.NewBoardPlay:
    case UiState.ExistingBoardPlay: {
      return (
        <BoardTop />
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
    onLaunchExistingGame: launchExistingGame,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


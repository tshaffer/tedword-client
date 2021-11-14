/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as QueryString from 'query-string';

import { isArray, isEmpty, isNil, isString } from 'lodash';

import { AppState, DisplayedPuzzle, Guess, StartPage, UiState, UsersMap } from '../types';
import { launchExistingGame, loadBoards, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName, updateGuess, setStartPage, setStartupBoardId, } from '../models';

import Login from './Login';
import GameHome from './GameHome';
import BoardTop from './BoardTop';
import { getCurrentUser } from '../selectors';

// import * as Pusher from 'pusher-js';
const Pusher = require('pusher-js');

export interface HomeProps {
  appState: AppState,
  currentUser: string | null,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
  displayedPuzzle: DisplayedPuzzle;
  onLoadBoards: () => any;
  onLoadPuzzlesMetadata: () => any;
  onLoadUsers: () => any;
  onUpdateGuess: (row: number, col: number, puzzleGuess: Guess) => any;
  onLaunchExistingGame: (boardId: string) => any;
  onSetStartPage: (startPage: StartPage) => any;
  onSetStartupBoardId: (boardId: string) => any;
}

let homeProps;

export let pusher: any;

const Home = (props: HomeProps) => {

  homeProps = props;

  const initializePusher = () => {

    pusher = new Pusher('c6addcc9977bdaa7e8a2', {
      cluster: 'us3',
      // encrypted: true,
      encrypted: true,
      authEndpoint: 'pusher/auth'
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

      if (isString(parsedQueryParams.startpage) && parsedQueryParams.startpage === 'joinGame' && !isNil(parsedQueryParams.boardId)) {
        // TEDTODO - validity checking
        // http://localhost:8000/?user=Ted&boardId=863c7139-6b17-4762-95a7-37fe65747719

        const boardId = parsedQueryParams.boardId;
        // TEDTODO - typescript thinks that boardId could be an array

        props.onSetStartPage(StartPage.JoinGame);
        props.onSetStartupBoardId(boardId as string);

        // users
        //    userNamesOfInvitees: single invited user or list of users invited - retrieved from query string
        //    props.users: map of user objects - loaded from server
        //    storedUserName: user name retrieved from local storage
        // algorithm
        //    if storedUserName is in userNamesOfInvitees and storedUserName is in props.users, join game with storedUserName
        //        ** not currently looking for storedUserName in props.users as props.users does not contain the list of users yet, even
        //        though the users were loaded from the server. I don't know why as I thought this stuff was synchronous??
        //    else ignore request and ????

        // const storedUserName = localStorage.getItem('userName');

        // Code is not looking for a match
        // if (isString(storedUserName) && !isNil(props.users)) {
        //   let proceedToStoredGame = false;
        //   if (isArray(userNamesOfInvitees)) {
        //     if (userNamesOfInvitees.indexOf(storedUserName) >= 0) {
        //       proceedToStoredGame = true;
        //     }
        //   } else if (isString(userNamesOfInvitees)) {
        //     if (userNamesOfInvitees === storedUserName) {
        //       proceedToStoredGame = true;
        //     }
        //   }
        //   if (proceedToStoredGame) {
        //     props.onSetUserName(storedUserName as string);
        //     props.onSetUiState(UiState.SelectPuzzleOrBoard);
        //     props.onLaunchExistingGame(boardId as string);
        //   }
        // }
      }

    }
  };


  React.useEffect(() => {

    initializePusher();

    getStartupParams();
    
    const loadPuzzlesMetadataPromise = props.onLoadPuzzlesMetadata();
    const loadBoardsPromise = props.onLoadBoards();
    const loadUsersPromise = props.onLoadUsers();
    Promise.all([loadPuzzlesMetadataPromise, loadBoardsPromise, loadUsersPromise])
      .then(() => {
        console.log('loads complete');
      });
  }, []);

  if (isNil(props.currentUser)) {
    return (
      <div>Loading...</div>
    );
  }
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
    currentUser: getCurrentUser(state),
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
    onSetStartPage: setStartPage,
    onSetStartupBoardId: setStartupBoardId,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';

import { isNil } from 'lodash';

import FocusedClues from './FocusedClues';
import CrosswordGameMgr from './CrosswordGameMgr';
import GameToolbar from './GameToolbar';

import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, Guess, PuzzlesMetadataMap, PuzzleSpec, UiState } from '../types';
import { initializeApp } from '../controllers';
import { setUiState, updateGuess } from '../models';
import { getAppInitialized, getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';

// import * as Pusher from 'pusher-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pusher = require('pusher-js');

export interface GameProps {
  appInitialized: boolean;
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
  onInitializeApp: () => any;
  onSetUiState: (uiState: UiState) => any;
  onUpdateGuess: (row: number, col: number, puzzleGuess: Guess) => any;
}

export let pusher: any;

let gameProps;

const Game = (props: GameProps) => {

  gameProps = props;

  const initializePusher = () => {

    pusher = new Pusher('c6addcc9977bdaa7e8a2', {
      cluster: 'us3',
      encrypted: true,
      authEndpoint: 'pusher/auth'
    });

    console.log('initializePusher: ', props.appState.boardId);

    const channel = pusher.subscribe(props.appState.boardId);

    // channel.bind('subscription_succeeded', (members) => {
    //   console.log('components/Home.tsx - pusher:');
    //   console.log(members);
    // });

    channel.bind('member_added', (member) => {
      console.log(`${member.id} joined the chat`);
    });

    channel.bind('cell-change', data => {

      console.log(gameProps);

      if (isNil(gameProps)) {
        console.log('gameProps null - return');
      }
      console.log('websocket cell-change');
      console.log(data);
      console.log('current user is ', gameProps.appState.userName);
      console.log('external event: ', gameProps.appState.userName !== data.user);

      const { user, row, col, typedChar } = data;

      const externalEvent: boolean = gameProps.appState.userName !== user;
      if (externalEvent) {
        const guess: Guess = {
          value: typedChar,
          guessIsRemote: true,
          remoteUser: user,
        };
        gameProps.onUpdateGuess(row, col, guess);
      }
    });
  };

  React.useEffect(() => {
    console.log('Game: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    } else {
      initializePusher();
    }
  }, [props.appInitialized]);


  const handleHome = () => {
    console.log('handleHome');
    props.onSetUiState(UiState.SelectPuzzleOrBoard);
  };


  /*
    // From 0 to 600px wide (smart-phones), I take up 12 columns, or the whole device width!
    // From 600-690px wide (tablets), I take up 6 out of 12 columns, so 2 columns fit the screen.
    // From 960px wide and above, I take up 25% of the device (3/12), so 4 columns fit the screen.
        xs, extra-small: 0px
        sm, small: 600px
        md, medium: 900px
        lg, large: 1200px
        xl, extra-large: 1536px      
  */

  // console.log('Game.tsx - re-render');

  const divStyle = {
    height: '98vh',
  };

  if (!props.appInitialized) {
    return (
      <div style={divStyle}>Loading...</div>
    );
  }

  return (
    <HashRouter>
      <div style={{ height: '100%' }}>
        <div>
          <button onClick={handleHome}>Home</button>
        </div>
        <Grid container spacing={1} justify="center" style={{ minHeight: '5%', maxWidth: '100%' }}>
          <GameToolbar />
        </Grid>
        <FocusedClues />
        <CrosswordGameMgr
          appState={props.appState}
          cellContents={props.cellContents}
          displayedPuzzle={props.displayedPuzzle}
          puzzlesMetadata={props.puzzlesMetadata}
          puzzleSpec={props.puzzleSpec}
        />
      </div>
    </HashRouter>
  );
};

function mapStateToProps(state: any) {
  const appState: AppState = getAppState(state);
  const boardId: string = appState.boardId;
  const board: BoardEntity = getBoard(state, boardId);
  const puzzleSpec = isNil(board) ? null : getPuzzle(state, board.puzzleId);
  return {
    appInitialized: getAppInitialized(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState,
    displayedPuzzle: getDisplayedPuzzle(state),
    cellContents: getCellContents(state),
    puzzleSpec,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetUiState: setUiState,
    onUpdateGuess: updateGuess,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

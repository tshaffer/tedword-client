import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { isNil } from 'lodash';

import Board from './Board';
import BoardPlay from './BoardPlay';
import BoardToolbar from './BoardToolbar';
import { getAppState, getBoard, getPuzzlesMetadata, getDisplayedPuzzle, getCellContents, getPuzzle } from '../selectors';
import { AppState, BoardEntity, CellContentsMap, DisplayedPuzzle, Guess, PuzzlesMetadataMap, PuzzleSpec, UiState } from '../types';
import { setUiState, } from '../models';
import Chat from './Chat';

// import * as Pusher from 'pusher-js';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Pusher = require('pusher-js');

export interface BoardTopProps {
  appState: AppState,
  cellContents: CellContentsMap;
  displayedPuzzle: DisplayedPuzzle;
  puzzlesMetadata: PuzzlesMetadataMap;
  puzzleSpec: PuzzleSpec;
  onSetUiState: (uiState: UiState) => any;
}

export let pusher: any;

let boardTopProps;

const BoardTop = (props: BoardTopProps) => {

  boardTopProps = props;

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

      console.log(boardTopProps);

      if (isNil(boardTopProps)) {
        console.log('boardTopProps null - return');
      }
      console.log('websocket cell-change');
      console.log(data);
      console.log('current user is ', boardTopProps.appState.userName);
      console.log('external event: ', boardTopProps.appState.userName !== data.user);

      const { user, row, col, typedChar } = data;

      const externalEvent: boolean = boardTopProps.appState.userName !== user;
      if (externalEvent) {
        const guess: Guess = {
          value: typedChar,
          guessIsRemote: true,
          remoteUser: user,
        };
        boardTopProps.onUpdateGuess(row, col, guess);
      }
    });
  };

  React.useEffect(() => {
    console.log('BoardTop useEffect invoked');
    initializePusher();
  }, []);


  const useStyles = makeStyles((theme) => ({
    gridStyle: {
      height: '200px',
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary
    }
  }));

  const classes = useStyles();

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

  return (
    <div style={{ height: '100%' }}>
      <Grid container spacing={1} justify="center" style={{ minHeight: '5%', maxWidth: '100%' }}>
        <BoardToolbar />
      </Grid>
      <Board />

      <Grid container spacing={1} justify="center" style={{ minHeight: '90%', maxWidth: '100%', background: 'pink' }}>
        <Grid item xs={8} style={{ minHeight: '100%' }}>
          <Paper className={classes.paper}>Board</Paper>
        </Grid>
        <Grid item xs={4} container style={{ minHeight: '100%' }}>
          <Grid item container spacing={1} xs={12} style={{ height: '90%', maxWidth: '100%', background: 'cyan' }}>
            <Grid item xs={12} md={6} style={{ background: 'orange' }}>
              <Paper className={classes.paper}>Across Clues</Paper>
            </Grid>
            <Grid item xs={12} md={6} style={{ background: 'gray' }}>
              <Paper className={classes.paper}>Down Clues</Paper>
            </Grid>
          </Grid>
          <Grid item xs={12} style={{ height: '10%', background: 'lightGreen' }}>
            <Paper className={classes.paper}>Chat</Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

function mapStateToProps(state: any) {
  const appState: AppState = getAppState(state);
  const boardId: string = appState.boardId;
  const board: BoardEntity = getBoard(state, boardId);
  const puzzleSpec = isNil(board) ? null : getPuzzle(state, board.puzzleId);
  return {
    puzzlesMetadata: getPuzzlesMetadata(state),
    appState,
    displayedPuzzle: getDisplayedPuzzle(state),
    cellContents: getCellContents(state),
    puzzleSpec,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardTop);

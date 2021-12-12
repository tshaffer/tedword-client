import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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

    const channel = pusher.subscribe('boardId');

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

  const handleHome = () => {
    console.log('handleHome');
    props.onSetUiState(UiState.SelectPuzzleOrBoard);
  };

  return (
    <div style={{ position: 'relative', height: '1080px' }}>
      <div style={{ maxHeight: '800px', overflow: 'auto' }}>
        <button onClick={handleHome}>Home</button>
        <br />
        <BoardToolbar />
        <Chat/>
        <Board />
        <BoardPlay
          appState={props.appState}
          cellContents={props.cellContents}
          displayedPuzzle={props.displayedPuzzle}
          puzzlesMetadata={props.puzzlesMetadata}
          puzzleSpec={props.puzzleSpec}
        />
      </div>
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

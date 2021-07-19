/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, DisplayedPuzzle, FileInput, UiState, User, UsersMap } from '../types';
import { cellChange, loadPuzzle, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';

import Login from './Login';
import GameHome from './GameHome';

const Pusher = require('pusher-js');

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;

let crossword: any;
const puzzleUser: string = 'ted';

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
    console.log('websocket cell-change');
    console.log(data);
    console.log('current user is ', puzzleUser);
    console.log('external event: ', puzzleUser !== data.user);

    const { user, row, col, typedChar } = data;

    const externalEvent: boolean = puzzleUser !== user;
    if (externalEvent) {
      (crossword as any).current.remoteSetCell(row, col, typedChar);
    }
  });
};

const Home = (props: HomeProps) => {

  const [user, setUser] = React.useState('ted');

  React.useEffect(() => {
    console.log('useEffect: props');
    console.log(props);
    // initializePusher();
    props.onLoadPuzzlesMetadata();
    props.onLoadUsers();
  }, []);

  crossword = React.useRef();

  const handleFillAllAnswers = React.useCallback((event) => {
    (crossword as any).current.fillAllAnswers();
  }, []);

  const handleResetPuzzle = React.useCallback((event) => {
    (crossword as any).current.reset();
  }, []);

  const handleRemoteSetCell = React.useCallback((event) => {
    (crossword as any).current.remoteSetCell(0, 1, 'X');
  }, []);

  const handleSelectPuzzle = (fileInputEvent: any) => {
    console.log('handleSelectPuzzle');
    const files: FileInput[] = fileInputEvent.target.files;
    console.log(files);
    props.onLoadPuzzle(files[0]);
  };

  const handleCellChange = (row: number, col: number, typedChar: string, localChange: boolean) => {
    console.log('handleCellChange');
    console.log(row, col, typedChar);
    props.onCellChange(puzzleUser, row, col, typedChar, localChange);
  };

  const handleClueCorrect = (direction: string, number: string, answer: string) => {
    console.log('handleClueCorrect');
    console.log(direction, number, answer);
  };

  const handleLoadedCorrect = (param) => {
    console.log('handleLoadedCorrect');
    console.log(param);
  };

  const handleCrosswordCorrect = (param) => {
    console.log('handleCrosswordCorrect');
    console.log(param);
  };

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
  }
  /*
    if (isEmpty(props.displayedPuzzle.across) && isEmpty(props.displayedPuzzle.down)) {
      return (
        <div>
          <p>
            Uncooked Pizza
          </p>
          <div>
            <select onChange={handleUserChange} value={user}>
              <option value="joel">Joel</option>
              <option value="morgan">Morgan</option>
              <option selected value="ted">Ted</option>
            </select>
          </div>
          <input
            type="file"
            id="fileInput"
            onChange={handleSelectPuzzle}
          >
          </input>
        </div>
      );
    }
  
    return (
      <div>
        <p>
          Cooked Pizza
        </p>
  
        <div>
          <button
            type="button"
            onClick={handleFillAllAnswers}
          >
            Fill all answers
          </button>
          <button
            type='button'
            onClick={handleResetPuzzle}
          >
            Reset puzzle
          </button>
          <button
            type='button'
            onClick={handleRemoteSetCell}
          >
            Set cell remote
          </button>
        </div>
  
        <Crossword
          data={props.displayedPuzzle}
          ref={crossword}
          onCellChange={handleCellChange}
          onCorrect={handleClueCorrect}
          onLoadedCorrect={handleLoadedCorrect}
          onCrosswordCorrect={handleCrosswordCorrect}
        />
      </div>
    );
  */
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
    onLoadPuzzle: loadPuzzle,
    onLoadUsers: loadUsers,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


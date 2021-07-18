/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, DisplayedPuzzle, FileInput, UiState, User, UsersMap } from '../types';
import { cellChange, loadPuzzle, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';

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
  // React.useEffect(initialize, []);

  crossword = React.useRef();

  const handleUserChange = (event) => {
    console.log('handleUserChange');
    console.log(event.target.value);
    props.onSetUserName(event.target.value);
    // setUser(event.target.value);
    // puzzleUser = event.target.value;
  };

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

  const handleLogin = () => {
    console.log('handleLogin invoked');
    props.onSetUiState(UiState.SelectPuzzleOrBoard);
  };

  const getSelectedUserName = (userNames: string[]) => {
    const userNameFromRedux: string = props.appState.userName;
    return userNameFromRedux === '' ? userNames[0] : userNameFromRedux;
  };

  const getUserNames = (): string[] => {
    const userNames: string[] = [];
    for (const userName in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
        userNames.push(userName);
      }
    }
    return userNames;
  };

  const getUserOptions = (userNames: string[]) => {
    const userOptions = userNames.map((userName: string) => {
      return getUserOption(userName);
    });
    return userOptions;
  };

  const getUserOption = (userName: string) => {
    return (
      <option
        key={userName}
        value={userName}
      >
        {userName}
      </option>
    );
  };

  const renderSelectUser = () => {

    const userNames: string[] = getUserNames();
    if (userNames.length === 0) {
      return null;
    }

    const userOptions = getUserOptions(userNames);

    const selectedUserName = getSelectedUserName(userNames);

    return (
      <div>

        <p>Select user</p>
        <select
          tabIndex={-1}
          value={selectedUserName}
          onChange={handleUserChange}
        >
          {userOptions}
        </select>
        <p>
          <button
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </p>
      </div>
    );

  };

  switch (props.appState.uiState) {
    case UiState.SelectUser: {
      return renderSelectUser();
    }
    case UiState.SelectPuzzleOrBoard: {
      return (
        <div>
          Pick a puzzle to play
        </div>
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


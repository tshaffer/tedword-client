/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isEmpty, isNil } from 'lodash';

import { AppState, DisplayedPuzzle, FileInput, UiState, User, UsersMap } from '../types';
import { cellChange, loadPuzzle, loadPuzzlesMetadata, loadUsers } from '../controllers';
import { getAppState, getDisplayedPuzzle, getUsers } from '../selectors';

const Pusher = require('pusher-js');

// import Crossword from '@jaredreisinger/react-crossword';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Crossword = require('@jaredreisinger/react-crossword').Crossword;

let crossword: any;
let puzzleUser: string = 'ted';

export interface HomeProps {
  appState: AppState,
  users: UsersMap;
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
    setUser(event.target.value);
    puzzleUser = event.target.value;
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

  const getUserOptions = () => {
    const userOptions: any[] = [];
    for (const userName in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
        const user: User = props.users[userName];
        userOptions.push({
          user,
        });
      }
    }
    return userOptions;
  };

  // const renderUserOptions = (options: any[]) => {
  //   // return options.map((option) =>
  //   // (
  //   //   <option
  //   //     key={option.userName}
  //   //     value={option.userName}
  //   //   >
  //   //     {option.userName}
  //   //   </option>
  //   // )
  //   // );
  //   const optionsJsx = [];
  //   if (options.length > 0) {
  //     optionsJsx.push(
  //       <option
  //         key={options[0].userName}
  //         value={options[0].userName}
  //       >
  //         {options[0].userName}
  //       </option>
  //     );
  //   }
  //   if (options.length > 1) {
  //     optionsJsx.push(
  //       <option
  //         key={options[1].userName}
  //         value={options[1].userName}
  //       >
  //         {options[1].userName}
  //       </option>
  //     );
  //   }
  //   if (options.length > 2) {
  //     optionsJsx.push(
  //       <option
  //         key={options[2].userName}
  //         value={options[2].userName}
  //       >
  //         {options[2].userName}
  //       </option>
  //     );
  //   }

  //   return optionsJsx;
  // };

  const getOption = (userName: string) => {
    return (
      <option
        key={userName}
        value={userName}
      >
        {userName}
      </option>
    );
  };

  const getOptions = (): any[] => {
    const options: any[] = [];
    for (const userName in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
        options.push(getOption(userName));
      }
    }
    return options;
  };

  // const getOption0 = () => {
  //   return (
  //     <option
  //       key='Ted'
  //       value='Ted'
  //     >
  //       Ted
  //     </option>
  //   );
  // };

  // const getOption1 = () => {
  //   return (
  //     <option
  //       key='Joel'
  //       value='Joel'
  //     >
  //       Joel
  //     </option>
  //   );
  // };

  // const getOption2 = () => {
  //   return (
  //     <option
  //       key='Morgan'
  //       value='Morgan'
  //     >
  //       Morgan
  //     </option>
  //   );
  // };



  const renderSelectUser = () => {

    const userOptions = getUserOptions();

    if (userOptions.length === 0) {
      return null;
    }

    // return (
    //   <select>
    //     {renderUserOptions(userOptions)}
    //   </select>
    // );

    // return (
    //   <select
    //     tabIndex={-1}
    //     value={userOptions[0].userName}
    //   >
    //     <option
    //       key='Ted'
    //       value='Ted'
    //     >
    //       Ted
    //     </option>
    //     <option
    //       key='Joel'
    //       value='Joel'
    //     >
    //       Joel
    //     </option>
    //     <option
    //       key='Morgan'
    //       value='Morgan'
    //     >
    //       Morgan
    //     </option>
    //   </select>
    // );

    // const option0 = getOption0();
    // const option1 = getOption1();
    // const option2 = getOption2();

    // const options = [option0, option1, option2];

    // { option0 }
    // { option1 }
    // { option2 }

    // const option00 = getOption('Ted');
    // const option01 = getOption('Joel');
    // const option02 = getOption('Morgan');
    // const options = [option00, option01, option02];

    // const options: any[] = [];
    // for (const userName in props.users) {
    //   if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
    //     options.push(getOption(userName));
    //     // const element = props.users[userName];
    //   }
    // }

    const options: any[] = getOptions();

    return (
      <select
        tabIndex={-1}
        value={userOptions[0].userName}
      >
        {options}
      </select>
    );

  };

  switch (props.appState.uiState) {
    case UiState.SelectUser: {
      return renderSelectUser();
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
    onLoadPuzzlesMetadata: loadPuzzlesMetadata,
    onLoadPuzzle: loadPuzzle,
    onLoadUsers: loadUsers,
    onCellChange: cellChange,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);


import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactModal = require('react-modal');
import Select from 'react-select';

import { GameState, User, UsersMap } from '../types';
import { updateElapsedTime } from '../controllers';
import { setPuzzlePlayActive } from '../models';
import { getBoardId, getElapsedTime, getGameState, getPuzzlePlayActive, getUsers } from '../selectors';
import { isNil } from 'lodash';

export interface BoardToolbarProps {
  boardId: string,
  elapsedTime: number,
  gameState: GameState,
  puzzlePlayActive: boolean,
  users: UsersMap,
  onSetPuzzlePlayActive: (puzzleActive: boolean) => any;
  onUpdateElapsedTime: (boardId: string, elapsedTime: number) => any;
}

let currentBoardId: string = null;
let currentElapsedTime: number = -1;
let intervalId: NodeJS.Timeout;

const BoardToolbar = (props: BoardToolbarProps) => {

  const elapsedGameTimerRef = React.useRef(false);

  const [showSendInviteModal, setShowSendInviteModal] = React.useState(false);

  React.useEffect(() => {
    initVisibilityHandler();
    props.onSetPuzzlePlayActive(true);
    startTimer();
    elapsedGameTimerRef.current = true;
  }, []);

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const sendInviteModalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minHeight: '120px',
      minWidth: '150px',
    },
  };

  const buttonStyle = {
    marginLeft: '6px',
  };

  const initVisibilityHandler = () => {
    let hidden, visibilityChange;
    if (typeof document.hidden !== 'undefined') { // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }
    document.addEventListener(visibilityChange, handleVisibilityChange, false);
  };

  const getElapsedTimeString = (): string => {
    const date: Date = new Date(0);
    date.setSeconds(currentElapsedTime);
    let elapsedTimeString = date.toISOString().substr(11, 8).replace(/^[0:]+/, '');
    if (elapsedTimeString.length === 2) {
      elapsedTimeString = '0:' + elapsedTimeString;
    } else if (elapsedTimeString.length === 1) {
      elapsedTimeString = '0:0' + elapsedTimeString;
    }
    return elapsedTimeString;
  };

  const getInviteeOptions = () => {
    const inviteeOptions: any[] = [];
    for (const userKey in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userKey)) {
        const user: User = props.users[userKey];
        inviteeOptions.push({
          value: user,
          label: user.userName
        });
      }
    }
    return inviteeOptions;
  };

  const handleVisibilityChange = () => {
    console.log('handleVisibilityChange', elapsedGameTimerRef.current);
    if (document.hidden) {
      console.log('crossword hidden');
      pauseTimer();
    } else {
      console.log('crossword visible');
      if (elapsedGameTimerRef.current) {
        startTimer();
      }
    }
  };

  const handleTimerTimeout = () => {
    console.log('handleTimerTimeout', elapsedGameTimerRef.current);
    const currentElapsedTimeInSeconds = currentElapsedTime;
    const newElapsedTimeInSeconds = currentElapsedTimeInSeconds + 1;
    if (!isNil(currentBoardId) && (currentElapsedTime >= 0)) {
      props.onUpdateElapsedTime(currentBoardId, newElapsedTimeInSeconds);
    }
  };

  const startTimer = () => {
    intervalId = setInterval(handleTimerTimeout, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
  };

  const handlePauseGame = () => {
    console.log('handlePauseGame', elapsedGameTimerRef.current);
    pauseTimer();
    props.onSetPuzzlePlayActive(false);
    elapsedGameTimerRef.current = false;
  };

  const handleResumeGame = () => {
    console.log('handleResumeGame', elapsedGameTimerRef.current);
    startTimer();
    props.onSetPuzzlePlayActive(true);
    elapsedGameTimerRef.current = true;
  };

  const handleShowSendInvite = () => {
    setShowSendInviteModal(true);
  };

  const handleSendInvite = () => {
    setShowSendInviteModal(false);
  };

  return (
    <div>
      <div>
        <ReactModal
          isOpen={!props.puzzlePlayActive}
          style={modalStyle}
          ariaHideApp={false}
        >
          <div>
            <p>Your game has been paused.</p>
            <button onClick={handleResumeGame}>Resume</button>
          </div>
        </ReactModal>
      </div>
      <div>
        <ReactModal
          isOpen={showSendInviteModal}
          style={sendInviteModalStyle}
          ariaHideApp={false}
        >
          <div>
            <p>Invite others to play</p>
            <Select
              options={getInviteeOptions()}
              isMulti
            />
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                margin: '8px auto',
              }}
            >
              <button onClick={handleSendInvite}>Generate Link</button>
              <button
                onClick={handleSendInvite}
                style={{
                  marginLeft: '8px',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </ReactModal>
      </div>
      {getElapsedTimeString()}
      <button
        onClick={() => handlePauseGame()}
        disabled={!props.puzzlePlayActive}
        style={buttonStyle}
      >
        {'Pause'}
      </button>
      <button
        onClick={() => handleShowSendInvite()}
        style={buttonStyle}
      >
        Send Invitation
      </button>
    </div>
  );
};

function mapStateToProps(state: any) {
  currentBoardId = getBoardId(state);
  currentElapsedTime = getElapsedTime(state);
  return {
    boardId: getBoardId(state),
    elapsedTime: getElapsedTime(state),
    gameState: getGameState(state),
    puzzlePlayActive: getPuzzlePlayActive(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzlePlayActive: setPuzzlePlayActive,
    onUpdateElapsedTime: updateElapsedTime,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardToolbar);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactModal = require('react-modal');

import { GameState } from '../types';
import { updateElapsedTime } from '../controllers';
import { setPuzzlePlayActive } from '../models';
import { getBoardId, getElapsedTime, getGameState, getPuzzlePlayActive } from '../selectors';
import { isNil } from 'lodash';

export interface BoardToolbarProps {
  boardId: string,
  elapsedTime: number,
  gameState: GameState,
  puzzlePlayActive: boolean,
  onSetPuzzlePlayActive: (puzzleActive: boolean) => any;
  onUpdateElapsedTime: (boardId: string, elapsedTime: number) => any;
}

let currentBoardId: string = null;
let currentElapsedTime: number = -1;
let intervalId: NodeJS.Timeout;

const BoardToolbar = (props: BoardToolbarProps) => {

  React.useEffect(() => {
    initVisibilityHandler();
    props.onSetPuzzlePlayActive(true);
    startTimer();
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

  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log('crossword hidden');
      pauseTimer();
    } else {
      console.log('crossword visible');
      startTimer();
    }
  };

  const handleTimerTimeout = () => {
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
    pauseTimer();
    props.onSetPuzzlePlayActive(false);
  };

  const handleResumeGame = () => {
    startTimer();
    props.onSetPuzzlePlayActive(true);
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
      {getElapsedTimeString()}
      <button
        onClick={() => handlePauseGame()}
        disabled={!props.puzzlePlayActive}
        style={buttonStyle}
      >
        {'Pause'}
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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzlePlayActive: setPuzzlePlayActive,
    onUpdateElapsedTime: updateElapsedTime,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardToolbar);

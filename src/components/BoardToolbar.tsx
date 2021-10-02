import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ReactModal = require('react-modal');

import { GameState } from '../types';
import { setPuzzlePlayActive } from '../models';
import { getGameState, getPuzzlePlayActive } from '../selectors';

export interface BoardToolbarProps {
  gameState: GameState,
  puzzlePlayActive: boolean,
  onSetPuzzlePlayActive: (puzzleActive: boolean) => any;
}

const BoardToolbar = (props: BoardToolbarProps) => {

  React.useEffect(() => {
    props.onSetPuzzlePlayActive(true);
  }, []);

  const handlePauseGame = () => {
    props.onSetPuzzlePlayActive(false);
  };

  const handleResumeGame = () => {
    props.onSetPuzzlePlayActive(true);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const buttonLabel: string = props.puzzlePlayActive
    ? 'Pause'
    : 'Resume';

  const handler: any = props.puzzlePlayActive
    ? handlePauseGame
    : handleResumeGame;

  return (
    <div>
      <div>
        <ReactModal
          isOpen={!props.puzzlePlayActive}
          style={customStyles}
          contentLabel="Pizza"
        >
          <div>
            <p>Your game has been paused.</p>
            <button onClick={handleResumeGame}>Resume</button>
          </div>
        </ReactModal>
      </div>
      <button
        onClick={() => handler()}
      >
        {buttonLabel}
      </button>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    gameState: getGameState(state),
    puzzlePlayActive: getPuzzlePlayActive(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetPuzzlePlayActive: setPuzzlePlayActive,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardToolbar);

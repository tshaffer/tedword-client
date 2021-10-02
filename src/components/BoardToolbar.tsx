import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GameState } from '../types';
import { getGameState } from '../selectors';
import ReactModal = require('react-modal');

export interface BoardToolbarProps {
  gameState: GameState,
}

const BoardToolbar = (props: BoardToolbarProps) => {

  const [showModal, setShowModal] = React.useState(false);

  console.log(props);

  const handlePauseGame = () => {
    console.log('handlePauseGame');
    setShowModal(true);
  };

  const handleResumeGame = () => {
    console.log('handleResumeGame');
    setShowModal(false);
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

  return (
    <div>
      <p>{'this is the toolbar'}</p>
      <div>
        <ReactModal
          isOpen={showModal}
          style={customStyles}
          contentLabel="Minimal Modal Example"
        >
          <div>
            <p>Your game has been paused.</p>
            <button onClick={handleResumeGame}>Resume</button>
          </div>
        </ReactModal>
      </div>

      <button
        onClick={() => handlePauseGame()}
      >
        Pause
      </button>

      <button
        onClick={() => handleResumeGame()}
      >
        Resume
      </button>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    gameState: getGameState(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardToolbar);

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

  return (
    <div>
      <p>{'this is the toolbar'}</p>
      <div>
        <ReactModal
          isOpen={showModal}
          contentLabel="Minimal Modal Example"
        >
          <button onClick={handleResumeGame}>Resume</button>
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

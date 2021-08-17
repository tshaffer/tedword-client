import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GameState} from '../types';
import { getGameState } from '../selectors';

export interface BoardProps {
  gameState: GameState,
}

// onFocusedCellChange={handleFocusedCellChange}

const handleFocusedCellChange = (row: any, col: any, direction: any) => {
  console.log('handleFocusedCellChange', row, col, direction);
  // props.onUpdateFocusedClues(row, col);
};

const Board = (props: BoardProps) => {

  console.log('Board render');
  console.log(props.gameState);

  return (
    <div>
      <p>1A Potato, informally (4)</p>
      <p>1D Weeps loudly (4)</p>
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

export default connect(mapStateToProps, mapDispatchToProps)(Board);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { GameState} from '../types';
import { getGameState } from '../selectors';
import { isNil } from 'lodash';

export interface BoardProps {
  gameState: GameState,
}

const Board = (props: BoardProps) => {

  let acrossClue: string = '';
  let downClue: string = '';

  if (!isNil(props.gameState)) {
    if (!isNil(props.gameState.focusedAcrossClue)) {
      acrossClue = props.gameState.focusedAcrossClue.number.toString() + ' across: ' + props.gameState.focusedAcrossClue.text;
    }
    if (!isNil(props.gameState.focusedAcrossClue)) {
      downClue = props.gameState.focusedDownClue.number.toString() + ' down: ' + props.gameState.focusedDownClue.text;
    }

  }
  return (
    <div>
      <p>{acrossClue}</p>
      <p>{downClue}</p>
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

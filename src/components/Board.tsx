import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
const useStyles = makeStyles((theme) => ({
  gridStyle: {
    height: '200px',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary
  }
}));

import { ClueAtLocation, CluesByDirection, CluesByNumber, GameState, Guess, GuessesGrid } from '../types';
import { getCrosswordClues, getGameState, getGuesses } from '../selectors';
import { isNil } from 'lodash';

export interface BoardProps {
  gameState: GameState,
  cluesByDirection: CluesByDirection;
  guesses: GuessesGrid;
}

const Board = (props: BoardProps) => {

  const classes = useStyles();

  const getUserEntry = (direction: string, clueNumber: string): string => {

    if (isNil(props.cluesByDirection) || isNil(props.guesses)) {
      return '';
    }

    const cluesByNumber: CluesByNumber = props.cluesByDirection[direction];
    const clueAtLocation: ClueAtLocation = cluesByNumber[clueNumber];
    const clueRow = clueAtLocation.row;
    const clueColumn = clueAtLocation.col;
    const clueAnswer = clueAtLocation.answer;
    let userEntry = '';
    if (direction === 'across') {
      for (let j = 0; j < clueAnswer.length; j++) {
        const guess: Guess = props.guesses[clueRow][clueColumn + j];
        if (guess.value === '') {
          userEntry += '_';
        } else {
          userEntry += guess.value;
        }
      }
    } else {
      for (let j = 0; j < clueAnswer.length; j++) {
        const guess: Guess = props.guesses[clueRow + j][clueColumn];
        if (guess.value === '') {
          userEntry += '_';
        } else {
          userEntry += guess.value;
        }
      }
    }
    return userEntry;
  };

  let acrossClue: string = '';
  let acrossUserEntry: string = '';
  let downClue: string = '';
  let downUserEntry: string = '';

  if (!isNil(props.gameState)) {
    if (!isNil(props.gameState.focusedAcrossClue)) {
      acrossClue = props.gameState.focusedAcrossClue.number.toString() + ' Across (' + props.gameState.focusedAcrossClue.length.toString() + ')' + props.gameState.focusedAcrossClue.text;
      acrossUserEntry = getUserEntry('across', props.gameState.focusedAcrossClue.number.toString());
    }
    if (!isNil(props.gameState.focusedDownClue)) {
      downClue = props.gameState.focusedDownClue.number.toString() + ' Down (' + props.gameState.focusedDownClue.length.toString() + ')' + props.gameState.focusedDownClue.text;
      downUserEntry = getUserEntry('down', props.gameState.focusedDownClue.number.toString());
    }
  }

  if (acrossClue === '') {
    acrossClue = 'A bug that nothing is displayed here';
    downClue = 'Working on it, harder than I thought';
  }

  /*
    return (
      <div style={{
        width: '100%',
        marginTop: '8px',
        marginBottom: '16px',
      }}>
        <div style={{
          marginRight: '32px',
          float: 'left',
        }}>
          <p>{acrossClue}</p>
          <p>{acrossUserEntry}</p>
        </div>
        <div>
          <p>{downClue}</p>
          <p>{downUserEntry}</p>
        </div>
      </div>
    );
  */

  return (
    <Grid container spacing={1} justify="flex-start" style={{ minHeight: '5%', maxWidth: '100%' }}>
      <Grid item xs={12} sm={6} md={3} lg={2} >
        <Paper className={classes.paper}>Across Clue</Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3} lg={2} >
        <Paper className={classes.paper}>Down Clue</Paper>
      </Grid>
    </Grid>
  );

};

function mapStateToProps(state: any) {
  return {
    gameState: getGameState(state),
    cluesByDirection: getCrosswordClues(state),
    guesses: getGuesses(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

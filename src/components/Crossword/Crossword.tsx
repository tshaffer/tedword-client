import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ThemeContext, ThemeProvider } from 'styled-components';

import Grid from '@material-ui/core/Grid';

import Board from './Board';
import Clues from './Clues';
import Chat from '../Chat/Chat';

import { GridSpec } from '../../types';

import {
  setCurrentDirection,
  setCurrentNumber,
} from '../../models';

import {
  getSize,
  getGridData,
} from '../../selectors';


import {
  CrosswordSizeContext,
} from './context';

const defaultTheme = {
  columnBreakpoint: '768px',  // currently unused
  gridBackground: 'rgb(0,0,0)',
  cellBackground: 'rgb(255,255,255)',
  cellBorder: 'rgb(0,0,0)',
  textColor: 'rgb(0,0,0)',
  remoteGuessTextColor: 'rgb(255, 0, 255)',
  numberColor: 'rgba(0,0,0, 0.25)',
  focusBackground: 'rgb(255,255,0)',
  highlightBackground: 'rgb(255,255,204)',
};

export interface CrosswordPropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
  onFocusedCellChange: (row: any, col: any, direction: any) => any;
}

export interface CrosswordProps extends CrosswordPropsFromParent {
  size: number;
  gridData: GridSpec;
  onSetCurrentDirection: (direction: string) => any;
  onSetCurrentNumber: (currentNumber: string) => any;
}

const Crossword = (props: CrosswordProps) => {

  React.useEffect(() => {
    props.onFocusedCellChange(0, 0, 'across');
    props.onSetCurrentDirection('across');
    props.onSetCurrentNumber('1');
  }, [props.size, props.gridData]);

  const contextTheme = React.useContext(ThemeContext);

  // focus and movement
  if (props.size === 0) {
    return null;
  }

  const cellSize = 100 / props.size;
  const cellPadding = 0.125;
  const cellInner = cellSize - cellPadding * 2;
  const cellHalf = cellSize / 2;
  const fontSize = cellInner * 0.7;

  // const context = {
  //   focused: props.focused,
  //   selectedDirection: props.currentDirection,
  //   selectedNumber: props.currentNumber,
  // };
  const finalTheme = { ...defaultTheme, ...(contextTheme as any) };

  const renderBoardComponent = () => {
    return (
      <Board
        onInput={props.onInput}
        onFocusedCellChange={props.onFocusedCellChange}
      />
    );
  };

  const renderChatComponent = () => {
    return (
      <Grid item xs={12} style={{ height: '10%' }}>
        <Chat />
      </Grid>
    );
  };

  const renderCluesComponent = () => {
    return (
      <Clues
        onInput={props.onInput}
        onFocusedCellChange={props.onFocusedCellChange}
      />
    );
  };

  const boardComponent = renderBoardComponent();
  const cluesComponent = renderCluesComponent();
  const chatComponent = renderChatComponent();

  return (
    <CrosswordSizeContext.Provider
      value={{ cellSize, cellPadding, cellInner, cellHalf, fontSize }}
    >
      <ThemeProvider theme={finalTheme}>
        <Grid container spacing={1} justify="center" style={{ maxWidth: '100%', height: '100%' }}>
          {boardComponent}
          <Grid item xs={4} sm={5} md={6} lg={7} xl={8} container style={{ minHeight: '100%', maxHeight: '100%' }}>
            {cluesComponent}
            {chatComponent}
          </Grid>
        </Grid>
      </ThemeProvider>
    </CrosswordSizeContext.Provider>
  );
};

function mapStateToProps(state: any) {
  return {
    size: getSize(state),
    gridData: getGridData(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetCurrentDirection: setCurrentDirection,
    onSetCurrentNumber: setCurrentNumber,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Crossword);

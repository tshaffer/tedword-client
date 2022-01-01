import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { ThemeContext, ThemeProvider } from 'styled-components';

import Grid from '@material-ui/core/Grid';

import Board from './Board';
import Clues from './Clues';
import Chat from '../Chat/Chat';

import { otherDirection } from '../../utilities';

import {
  GridSquareSpec,
  GridSpec,
  FakeCellData
} from '../../types';

import {
  setCurrentDirection,
  setCurrentNumber,
  setFocused,
  setFocusedRow,
  setFocusedCol,
} from '../../models';

import {
  getSize,
  getGridData,
  getCurrentDirection,
  getInputElement,
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
  inputElement: HTMLInputElement;
  size: number;
  gridData: GridSpec;
  currentDirection: string;
  onSetCurrentDirection: (direction: string) => any;
  onSetCurrentNumber: (currentNumber: string) => any;
  onSetFocused: (focused: boolean) => any;
  onSetFocusedRow: (row: number) => any;
  onSetFocusedCol: (col: number) => any;
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

  const getCellData = (row, col): GridSquareSpec | FakeCellData => {
    if (row >= 0 && row < props.size && col >= 0 && col < props.size) {
      return props.gridData[row][col];
    }

    // fake cellData to represent "out of bounds"
    return { row, col, used: false };
  };

  const handleSetFocus = () => {
    if (!isNil(props.inputElement)) {
      props.inputElement.focus();
      props.onSetFocused(true);
    }
    props.onSetFocused(true);
  };

  const handleMoveTo = (row: number, col: number, directionOverride: string) => {
    let direction: string;
    if (isNil(directionOverride)) {
      direction = props.currentDirection;
    } else {
      direction = directionOverride;
    }

    const candidate: GridSquareSpec | FakeCellData = getCellData(row, col);

    if (!candidate.used) {
      return false;
    }

    if (!candidate[direction]) {
      direction = otherDirection(direction);
    }

    props.onFocusedCellChange(row, col, direction);
    props.onSetFocusedRow(row);
    props.onSetFocusedCol(col);
    props.onSetCurrentDirection(direction);
    props.onSetCurrentNumber(candidate[direction]);
  };

  const renderBoardComponent = () => {
    return (
      <Board
        onInput={props.onInput}
        onSetFocus={handleSetFocus}
        onFocusedCellChange={props.onFocusedCellChange}
        onMoveTo={handleMoveTo}
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
        onSetFocus={handleSetFocus}
        onFocusedCellChange={props.onFocusedCellChange}
        onMoveTo={handleMoveTo}
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
    inputElement: getInputElement(state),
    size: getSize(state),
    gridData: getGridData(state),
    currentDirection: getCurrentDirection(state),

  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetCurrentDirection: setCurrentDirection,
    onSetCurrentNumber: setCurrentNumber,
    onSetFocused: setFocused,
    onSetFocusedRow: setFocusedRow,
    onSetFocusedCol: setFocusedCol,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Crossword);

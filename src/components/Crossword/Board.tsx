import * as React from 'react';
import { useContext, useRef } from 'react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Grid from '@material-ui/core/Grid';

import { ThemeContext } from 'styled-components';

import Cell from './Cell';

import {
  Guess,
  CluesByDirection,
  GuessesGrid,
  GridSquare,
  GridSquareSpec,
  GridSpec,
  CrosswordCellCoordinate,
  FakeCellData
} from '../../types';

import {
  moveTo,
  updateFocusedClues,
} from '../../controllers';

import {
  setCurrentDirection,
  setCurrentNumber,
  setFocusedRow,
  setFocusedCol,
  setInputElement,
} from '../../models';

import {
  getCrosswordClues,
  getGuesses,
  getSize,
  getGridData,
  getFocused,
  getCurrentDirection,
  getCurrentNumber,
  getFocusedRow,
  getFocusedCol,
} from '../../selectors';
import { isAcross, otherDirection } from '../../utilities';

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

export interface BoardPropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
  onSetFocus: () => any;
}

export interface BoardProps extends BoardPropsFromParent {
  cluesByDirection: CluesByDirection;
  gridData: GridSpec;
  guesses: GuessesGrid;
  size: number;
  focused: boolean;
  currentDirection: string;
  currentNumber: string;
  focusedRow: number;
  focusedCol: number;
  onSetCurrentDirection: (direction: string) => any;
  onSetCurrentNumber: (currentNumber: string) => any;
  onSetFocusedRow: (row: number) => any;
  onSetFocusedCol: (col: number) => any;
  onSetInputElement: (inputElement: HTMLInputElement) => any;
  onMoveTo: (row: number, col: number, directionOverride: string) => any;
  onUpdateFocusedClues: (row: number, col: number) => any;
}

const Board = (props: BoardProps) => {

  React.useEffect(() => {
    props.onUpdateFocusedClues(0, 0);
    props.onSetFocusedRow(0);
    props.onSetFocusedCol(0);
    props.onSetCurrentDirection('across');
    props.onSetCurrentNumber('1');
  }, [props.size, props.gridData]);

  const inputRef = useRef();

  const contextTheme = useContext(ThemeContext);

  const finalTheme = { ...defaultTheme, ...(contextTheme as any) };

  const getCellData = (row, col): GridSquareSpec | FakeCellData => {
    if (row >= 0 && row < props.size && col >= 0 && col < props.size) {
      return props.gridData[row][col];
    }

    // fake cellData to represent "out of bounds"
    return { row, col, used: false };
  };

  const handleCellClick = (cellCoordinates: CrosswordCellCoordinate) => {

    const { row, col } = cellCoordinates;
    const other = otherDirection(props.currentDirection);

    props.onSetFocusedRow(row);
    props.onSetFocusedCol(col);

    let direction = props.currentDirection;

    const cellData: GridSquareSpec | FakeCellData = getCellData(row, col);

    if (!cellData.used) {
      return false;
    }

    // We switch to the "other" direction if (a) the current direction isn't
    // available in the clicked cell, or (b) we're already focused and the
    // clicked cell is the focused cell, *and* the other direction is
    // available.
    if (
      !cellData[props.currentDirection] ||
      (props.focused &&
        row === props.focusedRow &&
        col === props.focusedCol &&
        cellData[other])
    ) {
      props.onSetCurrentDirection(other);
      direction = other;
    }

    props.onSetCurrentNumber(cellData[direction]);

    props.onUpdateFocusedClues(row, col);

    props.onSetFocus();
  };

  // focus and movement
  const moveRelative = (dRow: number, dCol: number) => {
    // We expect *only* one of dRow or dCol to have a non-zero value, and
    // that's the direction we will "prefer".  If *both* are set (or zero),
    // we don't change the direction.
    let direction;
    if (dRow !== 0 && dCol === 0) {
      direction = 'down';
    } else if (dRow === 0 && dCol !== 0) {
      direction = 'across';
    }

    const cell = props.onMoveTo(props.focusedRow + dRow, props.focusedCol + dCol, direction);

    return cell;
  };

  const moveForward = () => {
    const across = isAcross(props.currentDirection);
    moveRelative(across ? 0 : 1, across ? 1 : 0);
  };

  const moveBackward = () => {
    const across = isAcross(props.currentDirection);
    moveRelative(across ? 0 : -1, across ? -1 : 0);
  };

  // We use the keydown event for control/arrow keys, but not for textual
  // input, because it's hard to suss out when a key is "regular" or not.
  const handleInputKeyDown = (event) => {

    // if ctrl, alt, or meta are down, ignore the event (let it bubble)
    if (event.ctrlKey || event.altKey || event.metaKey) {
      return;
    }

    let preventDefault = true;
    const { key } = event;

    // FUTURE: should we "jump" over black space?  That might help some for
    // keyboard users.
    switch (key) {
      case 'ArrowUp':
        moveRelative(-1, 0);
        break;

      case 'ArrowDown':
        moveRelative(1, 0);
        break;

      case 'ArrowLeft':
        moveRelative(0, -1);
        break;

      case 'ArrowRight':
        moveRelative(0, 1);
        break;

      case ' ': // treat space like tab?
      case 'Tab': {
        const other = otherDirection(props.currentDirection);
        const cellData: GridSquareSpec | FakeCellData = getCellData(props.focusedRow, props.focusedCol);
        if (cellData[other]) {
          props.onSetCurrentDirection(other);
          props.onSetCurrentNumber(cellData[other]);
        }
        break;
      }

      // Backspace: delete the current cell, and move to the previous cell
      // Delete:    delete the current cell, but don't move
      case 'Backspace':
      case 'Delete': {
        props.onInput(props.focusedRow, props.focusedCol, '');
        if (key === 'Backspace') {
          moveBackward();
        }
        break;
      }

      case 'Home':
      case 'End': {

        // move to beginning/end of this entry?
        const info = props.cluesByDirection[props.currentDirection][props.currentNumber];
        const {
          answer: { length },
        } = info;
        let { row, col } = info;
        if (key === 'End') {
          const across = isAcross(props.currentDirection);
          if (across) {
            col += length - 1;
          } else {
            row += length - 1;
          }
        }

        props.onMoveTo(row, col, null);
        break;
      }

      default:
        // It would be nice to handle "regular" characters with onInput, but
        // that is still experimental, so we can't count on it.  Instead, we
        // assume that only "length 1" values are regular.
        if (key.length !== 1) {
          preventDefault = false;
          break;
        }

        props.onInput(props.focusedRow, props.focusedCol, key.toUpperCase());
        moveForward();

        break;
    }

    if (preventDefault) {
      event.preventDefault();
    }
  };

  const handleInputChange = () => {
    console.log('handleChange invoked');
  };

  const handleInputClick = () => {

    // *don't* event.preventDefault(), because we want the input to actually
    // take focus

    // Like general cell-clicks, cliking on the input can change direction.
    // Unlike cell clicks, we *know* we're clicking on the already-focused
    // cell!

    const other = otherDirection(props.currentDirection);
    const cellData: GridSquareSpec | FakeCellData = getCellData(props.focusedRow, props.focusedCol);

    let direction = props.currentDirection;

    if (props.focused && cellData[other]) {
      props.onSetCurrentDirection(other);
      direction = other;
    }

    props.onSetCurrentNumber(cellData[direction]);
    props.onSetFocus();
  };


  const cellSize = 100 / props.size;
  const cellPadding = 0.125;
  const cellInner = cellSize - cellPadding * 2;
  const fontSize = cellInner * 0.7;

  const cells = [];
  if (props.gridData) {

    props.gridData.forEach((rowData, row) => {

      rowData.forEach((gridSquareSpec: GridSquareSpec, col: number) => {

        let guess: Guess;
        if (!isNil(props.guesses) && props.guesses.length > 0 && row < rowData.length) {
          guess = props.guesses[row][col];
        } else {
          guess = {
            value: '',
            guessIsRemote: false,
            remoteUser: null
          };
        }

        const gridSquare: GridSquare = {
          used: gridSquareSpec.used,
          number: gridSquareSpec.number,
          row: gridSquareSpec.row,
          col: gridSquareSpec.col,
          across: gridSquareSpec.across,
          down: gridSquareSpec.down,
          guess: guess,
        };

        if (!gridSquare.used) {
          return;
        }
        cells.push(
          <Cell
            // eslint-disable-next-line react/no-array-index-key
            key={`R${row}C${col}`}
            row={gridSquare.row}
            col={gridSquare.col}
            guess={gridSquare.guess}
            number={gridSquare.number}
            focus={props.focused && row === props.focusedRow && col === props.focusedCol}
            highlight={
              props.focused &&
              props.currentNumber &&
              gridSquare[props.currentDirection] === props.currentNumber
            }
            onClick={handleCellClick}
          />
        );
      });
    });
  }

  // minHeight: '100%', 
  // <svg viewBox="0 0 100 100" style={{ height: '100%', maxHeight: '100%'}}>
  //       <Grid item xs={6} lg={4} style={{ maxHeight: '100%' }}>

  // height='782px'
  // <svg viewBox="0 0 100 100" style={{ height: '782px' }}>

  //           <svg viewBox="0 0 100 100" style={{ width: '83%' }}>

  /* this works
          <div style={{ margin: 0, padding: 0, position: 'relative', height: '772px' }}>
          <svg viewBox="0 0 100 100" width='auto' height='100%' style={{ maxWidth: '100%' }}>
  */

  /* this also works
        <div style={{ margin: 0, padding: 0, position: 'relative', height: '100%' }}>
          <svg viewBox="0 0 100 100" width='auto' height='100%' style={{ maxWidth: '100%' }}>
  */

  /*
      <Grid item xs={8} sm={7} md={6} lg={6} xl={4} style={{ maxHeight: '100%' }}>
  */
  return (
    <Grid item xs={8} sm={7} md={6} lg={5} xl={4} style={{ maxHeight: '100%' }}>
      <div style={{ maxHeight: '100%', margin: 0, padding: 0, position: 'relative' }}>
        <svg viewBox="0 0 100 100">
          <rect
            x={0}
            y={0}
            width={100}
            height={100}
            fill={finalTheme.gridBackground}
          />
          {cells}
        </svg>
        <input
          className='board-input'
          ref={(e: HTMLInputElement) => {
            // console.log('assign inputRef.current: ', e);
            (inputRef.current as HTMLInputElement) = e; // you can still assign to ref
            props.onSetInputElement(e);
          }}
          aria-label="crossword-input"
          type="text"
          onChange={handleInputChange}
          onClick={handleInputClick}
          onKeyDown={handleInputKeyDown}
          value=""
          autoComplete="off"
          spellCheck="false"
          autoCorrect="off"
          style={{
            position: 'absolute',
            // In order to ensure the top/left positioning makes sense,
            // there is an absolutely-positioned <div> with no
            // margin/padding that we *don't* expose to consumers.  This
            // keeps the math much more reliable.  (But we're still
            // seeing a slight vertical deviation towards the bottom of
            // the grid!  The "* 0.995" seems to help.)
            top: `calc(${props.focusedRow * cellSize * 0.995}% + 2px)`,
            left: `calc(${props.focusedCol * cellSize}% + 2px)`,
            width: `calc(${cellSize}% - 4px)`,
            height: `calc(${cellSize}% - 4px)`,
            fontSize: `${fontSize * 6}px`, // waaay too small...?
            textAlign: 'center',
            textAnchor: 'middle',
            backgroundColor: 'transparent',
            caretColor: 'transparent',
            margin: 0,
            padding: 0,
            border: 0,
            cursor: 'default',
          }}
        />
      </div>
    </Grid>
  );
};

function mapStateToProps(state: any) {
  return {
    cluesByDirection: getCrosswordClues(state),
    guesses: getGuesses(state),
    gridData: getGridData(state),
    size: getSize(state),
    focused: getFocused(state),
    currentDirection: getCurrentDirection(state),
    currentNumber: getCurrentNumber(state),
    focusedRow: getFocusedRow(state),
    focusedCol: getFocusedCol(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetCurrentDirection: setCurrentDirection,
    onSetCurrentNumber: setCurrentNumber,
    onSetFocusedRow: setFocusedRow,
    onSetFocusedCol: setFocusedCol,
    onSetInputElement: setInputElement,
    onMoveTo: moveTo,
    onUpdateFocusedClues: updateFocusedClues,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);

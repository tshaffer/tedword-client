import * as React from 'react';
import { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { Guess, CluesByDirection, GuessesGrid, GridSquare, GridSquareSpec, GridSpec, CrosswordCellCoordinate, FakeCellData } from '../../types';

import { ThemeContext, ThemeProvider } from 'styled-components';

import Cell from './Cell';
import DirectionClues from './DirectionClues';

import { getCrosswordClues, getGuesses } from '../../selectors';
import { bothDirections, isAcross, otherDirection } from '../../utilities';
import { isNil } from 'lodash';

import { CrosswordContext, CrosswordSizeContext } from './context';
import { getSize, getGridData } from '../../selectors';

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
  cluesByDirection: CluesByDirection;
  size: number;
  gridData: GridSpec;
  guesses: GuessesGrid;
}

const Crossword = (props: CrosswordProps) => {

  const [focused, setFocused] = useState(false);
  const [focusedRow, setFocusedRow] = useState(0);
  const [focusedCol, setFocusedCol] = useState(0);
  const [currentDirection, setCurrentDirection] = useState('across');
  const [currentNumber, setCurrentNumber] = useState('1');

  React.useEffect(() => {
    if (props.onFocusedCellChange) {
      props.onFocusedCellChange(0, 0, 'across');
    }
    setFocusedRow(0);
    setFocusedCol(0);
    setCurrentDirection('across');
    setCurrentNumber('1');

  }, [props.size, props.gridData]);

  const inputRef = React.useRef();

  const contextTheme = React.useContext(ThemeContext);

  const getCellData = (row, col): GridSquareSpec | FakeCellData => {
    if (row >= 0 && row < props.size && col >= 0 && col < props.size) {
      return props.gridData[row][col];
    }

    // fake cellData to represent "out of bounds"
    return { row, col, used: false };
  };

  const handleCellClick = (cellCoordinates: CrosswordCellCoordinate) => {

    const { row, col } = cellCoordinates;
    const other = otherDirection(currentDirection);

    // should this use moveTo?
    setFocusedRow(row);
    setFocusedCol(col);

    let direction = currentDirection;

    const cellData: GridSquareSpec | FakeCellData = getCellData(row, col);

    if (!cellData.used) {
      return false;
    }

    // We switch to the "other" direction if (a) the current direction isn't
    // available in the clicked cell, or (b) we're already focused and the
    // clicked cell is the focused cell, *and* the other direction is
    // available.
    if (
      !cellData[currentDirection] ||
      (focused &&
        row === focusedRow &&
        col === focusedCol &&
        cellData[other])  // **** How does cellData[other] evaluate to true when it's undefined????
    ) {
      setCurrentDirection(other);
      direction = other;
    }

    setCurrentNumber(cellData[direction]);

    if (props.onFocusedCellChange) {
      props.onFocusedCellChange(row, col, direction);
    }

    focus();
  };

  // focus and movement
  const focus = () => {
    if (!isNil(inputRef) && !isNil(inputRef.current)) {
      (inputRef as any).current.focus();
      setFocused(true);
    }
    setFocused(true);
  };

  const moveTo = (row, col, directionOverride) => {

    // let direction = directionOverride ?? currentDirection;
    let direction: string;
    if (isNil(directionOverride)) {
      direction = currentDirection;
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

    if (props.onFocusedCellChange) {
      props.onFocusedCellChange(row, col, direction);
    }
    setFocusedRow(row);
    setFocusedCol(col);
    setCurrentDirection(direction);
    setCurrentNumber(candidate[direction]);

    return candidate;
  };

  const moveRelative = (dRow, dCol) => {
    // We expect *only* one of dRow or dCol to have a non-zero value, and
    // that's the direction we will "prefer".  If *both* are set (or zero),
    // we don't change the direction.
    let direction;
    if (dRow !== 0 && dCol === 0) {
      direction = 'down';
    } else if (dRow === 0 && dCol !== 0) {
      direction = 'across';
    }

    const cell = moveTo(focusedRow + dRow, focusedCol + dCol, direction);

    return cell;
  };

  const moveForward = () => {
    const across = isAcross(currentDirection);
    moveRelative(across ? 0 : 1, across ? 1 : 0);
  };

  const moveBackward = () => {
    const across = isAcross(currentDirection);
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
        const other = otherDirection(currentDirection);
        const cellData: GridSquareSpec | FakeCellData = getCellData(focusedRow, focusedCol);
        if (cellData[other]) {
          setCurrentDirection(other);
          setCurrentNumber(cellData[other]);
        }
        break;
      }

      // Backspace: delete the current cell, and move to the previous cell
      // Delete:    delete the current cell, but don't move
      case 'Backspace':
      case 'Delete': {
        props.onInput(focusedRow, focusedCol, '');
        if (key === 'Backspace') {
          moveBackward();
        }
        break;
      }

      case 'Home':
      case 'End': {

        // move to beginning/end of this entry?
        const info = props.cluesByDirection[currentDirection][currentNumber];
        const {
          answer: { length },
        } = info;
        let { row, col } = info;
        if (key === 'End') {
          const across = isAcross(currentDirection);
          if (across) {
            col += length - 1;
          } else {
            row += length - 1;
          }
        }

        moveTo(row, col, null);
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

        props.onInput(focusedRow, focusedCol, key.toUpperCase());
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

    const other = otherDirection(currentDirection);
    const cellData: GridSquareSpec | FakeCellData = getCellData(focusedRow, focusedCol);

    let direction = currentDirection;

    if (focused && cellData[other]) {
      setCurrentDirection(other);
      direction = other;
    }

    setCurrentNumber(cellData[direction]);
    focus();
  };

  const handleClueSelected = (direction, number) => {
    const info = props.cluesByDirection[direction][number];
    // TODO: sanity-check info?
    moveTo(info.row, info.col, direction);
    focus();
  };

  if (props.size === 0) {
    return null;
  }

  const cellSize = 100 / props.size;
  const cellPadding = 0.125;
  const cellInner = cellSize - cellPadding * 2;
  const cellHalf = cellSize / 2;
  const fontSize = cellInner * 0.7;

  const context = {
    focused,
    selectedDirection: currentDirection,
    selectedNumber: currentNumber,
  };
  const finalTheme = { ...defaultTheme, ...(contextTheme as any) };

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
            focus={focused && row === focusedRow && col === focusedCol}
            highlight={
              focused &&
              currentNumber &&
              gridSquare[currentDirection] === currentNumber
            }
            onClick={handleCellClick}
          />
        );
      });
    });
  }
  /*
    return (
      <CrosswordContext.Provider value={context}>
        <CrosswordSizeContext.Provider
          value={{ cellSize, cellPadding, cellInner, cellHalf, fontSize }}
        >
          <ThemeProvider theme={finalTheme}>
            <div style={{ margin: 0, padding: 0, border: 0, display: 'flex', flexDirection: 'row' }}>
              <div style={{ minWidth: '20rem', maxWidth: '60rem', width: 'auto', flex: '2 1 50%' }}>
                <div style={{ margin: 0, padding: 0, position: 'relative' }}>
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
                    ref={inputRef}
                    aria-label="crossword-input"
                    type="text"
                    onChange={handleInputChange}
                    onClick={handleInputClick}
                    onKeyDown={handleInputKeyDown}
                    value=""
                    // onInput={this.handleInput}
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
                      top: `calc(${focusedRow * cellSize * 0.995}% + 2px)`,
                      left: `calc(${focusedCol * cellSize}% + 2px)`,
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
              </div >
              <div style={{ height: '750px', overflowY: 'auto', padding: '0 1em', flex: '1 2 25%' }}>
                {bothDirections.map((direction) => (
                  <DirectionClues
                    key={direction}
                    direction={direction}
                    cluesByNumber={props.cluesByDirection[direction]}
                    onClueSelected={handleClueSelected}
                  />
                ))}
  
              </div>
            </div>
          </ThemeProvider>
        </CrosswordSizeContext.Provider>
      </CrosswordContext.Provider>
    );
  */

  // const useStyles = makeStyles((theme) => ({
  //   gridStyle: {
  //     height: '200px',
  //   },
  //   paper: {
  //     padding: theme.spacing(1),
  //     textAlign: 'center',
  //     color: theme.palette.text.secondary
  //   }
  // }));

  // const classes = useStyles();

  //               <Paper style={{ padding: '1px', textAlign: 'center', color: 'brown' }}>Board</Paper>
  // style={{ minWidth: '20rem', maxWidth: '60rem', width: 'auto', flex: '2 1 50%' }}
  //           <Grid container spacing={1} justify="center" style={{ minHeight: '90%', maxWidth: '100%', background: 'pink' }}>

  const getCrosswordComponent = () => {
    return (
      <Grid item xs={8} style={{ minHeight: '100%' }}>
        <div style={{ margin: 0, padding: 0, position: 'relative' }}>
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
            ref={inputRef}
            aria-label="crossword-input"
            type="text"
            onChange={handleInputChange}
            onClick={handleInputClick}
            onKeyDown={handleInputKeyDown}
            value=""
            // onInput={this.handleInput}
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
              top: `calc(${focusedRow * cellSize * 0.995}% + 2px)`,
              left: `calc(${focusedCol * cellSize}% + 2px)`,
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

  const crosswordComponent = getCrosswordComponent();

  return (
    <CrosswordContext.Provider value={context}>
      <CrosswordSizeContext.Provider
        value={{ cellSize, cellPadding, cellInner, cellHalf, fontSize }}
      >
        <ThemeProvider theme={finalTheme}>
          <Grid container spacing={1} justify="center" style={{ maxWidth: '100%', background: 'pink' }}>
            {crosswordComponent}
            <Grid item xs={4} container style={{ minHeight: '100%' }}>
              <Grid item container spacing={1} xs={12} style={{ height: '90%', maxWidth: '100%', background: 'cyan' }}>
                <Grid item xs={12} md={6} style={{ background: 'orange' }}>
                  <Paper style={{ padding: '1px', textAlign: 'center', color: 'brown' }}>Across Clues</Paper>
                </Grid>
                <Grid item xs={12} md={6} style={{ background: 'gray' }}>
                  <Paper style={{ padding: '1px', textAlign: 'center', color: 'brown' }}>Down Clues</Paper>
                </Grid>
              </Grid>
              <Grid item xs={12} style={{ height: '10%', background: 'lightGreen' }}>
                <Paper style={{ padding: '1px', textAlign: 'center', color: 'brown' }}>Chat</Paper>
              </Grid>
            </Grid>
          </Grid>
        </ThemeProvider>
      </CrosswordSizeContext.Provider>
    </CrosswordContext.Provider>
  );

};

function mapStateToProps(state: any) {
  return {
    cluesByDirection: getCrosswordClues(state),
    guesses: getGuesses(state),
    size: getSize(state),
    gridData: getGridData(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Crossword);

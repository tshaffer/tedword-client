import * as React from 'react';
import { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Grid from '@material-ui/core/Grid';

import Chat from '../Chat/Chat';

import { CluesByDirection, GridSquareSpec, GridSpec, CrosswordCellCoordinate, FakeCellData } from '../../types';

import { ThemeContext, ThemeProvider } from 'styled-components';

import Board from './Board';
import DirectionClues from './DirectionClues';

import { getCrosswordClues } from '../../selectors';
import { otherDirection } from '../../utilities';

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
}

const Crossword = (props: CrosswordProps) => {

  const cluesContainerGridRef = React.useRef(null);

  const [focused, setFocused] = useState(false);
  const [currentDirection, setCurrentDirection] = useState('across');
  const [currentNumber, setCurrentNumber] = useState('1');
  const [cluesSideBySide, setCluesSideBySide] = useState(true);

  React.useEffect(() => {
    if (props.onFocusedCellChange) {
      props.onFocusedCellChange(0, 0, 'across');
    }
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
    setCurrentDirection(direction);
    setCurrentNumber(candidate[direction]);

    return candidate;
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

  const setCluesLayout = () => {
    if (!isNil(cluesContainerGridRef) && !isNil(cluesContainerGridRef.current)) {
      if (cluesContainerGridRef.current.childElementCount === 2) {

        const acrossGridItem = cluesContainerGridRef.current.children[0];
        const downGridItem = cluesContainerGridRef.current.children[1];

        const cluesContainerGridHeight = cluesContainerGridRef.current.offsetHeight;
        const acrossGridItemHeight = acrossGridItem.offsetHeight;
        const downGridItemHeight = downGridItem.offsetHeight;

        // if the height of container is the same as the height of the across and down grids, then it's a side by side layout
        // if the height of the container is larger than the height of the across and down grids, then it's a top / bottom layout
        if ((cluesContainerGridHeight > acrossGridItemHeight) && (cluesContainerGridHeight > downGridItemHeight)) {
          // top / bottom layout
          if (cluesSideBySide) {
            setCluesSideBySide(false);
          }
        } else {
          // side by side layout
          if (!cluesSideBySide) {
            setCluesSideBySide(true);
          }
        }
        // const acrossRect: DOMRect = acrossGridItem.getBoundingClientRect();
        // const downRect: DOMRect = downGridItem.getBoundingClientRect();
        // let newCluesSideBySide = cluesSideBySide;
        // if (acrossRect.top !== downRect.top && cluesSideBySide) {
        //   setCluesSideBySide(false);
        //   newCluesSideBySide = false;
        //   console.log('invoke setCluesSideBySide(false)');
        // } else if (acrossRect.left !== downRect.left && !cluesSideBySide) {
        //   setCluesSideBySide(true);
        //   newCluesSideBySide = true;
        //   console.log('invoke setCluesSideBySide(true)');
        // }
        // if (newCluesSideBySide !== cluesSideBySide) {
        //   console.log('newCluesSideBySide: ', newCluesSideBySide);
        // }
      }
    }
  };

  const renderCluesComponent = (direction: string) => {
    const maxHeight = cluesSideBySide ? '100%' : '50%';
    return (
      <Grid item xs={12} md={6} style={{ maxHeight }}>
        <DirectionClues
          key={direction}
          direction={direction}
          cluesByNumber={props.cluesByDirection[direction]}
          onClueSelected={handleClueSelected}
        />
      </Grid>
    );
  };

  const renderBoardComponent = () => {
    return (
      <Board
        onInput={props.onInput}
        onFocusedCellChange={props.onFocusedCellChange}
      />
    );
  };

  const boardComponent = renderBoardComponent();
  const acrossCluesComponent = renderCluesComponent('across');
  const downCluesComponent = renderCluesComponent('down');

  setCluesLayout();

  // <Grid item xs={6} lg={8} container style={{ minHeight: '100%', maxHeight: '100%' }}>
  /*
            <Grid item xs={4} sm={5} md={6} lg={6} xl={8} container style={{ minHeight: '100%', maxHeight: '100%' }}>
  */
  return (
    <CrosswordContext.Provider value={context}>
      <CrosswordSizeContext.Provider
        value={{ cellSize, cellPadding, cellInner, cellHalf, fontSize }}
      >
        <ThemeProvider theme={finalTheme}>
          <Grid container spacing={1} justify="center" style={{ maxWidth: '100%', height: '100%' }}>
            {boardComponent}
            <Grid item xs={4} sm={5} md={6} lg={7} xl={8} container style={{ minHeight: '100%', maxHeight: '100%' }}>
              <Grid item container spacing={1} xs={12} style={{ height: '90%', maxWidth: '100%' }} ref={cluesContainerGridRef}>
                {acrossCluesComponent}
                {downCluesComponent}
              </Grid>
              <Grid item xs={12} style={{ height: '10%' }}>
                <Chat />
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
    size: getSize(state),
    gridData: getGridData(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Crossword);

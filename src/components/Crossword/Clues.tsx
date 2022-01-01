import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Grid from '@material-ui/core/Grid';

import { CluesByDirection, GridSquareSpec, GridSpec, FakeCellData } from '../../types';

import {
  setFocused,
  setCurrentDirection,
  setCurrentNumber,
  setFocusedRow,
  setFocusedCol,
} from '../../models';

import {
  getCrosswordClues,
  getSize,
  getGridData,
  getFocused,
  getCurrentDirection,
  getCurrentNumber,
  getInputElement,
} from '../../selectors';

import DirectionClues from './DirectionClues';

import { otherDirection } from '../../utilities';

export interface CluesPropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
  onFocusedCellChange: (row: any, col: any, direction: any) => any;
}

export interface CluesProps extends CluesPropsFromParent {
  inputElement: HTMLInputElement;
  cluesByDirection: CluesByDirection;
  size: number;
  gridData: GridSpec;
  focused: boolean;
  currentDirection: string;
  currentNumber: string;
  onSetFocused: (focused: boolean) => any;
  onSetCurrentDirection: (direction: string) => any;
  onSetCurrentNumber: (currentNumber: string) => any;
  onSetFocusedRow: (row: number) => any;
  onSetFocusedCol: (col: number) => any;
}

const Clues = (props: CluesProps) => {

  const cluesContainerGridRef = React.useRef(null);

  const [cluesSideBySide, setCluesSideBySide] = React.useState(true);

  const setCluesLayout = () => {
    if (!isNil(cluesContainerGridRef) && !isNil(cluesContainerGridRef.current)) {
      if (cluesContainerGridRef.current.childElementCount === 2) {

        const acrossGridItem = cluesContainerGridRef.current.children[0];
        const downGridItem = cluesContainerGridRef.current.children[1];

        // const cluesContainerGridHeight = cluesContainerGridRef.current.offsetHeight;
        // const acrossGridItemHeight = acrossGridItem.offsetHeight;
        // const downGridItemHeight = downGridItem.offsetHeight;

        // if the height of container is the same as the height of the across and down grids, then it's a side by side layout
        // if the height of the container is larger than the height of the across and down grids, then it's a top / bottom layout
        // if ((cluesContainerGridHeight > acrossGridItemHeight) && (cluesContainerGridHeight > downGridItemHeight)) {
        //   // top / bottom layout
        //   if (cluesSideBySide) {
        //     setCluesSideBySide(false);
        //   }
        // } else {
        //   // side by side layout
        //   if (!cluesSideBySide) {
        //     setCluesSideBySide(true);
        //   }
        // }
        const acrossRect: DOMRect = acrossGridItem.getBoundingClientRect();
        const downRect: DOMRect = downGridItem.getBoundingClientRect();
        let newCluesSideBySide = cluesSideBySide;
        if (acrossRect.top !== downRect.top && cluesSideBySide) {
          setCluesSideBySide(false);
          newCluesSideBySide = false;
          console.log('invoke setCluesSideBySide(false)');
        } else if (acrossRect.left !== downRect.left && !cluesSideBySide) {
          setCluesSideBySide(true);
          newCluesSideBySide = true;
          console.log('invoke setCluesSideBySide(true)');
        }
        if (newCluesSideBySide !== cluesSideBySide) {
          console.log('newCluesSideBySide: ', newCluesSideBySide);
        }
      }
    }
  };

  const getCellData = (row, col): GridSquareSpec | FakeCellData => {
    if (row >= 0 && row < props.size && col >= 0 && col < props.size) {
      return props.gridData[row][col];
    }

    // fake cellData to represent "out of bounds"
    return { row, col, used: false };
  };


  // focus and movement
  const focus = () => {
    if (!isNil(props.inputElement)) {
      props.inputElement.focus();
      props.onSetFocused(true);
    }
    props.onSetFocused(true);
  };

  const moveTo = (row, col, directionOverride) => {

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

    if (props.onFocusedCellChange) {
      props.onFocusedCellChange(row, col, direction);
    }
    props.onSetFocusedRow(row);
    props.onSetFocusedCol(col);
    props.onSetCurrentDirection(direction);
    props.onSetCurrentNumber(candidate[direction]);

    return candidate;
  };

  const handleClueSelected = (direction, number) => {
    const info = props.cluesByDirection[direction][number];
    // TODO: sanity-check info?
    moveTo(info.row, info.col, direction);
    focus();
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

  setCluesLayout();
  const acrossCluesComponent = renderCluesComponent('across');
  const downCluesComponent = renderCluesComponent('down');

  return (
    <Grid item container spacing={1} xs={12} style={{ height: '90%', maxWidth: '100%' }} ref={cluesContainerGridRef}>
      {acrossCluesComponent}
      {downCluesComponent}
    </Grid>
  );
};

function mapStateToProps(state: any) {
  return {
    inputElement: getInputElement(state),
    cluesByDirection: getCrosswordClues(state),
    size: getSize(state),
    gridData: getGridData(state),
    focused: getFocused(state),
    currentDirection: getCurrentDirection(state),
    currentNumber: getCurrentNumber(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetFocused: setFocused,
    onSetCurrentDirection: setCurrentDirection,
    onSetCurrentNumber: setCurrentNumber,
    onSetFocusedRow: setFocusedRow,
    onSetFocusedCol: setFocusedCol,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clues);

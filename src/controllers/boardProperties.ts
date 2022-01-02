import { isNil } from 'lodash';

import {
  FakeCellData,
  GridSpec,
  GridSquareSpec,
  TedwordState
} from '../types';

import {
  setFocusedRow,
  setFocusedCol,
  setCurrentDirection,
  setCurrentNumber
} from '../models';

import { getCurrentDirection, getGridData, getSize } from '../selectors';
import { otherDirection } from '../utilities';
import { updateFocusedClues } from './board';

export const moveTo = (row: number, col: number, directionOverride: string) => {
  return ((dispatch: any, getState: any): any => {
    const state: TedwordState = getState();
    let direction: string;
    if (isNil(directionOverride)) {
      direction = getCurrentDirection(state);
    } else {
      direction = directionOverride;
    }

    const candidate: GridSquareSpec | FakeCellData = getCellData(state, row, col);

    if (!candidate.used) {
      return false;
    }

    if (!candidate[direction]) {
      direction = otherDirection(direction);
    }

    dispatch(updateFocusedClues(row, col));
    dispatch(setFocusedRow(row));
    dispatch(setFocusedCol(col));
    dispatch(setCurrentDirection(direction));
    dispatch(setCurrentNumber(candidate[direction]));
  });
};

const getCellData = (state: TedwordState, row: number, col: number): GridSquareSpec | FakeCellData => {
  const size: number = getSize(state);
  if (row >= 0 && row < size && col >= 0 && col < size) {
    const gridSpec: GridSpec = getGridData(state);
    return gridSpec[row][col];
  }

  // fake cellData to represent "out of bounds"
  return { row, col, used: false };
};


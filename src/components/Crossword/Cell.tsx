import * as React from 'react';

import { ThemeContext } from 'styled-components';
import { CrosswordSizeContext } from './context';

import { CrosswordCellCoordinate, Guess } from '../../types';

export interface CellProps {
  row: number,
  col: number,
  guess: Guess,
  number: string,
  focus: boolean,
  highlight: boolean,
  onClick: (cellData: CrosswordCellCoordinate) => any;
}

const Cell = (props: CellProps) => {

  const { cellSize, cellPadding, cellInner, cellHalf, fontSize } = React.useContext(
    CrosswordSizeContext
  );
  const {
    cellBackground,
    cellBorder,
    textColor,
    remoteGuessTextColor,
    numberColor,
    focusBackground,
    highlightBackground,
  } = React.useContext(ThemeContext);

  const { row, col, guess, number, highlight } = props;

  const x = col * cellSize;
  const y = row * cellSize;

  let cellTextColor;
  if (guess.guessIsRemote) {
    cellTextColor = remoteGuessTextColor;
  } else {
    cellTextColor = textColor;
  }

  const fillStyle = {
    fill: cellTextColor
  };
  const cellStyle = fillStyle;

  // WHY IS THIS NOT INVOKED IF IT ALREADY HAS FOCUS??
  const handleClick = (event) => {
    event.preventDefault();
    props.onClick({ row, col });
  };

  // console.log('Cell.tsx - re-render');

  return (
    <g
      style={{ cursor: 'default', fontSize: `${fontSize}px` }}
      onClick={handleClick}
    >
      <rect
        x={x + cellPadding}
        y={y + cellPadding}
        width={cellInner}
        height={cellInner}
        fill={
          props.focus
            ? focusBackground
            : highlight
              ? highlightBackground
              : cellBackground
        }
        stroke={cellBorder}
        strokeWidth={cellSize / 50}
      />
      {number && (
        <text
          x={x + cellPadding * 4}
          y={y + cellPadding * 4}
          textAnchor="start"
          dominantBaseline="hanging"
          style={{ fontSize: '50%', fill: numberColor }}
        >
          {number}
        </text>
      )}
      <text
        x={x + cellHalf}
        y={y + cellHalf + 1} // +1 for visual alignment?
        textAnchor="middle"
        dominantBaseline="middle"
        style={cellStyle}
      >
        {guess.value}
      </text>
    </g>
  );
};

export default Cell;


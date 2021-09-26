/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ThemeContext } from 'styled-components';
import { CrosswordSizeContext } from './context';

import { Guess } from '../../types';

export interface CellPropsFromParent {
  onClick: (cellData: any) => any;
}

export interface CellProps extends CellPropsFromParent {
  row: number,
  col: number,
  guess: Guess,
  number: string,
  focus: boolean,
  highlight: boolean,
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

  const handleClick = (event) => {
    event.preventDefault();
    props.onClick({ row, col });
  };

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

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Cell);


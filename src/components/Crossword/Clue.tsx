import * as React from 'react';

import { ThemeContext } from 'styled-components';
import { CrosswordContext } from './context';
import { isNil } from 'lodash';

export interface ClueProps {
  direction: string,
  number: string;
  clueText: string;
  completelyFilledIn: boolean;
}

const Clue = (props: ClueProps) => {

  const { highlightBackground } = React.useContext(ThemeContext);
  const {
    focused,
    selectedDirection,
    selectedNumber,
    onClueSelected,
  } = React.useContext(CrosswordContext);

  const handleClick = (event) => {
    event.preventDefault();
    if (!isNil(onClueSelected)) {
      onClueSelected(props.direction, props.number);
    }
  };

  const isFocused = focused && props.direction === selectedDirection && props.number === selectedNumber;
  const backgroundColor = isFocused ? highlightBackground : 'transparent';

  const innerStyle: any = {
    cursor: 'default',
    backgroundColor,
    marginTop: '0.5em'
  };
  let textDecorationStyle;
  if (props.completelyFilledIn) {
    textDecorationStyle = {
      textDecoration: 'line-through'
    };
  } else {
    textDecorationStyle = {
      textDecoration: 'none'
    };
  }

  return (
    <div
      style={innerStyle}
      onClick={handleClick}
    >
      {props.number}: <span style={textDecorationStyle}>{props.clueText}</span>
    </div>
  );
};

export default Clue;


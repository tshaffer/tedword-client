import * as React from 'react';

import { ThemeContext } from 'styled-components';
import { CrosswordContext } from './context';
import { isNil } from 'lodash';

export interface ClueProps {
  direction: string,
  number: string;
  clueText: string;
  completelyFilledIn: boolean;
  onClueSelected: (direction: string, number: string) => any;
}

const Clue = (props: ClueProps) => {

  const clueRef = React.useRef(null);

  const { highlightBackground } = React.useContext(ThemeContext);
  const {
    focused,
    selectedDirection,
    selectedNumber,
  } = React.useContext(CrosswordContext);

  React.useEffect(() => {
    const becameFocused = focused && props.direction === selectedDirection && props.number === selectedNumber;
    if (becameFocused && !isNil(clueRef) && !isNil(clueRef.current)) {
      clueRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused, selectedDirection, selectedNumber]);

  const handleClick = (event) => {
    event.preventDefault();
    if (!isNil(props.onClueSelected)) {
      props.onClueSelected(props.direction, props.number);
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
      ref={clueRef}
      style={innerStyle}
      onClick={handleClick}
    >
      {props.number}: <span style={textDecorationStyle}>{props.clueText}</span>
    </div>
  );
};

export default Clue;


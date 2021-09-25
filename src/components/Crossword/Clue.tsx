import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import styled, { ThemeContext } from 'styled-components';
import { CrosswordContext } from './context';
import { isNil } from 'lodash';
/*
const ClueWrapper = styled.div.attrs((props) => ({
  className: `clue${props.correct ? ' correct' : ''}`,
}))`
  cursor: default;
  background-color: ${(props) =>
    props.highlight ? props.highlightBackground : 'transparent'};
`;
*/

export interface ClueProps {
  direction: string,
  number: string;
  // correct: boolean;
  clueText: string;
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
    console.log('Clue component - handleClick');
    console.log(event);
    event.preventDefault();
    if (!isNil(onClueSelected)) {
      onClueSelected(props.direction, props.number);
    }

  };

  /*
const ClueWrapper = styled.div.attrs((props) => ({
  className: `clue${props.correct ? ' correct' : ''}`,
}))`
  cursor: default;
  background-color: ${(props) =>
    props.highlight ? props.highlightBackground : 'transparent'};
`;
  */

  const isFocused = focused && props.direction === selectedDirection && props.number === selectedNumber;
  const backgroundColor = isFocused ? highlightBackground : 'transparent';

  return (
    <div
      style={{ cursor: 'default', backgroundColor, marginTop: '0.5em' }}
      onClick={handleClick}
    >
      {props.number}: {props.clueText}
    </div>
  );
};

/*
    <ClueWrapper
      highlightBackground={highlightBackground}
      highlight={
        focused && direction === selectedDirection && number === selectedNumber
      }
      correct={correct}
      {...props}
      onClick={handleClick}
      aria-label={`clue-${number}-${direction}`}
    >
      {number}: {children}
    </ClueWrapper>
*/

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clue);


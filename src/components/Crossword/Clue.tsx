import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ThemeContext } from 'styled-components';
import { isNil } from 'lodash';
import { getFocused, getCurrentDirection, getCurrentNumber } from '../../selectors';

export interface CluePropsFromParent {
  direction: string,
  number: string;
  clueText: string;
  completelyFilledIn: boolean;
  onClueSelected: (direction: string, number: string) => any;
}

export interface ClueProps extends CluePropsFromParent {
  focused: boolean;
  currentDirection: string;
  currentNumber: string;
}

const Clue = (props: ClueProps) => {

  const clueRef = React.useRef(null);

  const { highlightBackground } = React.useContext(ThemeContext);

  React.useEffect(() => {
    const becameFocused = props.focused && props.direction === props.currentDirection && props.number === props.currentNumber;
    if (becameFocused && !isNil(clueRef) && !isNil(clueRef.current)) {
      clueRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [props.focused, props.currentDirection, props.currentNumber]);

  const handleClick = (event) => {
    event.preventDefault();
    if (!isNil(props.onClueSelected)) {
      props.onClueSelected(props.direction, props.number);
    }
  };

  const isFocused = props.focused && props.direction === props.currentDirection && props.number === props.currentNumber;
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

  // console.log('Clue render: ', props.direction, props.currentDirection, props.number, props.currentNumber);

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

function mapStateToProps(state: any) {
  return {
    focused: getFocused(state),
    currentDirection: getCurrentDirection(state),
    currentNumber: getCurrentNumber(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clue);


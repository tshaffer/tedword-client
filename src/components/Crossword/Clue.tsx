import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ThemeContext } from 'styled-components';
// import { CrosswordContext } from './context';
import { isNil } from 'lodash';
import { getFocused, getSelectedDirection, getSelectedNumber } from '../../selectors';

export interface ClueProps {
  direction: string,
  number: string;
  clueText: string;
  completelyFilledIn: boolean;
  onClueSelected: (direction: string, number: string) => any;

  focused: boolean;
  selectedDirection: string;
  selectedNumber: string;
}

const Clue = (props: ClueProps) => {

  const clueRef = React.useRef(null);

  const { highlightBackground } = React.useContext(ThemeContext);

  React.useEffect(() => {
    const becameFocused = props.focused && props.direction === props.selectedDirection && props.number === props.selectedNumber;
    if (becameFocused && !isNil(clueRef) && !isNil(clueRef.current)) {
      clueRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [props.focused, props.selectedDirection, props.selectedNumber]);

  const handleClick = (event) => {
    event.preventDefault();
    if (!isNil(props.onClueSelected)) {
      props.onClueSelected(props.direction, props.number);
    }
  };

  const isFocused = props.focused && props.direction === props.selectedDirection && props.number === props.selectedNumber;
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

  // console.log('Clue.tsx - re-render');

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
    selectedDirection: getSelectedDirection(state),
    selectedNumber: getSelectedNumber(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clue);


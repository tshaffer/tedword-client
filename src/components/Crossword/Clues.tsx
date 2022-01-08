import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import Grid from '@material-ui/core/Grid';

import { CluesByDirection } from '../../types';

import {
  moveTo,
} from '../../controllers';

import {
  getCrosswordClues,
  getInputElement,
} from '../../selectors';

import DirectionClues from './DirectionClues';

export interface CluesPropsFromParent {
  onSetFocus: () => any;
}

export interface CluesProps extends CluesPropsFromParent {
  inputElement: HTMLInputElement;
  cluesByDirection: CluesByDirection;
  onMoveTo: (row: number, col: number, directionOverride: string) => any;
}

const Clues = (props: CluesProps) => {

  const cluesContainerGridRef = React.useRef(null);

  const [maxHeight, setMaxHeight] = React.useState('100%');

  const mediaQueryList: MediaQueryList = window.matchMedia('(max-width: 600px)');

  function screenTest(e) {
    let newMaxHeight: string;
    if (e.matches) {
      /* the viewport is 600 pixels wide or less */
      newMaxHeight = '50%';
    } else {
      /* the viewport is more than 600 pixels wide */
      newMaxHeight = '100%';
    }
    if (maxHeight !== newMaxHeight) {
      setMaxHeight(newMaxHeight);
    }
  }


  const handleClueSelected = (direction, number) => {
    const info = props.cluesByDirection[direction][number];
    props.onMoveTo(info.row, info.col, direction);
    props.onSetFocus();
  };

  const renderCluesComponent = (direction: string) => {
    return (
      <Grid item xs={12} sm={6} style={{ maxHeight }}>
        <DirectionClues
          key={direction}
          direction={direction}
          cluesByNumber={props.cluesByDirection[direction]}
          onClueSelected={handleClueSelected}
        />
      </Grid>
    );
  };

  screenTest(mediaQueryList);
  mediaQueryList.addEventListener('change', screenTest);

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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onMoveTo: moveTo,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clues);

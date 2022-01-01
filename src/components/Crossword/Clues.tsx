import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import Grid from '@material-ui/core/Grid';

import { CluesByDirection } from '../../types';

import {
  setFocused,
} from '../../models';

import {
  getCrosswordClues,
  getInputElement,
} from '../../selectors';

import DirectionClues from './DirectionClues';

export interface CluesPropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
  onFocusedCellChange: (row: any, col: any, direction: any) => any;
  onMoveTo: (row: number, col: number, directionOverride: string) => any;
}

export interface CluesProps extends CluesPropsFromParent {
  inputElement: HTMLInputElement;
  cluesByDirection: CluesByDirection;
  onSetFocused: (focused: boolean) => any;
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

  // focus and movement
  const focus = () => {
    if (!isNil(props.inputElement)) {
      props.inputElement.focus();
      props.onSetFocused(true);
    }
    props.onSetFocused(true);
  };

  const handleClueSelected = (direction, number) => {
    const info = props.cluesByDirection[direction][number];
    props.onMoveTo(info.row, info.col, direction);
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
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetFocused: setFocused,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Clues);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { ThemeContext, ThemeProvider } from 'styled-components';

import Grid from '@material-ui/core/Grid';

import Board from './Board';
import Clues from './Clues';
import Chat from '../Chat/Chat';

import {
  setFocused,
} from '../../models';

import {
  getSize,
  getInputElement,
} from '../../selectors';

import {
  CrosswordSizeContext,
} from './context';

const defaultTheme = {
  columnBreakpoint: '768px',  // currently unused
  gridBackground: 'rgb(0,0,0)',
  cellBackground: 'rgb(255,255,255)',
  cellBorder: 'rgb(0,0,0)',
  textColor: 'rgb(0,0,0)',
  remoteGuessTextColor: 'rgb(255, 0, 255)',
  numberColor: 'rgba(0,0,0, 0.25)',
  focusBackground: 'rgb(255,255,0)',
  highlightBackground: 'rgb(255,255,204)',
};

export interface CrosswordPropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
}

export interface CrosswordProps extends CrosswordPropsFromParent {
  inputElement: HTMLInputElement;
  size: number;
  onSetFocused: (focused: boolean) => any;
}

const Crossword = (props: CrosswordProps) => {

  const contextTheme = React.useContext(ThemeContext);

  if (props.size === 0) {
    return null;
  }

  const cellSize = 100 / props.size;
  const cellPadding = 0.125;
  const cellInner = cellSize - cellPadding * 2;
  const cellHalf = cellSize / 2;
  const fontSize = cellInner * 0.7;

  const finalTheme = { ...defaultTheme, ...(contextTheme as any) };

  const handleSetFocus = () => {
    if (!isNil(props.inputElement)) {
      props.inputElement.focus();
      props.onSetFocused(true);
    }
    props.onSetFocused(true);
  };

  const renderBoardComponent = () => {
    return (
      <Board
        onInput={props.onInput}
        onSetFocus={handleSetFocus}
      />
    );
  };

  const renderChatComponent = () => {
    return (
      <Grid item xs={12} style={{ height: '10%' }}>
        <Chat />
      </Grid>
    );
  };

  const renderCluesComponent = () => {
    return (
      <Clues
        onSetFocus={handleSetFocus}
      />
    );
  };

  const boardComponent = renderBoardComponent();
  const cluesComponent = renderCluesComponent();
  const chatComponent = renderChatComponent();

  return (
    <CrosswordSizeContext.Provider
      value={{ cellSize, cellPadding, cellInner, cellHalf, fontSize }}
    >
      <ThemeProvider theme={finalTheme}>
        <Grid container spacing={1} justify="center" style={{ maxWidth: '100%', height: '100%' }}>
          {boardComponent}
          <Grid item xs={4} sm={5} md={6} lg={7} xl={8} container style={{ minHeight: '100%', maxHeight: '100%' }}>
            {cluesComponent}
            {chatComponent}
          </Grid>
        </Grid>
      </ThemeProvider>
    </CrosswordSizeContext.Provider>
  );
};

function mapStateToProps(state: any) {
  return {
    inputElement: getInputElement(state),
    size: getSize(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetFocused: setFocused,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Crossword);

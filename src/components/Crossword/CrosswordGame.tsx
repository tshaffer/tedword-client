import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import ReactModal = require('react-modal');

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
} from '../../selectors';

import {
  CrosswordSizeContext,
} from './context';
import { BoardStatus } from '../../types';

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

export interface CrosswordGamePropsFromParent {
  onInput: (row: number, col: number, char: string) => any;
}

import { boardInputElement } from './Board';

export interface CrosswordGameProps extends CrosswordGamePropsFromParent {
  size: number;
  onSetFocused: (focused: boolean) => any;
}

const CrosswordGame = (props: CrosswordGameProps) => {

  const contextTheme = React.useContext(ThemeContext);

  const [boardStatus, setBoardStatus] = React.useState(BoardStatus.BoardStatusUninitialized);

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minHeight: '105px',
      minWidth: '150px',
    },
  };


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
    if (!isNil(boardInputElement)) {
      boardInputElement.focus();
      props.onSetFocused(true);
    }
    props.onSetFocused(true);
  };

  const handleBoardStatusChanged = (newBoardStatus: BoardStatus) => {
    console.log('**** handleBoardStatusChanged: ', newBoardStatus);
    if (newBoardStatus !== boardStatus) {
      setBoardStatus(newBoardStatus);
    }
  };

  const handleHideBoardStatusModal = () => {
    setBoardStatus(BoardStatus.BoardStatusUninitialized);
  };

  const renderBoardComponent = () => {
    return (
      <Board
        onInput={props.onInput}
        onSetFocus={handleSetFocus}
        onBoardStatusChanged={handleBoardStatusChanged}
      />
    );
  };

  const renderCluesComponent = () => {
    return (
      <Clues
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

  const boardComponent = renderBoardComponent();
  const cluesComponent = renderCluesComponent();
  const chatComponent = renderChatComponent();

  let boardStatusMessage = '';
  if (boardStatus === BoardStatus.BoardCompleteAndCorrect) {
    boardStatusMessage = 'Congratulations';
  } else if (boardStatus === BoardStatus.BoardCompleteButIncorrect) {
    boardStatusMessage = 'Sorry';
  }

  return (
    <div>
      <div>
        <ReactModal
          isOpen={boardStatus === BoardStatus.BoardCompleteAndCorrect || boardStatus === BoardStatus.BoardCompleteButIncorrect}
          style={modalStyle}
          ariaHideApp={false}
        >
          <div>
            <div style={{ marginBottom: '10px' }}>
              <p>{boardStatusMessage}</p>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
              }}
            >
              <button
                onClick={handleHideBoardStatusModal}
              >
                Close
              </button>
            </div>
          </div>
        </ReactModal>

      </div>
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
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    size: getSize(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetFocused: setFocused,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(CrosswordGame);

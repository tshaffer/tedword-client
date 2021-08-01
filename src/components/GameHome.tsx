import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, BoardEntity, BoardsMap } from '../types';
import { getAppState, getBoards, getPuzzlesMetadata } from '../selectors';
import { setBoardId, setPuzzleId, setUiState } from '../models';
import {
  createBoard,
  // resumeBoardPlay
} from '../controllers';

export interface GameHomeProps {
  appState: AppState,
  boardsMap: BoardsMap;
  puzzlesMetadata: PuzzlesMetadataMap;
  onCreateBoard: () => any;
  // onResumeBoardPlay: () => any;
  onSetBoardId: (boardId: string) => any;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
}

const GameHome = (props: GameHomeProps) => {

  const getPuzzleTitles = (): string[] => {
    const puzzleTitles: string[] = [];
    for (const puzzleId in props.puzzlesMetadata) {
      if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
        const puzzleMetadata: PuzzleMetadata = props.puzzlesMetadata[puzzleId];
        puzzleTitles.push(puzzleMetadata.title);
      }
    }
    return puzzleTitles;
  };

  const getPuzzleOption = (puzzleTitle: string) => {
    return (
      <option
        key={puzzleTitle}
        value={puzzleTitle}
      >
        {puzzleTitle}
      </option>
    );
  };

  const getPuzzleOptions = (puzzleTitles: string[]) => {
    const puzzleOptions = puzzleTitles.map((puzzleTitle: string) => {
      return getPuzzleOption(puzzleTitle);
    });
    return puzzleOptions;
  };

  const getSelectedPuzzleTitle = (): string => {

    // eslint-disable-next-line no-prototype-builtins
    if (props.puzzlesMetadata.hasOwnProperty(props.appState.puzzleId)) {
      const puzzleMetadata: PuzzleMetadata = props.puzzlesMetadata[props.appState.puzzleId];
      return puzzleMetadata.title;
    }

    return '';
  };

  const getBoardTitles = (): string[] => {
    const boardEntities: BoardEntity[] = [];
    for (const boardId in props.boardsMap) {
      if (Object.prototype.hasOwnProperty.call(props.boardsMap, boardId)) {
        const boardEntity: BoardEntity = props.boardsMap[boardId];
        boardEntities.push(boardEntity);
      }
    }
    boardEntities.sort((a: BoardEntity, b: BoardEntity) => {
      return a.startDateTime > b.startDateTime
        ? -1
        : 1;
    });

    const boardTitles: string[] = boardEntities.map((boardEntity) => {
      return boardEntity.title;
    });

    return boardTitles;
  };

  const getSelectedBoardTitle = (): string => {

    // eslint-disable-next-line no-prototype-builtins
    if (props.boardsMap.hasOwnProperty(props.appState.boardId)) {
      const board: BoardEntity = props.boardsMap[props.appState.boardId];
      return board.title;
    }

    return '';
  };

  const getBoardOption = (boardTitle: string) => {
    return (
      <option
        key={boardTitle}
        value={boardTitle}
      >
        {boardTitle}
      </option>
    );
  };

  const getBoardOptions = (boardTitles: string[]) => {
    const boardOptions = boardTitles.map((boardTitle: string) => {
      return getBoardOption(boardTitle);
    });
    return boardOptions;
  };

  const handleBoardChange = (event) => {
    console.log('handleBoardChange');
    console.log(event.target.value);

    const boardTitle: string = event.target.value;
    for (const boardId in props.boardsMap) {
      if (Object.prototype.hasOwnProperty.call(props.boardsMap, boardId)) {
        const boardEntity = props.boardsMap[boardId];
        if (boardEntity.title === boardTitle) {
          // TEDTODO - review this - user may not hit Open Board
          props.onSetPuzzleId(boardEntity.puzzleId);
          props.onSetBoardId(boardId);
        }
      }
    }
  };


  const handlePuzzleChange = (event) => {
    console.log('handlePuzzleChange');
    console.log(event.target.value);

    const puzzleTitle: string = event.target.value;
    for (const puzzleId in props.puzzlesMetadata) {
      if (Object.prototype.hasOwnProperty.call(props.puzzlesMetadata, puzzleId)) {
        const puzzleMetadata = props.puzzlesMetadata[puzzleId];
        if (puzzleMetadata.title === puzzleTitle) {
          // TEDTODO - review this - user may not hit Open Puzzle
          props.onSetPuzzleId(puzzleId);
        }
      }
    }
  };

  const handleOpenBoard = () => {
    props.onSetUiState(UiState.ExistingBoardPlay);
    // props.onResumeBoardPlay();
  };

  const handleOpenPuzzle = () => {
    props.onCreateBoard();
    props.onSetUiState(UiState.NewBoardPlay);
  };

  const renderSelectPuzzleOrBoard = () => {

    const puzzleTitles: string[] = getPuzzleTitles();
    if (puzzleTitles.length === 0) {
      return null;
    }

    const selectedPuzzleTitle: string = getSelectedPuzzleTitle();
    if (selectedPuzzleTitle === '') {
      return null;
    }

    // TEDTODO - this isn't right when there are no boards
    const boardTitles: string[] = getBoardTitles();
    if (boardTitles.length === 0) {
      return null;
    }
    const selectedBoardTitle: string = getSelectedBoardTitle();
    if (selectedBoardTitle === '') {
      return null;
    }

    const puzzleOptions = getPuzzleOptions(puzzleTitles);
    const boardOptions = getBoardOptions(boardTitles);

    // return (
    //   <div>
    //     <p>Select Puzzle</p>
    //     <select
    //       tabIndex={-1}
    //       value={selectedPuzzleTitle}
    //       onChange={handlePuzzleChange}
    //     >
    //       {puzzleOptions}
    //     </select>
    //     <p>
    //       <button
    //         type="button"
    //         onClick={handleOpenPuzzle}
    //       >
    //         Open Puzzle
    //       </button>
    //     </p>
    //     <p></p>
    //     <p>Select Board</p>
    //     <select
    //       tabIndex={-1}
    //       value={selectedBoardTitle}
    //       onChange={handleBoardChange}
    //     >
    //       {boardOptions}
    //     </select>
    //     <p>
    //       <button
    //         type="button"
    //         onClick={handleOpenBoard}
    //       >
    //         Open Board
    //       </button>
    //     </p>
    //   </div>
    // );

    const tabcontent = {
      display: 'none',
      padding: '6px 12px',
      border: '1px solid #ccc',
      borderTop: 'none',
    };

    const tab = {
      overflow: 'hidden',
      border: '1px solid #ccc',
      backgroundColor: '#f1f1f1',
    };

    const tabLinks = {
      backgroundColor: 'inherit',
      // float: 'left',
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
      padding: '14px 16px',
      transition: '0.3s'
    };

    const handleOpenCity = (event: any) => {
      console.log('open city');
      console.log(event.target.id);
    };

    return (
      <div>

        <div style={tab}>
          <button style={tabLinks} onClick={handleOpenCity} id='London'>London</button>
          <button style={tabLinks} onClick={handleOpenCity} id='Paris'>Paris</button>
          <button style={tabLinks} onClick={handleOpenCity} id='Tokyo'>Tokyo</button>
        </div>
        <div id="London" style={tabcontent}>
          <h3>London</h3>
          <p>London is the capital city of England.</p>
        </div>

        <div id="Paris" style={tabcontent}>
          <h3>Paris</h3>
          <p>Paris is the capital of France.</p>
        </div>

        <div id="Tokyo" style={tabcontent}>
          <h3>Tokyo</h3>
          <p>Tokyo is the capital of Japan.</p>
        </div>
      </div>
    );
  };

  return renderSelectPuzzleOrBoard();
};

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
    boardsMap: getBoards(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onCreateBoard: createBoard,
    // onResumeBoardPlay: resumeBoardPlay,
    onSetBoardId: setBoardId,
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);


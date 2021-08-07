/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, BoardEntity, BoardsMap, PuzzleSpec } from '../types';
import { getAppState, getBoards, getPuzzlesMetadata } from '../selectors';
import { setBoardId, setPuzzleId, setUiState } from '../models';
import {
  createBoard,
} from '../controllers';

import NewGames from './NewGames';
import ExistingGames from './ExistingGames';
import { isNil } from 'lodash';

const PuzCrossword = require('@confuzzle/puz-crossword').PuzCrossword;

export interface GameHomeProps {
  appState: AppState,
  boardsMap: BoardsMap;
  puzzlesMetadata: PuzzlesMetadataMap;
  onCreateBoard: () => any;
  onSetBoardId: (boardId: string) => any;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
}

const GameHome = (props: GameHomeProps) => {

  const [file, setFile] = React.useState(null);

  const handleOpenBoard = (boardEntity: BoardEntity) => {
    props.onSetPuzzleId(boardEntity.puzzleId);
    props.onSetBoardId(boardEntity.id);
    props.onSetUiState(UiState.ExistingBoardPlay);
  };

  const handleOpenPuzzle = (puzzleMetadata: PuzzleMetadata) => {
    props.onSetPuzzleId(puzzleMetadata.id);
    props.onCreateBoard();
    props.onSetUiState(UiState.NewBoardPlay);
  };

  const renderSelectPuzzleOrBoard = () => {

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

    const handleSelectFiles = (e) => {
      if (!isNil(e.target.files)
        && e.target.files.length > 0) {
        const targetFileList: FileList = e.target.files;
        // const { onAddUploadFiles = () => {} } = this.props;
        const filesToAdd = [];
        for (let i = 0; i < targetFileList.length; i++) {
          const targetFile: File = e.target.files[i];
          filesToAdd.push(targetFile);
        }
        // onAddUploadFiles(filesToAdd);
        console.log(filesToAdd);
        setFile(filesToAdd[0]);
      }
      e.target.value = '';
    };

    const fileReader: FileReader = new FileReader();

    const arrayBufferToString = (buffer: ArrayBuffer, encoding = 'UTF-8'): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const blob = new Blob([buffer], { type: 'text/plain' });
        const reader = new FileReader();
        reader.onload = (evt) => {
          if (evt.target) {
            resolve(evt.target.result as string);
          } else {
            reject(new Error('Could not convert array to string!'));
          }
        };
        reader.readAsText(blob, encoding);
      });
    };

    const handleFileReaderEvent = (event) => {
      console.log('handleFileReaderEvent');
      console.log(event);

      if (event.type === 'load') {
        // console.log(fileReader.result);

        const puzData: Buffer = Buffer.from(fileReader.result as ArrayBuffer);
        const pc: PuzzleSpec = PuzCrossword.from(puzData);
        console.log(pc);
    
        // arrayBufferToString(fileReader.result as ArrayBuffer)
        //   .then((fileContents: string) => {
        //     console.log('fileContents: ');
        //     console.log(fileContents);
        //   });
      }
    };

    const handleUploadFiles = () => {
      // props.onUploadFile(file);
      console.log('uploadFile: ', file);

      fileReader.addEventListener('loadstart', handleFileReaderEvent);
      fileReader.addEventListener('load', handleFileReaderEvent);
      fileReader.addEventListener('loadend', handleFileReaderEvent);
      fileReader.addEventListener('progress', handleFileReaderEvent);
      fileReader.addEventListener('error', handleFileReaderEvent);
      fileReader.addEventListener('abort', handleFileReaderEvent);

      fileReader.readAsArrayBuffer(file);
    };

    function handleSelectTab(evt: any) {

      const selectedTabId = evt.target.id;

      // Hide content divs
      newGamesContentRef.current.style.display = 'none';
      inProgressGamesContentRef.current.style.display = 'none';

      // Show the current tab, and add an 'active' class to the button that opened the tab
      switch (selectedTabId) {
        case 'newGameTabSelect':
          newGamesContentRef.current.style.display = 'block';
          newGameTabSelectRef.current.style.backgroundColor = '#ccc';
          inProgressGamesTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'inProgressGameTabSelect':
          inProgressGamesContentRef.current.style.display = 'block';
          inProgressGamesTabSelectRef.current.style.backgroundColor = '#ccc';
          newGameTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'settingsTabSelect':
          settingsContentRef.current.style.display = 'block';
          settingsTabSelectRef.current.style.backgroundColor = '#ccc';
          inProgressGamesTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        default:
          break;
      }
    }

    const newGameTabSelectRef = React.createRef<any>();
    const newGamesContentRef = React.createRef<any>();
    const inProgressGamesTabSelectRef = React.createRef<any>();
    const inProgressGamesContentRef = React.createRef<any>();
    const settingsTabSelectRef = React.createRef<any>();
    const settingsContentRef = React.createRef<any>();

    return (
      <div>
        <div style={tab}>
          <button style={tabLinks} onClick={handleSelectTab} id='newGameTabSelect' ref={newGameTabSelectRef}>New Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='inProgressGameTabSelect' ref={inProgressGamesTabSelectRef}>In Progress Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='settingsTabSelect' ref={settingsTabSelectRef}>Settings</button>
        </div>
        <div id='newGameContent' style={tabcontent} ref={newGamesContentRef}>
          <NewGames
            onSelectPuzzle={handleOpenPuzzle}
          />
        </div>
        <div id='inProgressGamesContent' style={tabcontent} ref={inProgressGamesContentRef}>
          <ExistingGames
            onSelectBoard={handleOpenBoard}
          />
        </div>
        <div id='settingsContent' style={tabcontent} ref={settingsContentRef}>
          <div>
            <input
              id="input"
              type="file"
              multiple
              onChange={handleSelectFiles}
            />
            <p>
              <button
                type='button'
                onClick={handleUploadFiles}
              >
                Upload Files
              </button>
            </p>
          </div>
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
    onSetBoardId: setBoardId,
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);


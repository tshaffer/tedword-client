/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, BoardEntity, BoardsMap } from '../types';
import { getAppState, getBoards, getCurrentUser, getPuzzlesMetadata } from '../selectors';
import { setBoardId, setPuzzleId, setUiState, setFileUploadStatus } from '../models';
import {
  addUserToExistingBoard,
  createBoard,
  updateLastPlayedDateTime,
  uploadPuzFiles,
} from '../controllers';

import NewGames from './NewGames';
import ExistingGames from './ExistingGames';
import { isNil } from 'lodash';

export interface GameHomeProps {
  appState: AppState,
  boardsMap: BoardsMap;
  currentUser: string;
  puzzlesMetadata: PuzzlesMetadataMap;
  onAddUserToBoard: (id: string, userName: string) => any;
  onCreateBoard: () => any;
  onSetBoardId: (boardId: string) => any;
  onSetFileUploadStatus: (fileUploadState: string) => any;
  onSetPuzzleId: (puzzleId: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onUpdateLastPlayedDateTime: (boardId: string, dt: Date) => any;
  onUploadPuzFiles: (files: File[]) => any;
}

const GameHome = (props: GameHomeProps) => {

  const [files, setFiles] = React.useState<File[]>([]);

  const userInGame = (boardEntity: BoardEntity): boolean => {
    return boardEntity.users.includes(props.currentUser);
  };

  const handleOpenBoard = (boardEntity: BoardEntity) => {
    props.onSetPuzzleId(boardEntity.puzzleId);
    props.onSetBoardId(boardEntity.id);
    if (!userInGame(boardEntity)) {
      props.onAddUserToBoard(boardEntity.id, props.currentUser);
    }
    props.onUpdateLastPlayedDateTime(boardEntity.id, new Date(Date()));
    props.onSetUiState(UiState.ExistingBoardPlay);
  };

  const handleOpenPuzzle = (puzzleMetadata: PuzzleMetadata) => {
    props.onSetPuzzleId(puzzleMetadata.id);
    props.onCreateBoard();
    props.onSetUiState(UiState.NewBoardPlay);
  };

  const renderGameHome = () => {

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

    const displayNone = {
      display: 'none',
    };

    const handleUploadPuzFiles = () => {
      props.onSetFileUploadStatus('Uploading files...');
      props.onUploadPuzFiles(files);
    };

    const handleDisplayFileSelect = () => {
      fileSelectRef.current.click();
    };

    const handleSelectPuzFiles = (e: { target: { files: string | any[] | FileList; value: string; }; }) => {
      if (!isNil(e.target.files)
        && e.target.files.length > 0) {
        const targetFileList: FileList = e.target.files as FileList;
        const filesToAdd = [];
        for (let i = 0; i < targetFileList.length; i++) {
          const targetFile: File = e.target.files[i];
          filesToAdd.push(targetFile);
        }
        setFiles(filesToAdd);
      }
      e.target.value = '';
      props.onSetFileUploadStatus('Upload pending...');
    };

    function handleSelectTab(evt: any) {

      const selectedTabId = evt.target.id;

      // Hide content divs
      newGamesContentRef.current.style.display = 'none';
      inProgressGamesContentRef.current.style.display = 'none';
      settingsContentRef.current.style.display = 'none';

      // Show the current tab, and add an 'active' class to the button that opened the tab
      switch (selectedTabId) {
        case 'newGameTabSelect':
          newGamesContentRef.current.style.display = 'block';
          newGameTabSelectRef.current.style.backgroundColor = '#ccc';
          inProgressGamesTabSelectRef.current.style.backgroundColor = 'inherit';
          settingsTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'inProgressGameTabSelect':
          inProgressGamesContentRef.current.style.display = 'block';
          inProgressGamesTabSelectRef.current.style.backgroundColor = '#ccc';
          newGameTabSelectRef.current.style.backgroundColor = 'inherit';
          settingsTabSelectRef.current.style.backgroundColor = 'inherit';
          break;
        case 'settingsTabSelect':
          props.onSetFileUploadStatus('');
          settingsContentRef.current.style.display = 'block';
          settingsTabSelectRef.current.style.backgroundColor = '#ccc';
          newGameTabSelectRef.current.style.backgroundColor = 'inherit';
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

    const fileSelectRef = React.createRef<any>();

    const getFilesLabel = () => {
      let filesLabel: string = '';
      if (files.length === 0) {
        filesLabel = 'No file chosen';
      } else if (files.length === 1) {
        filesLabel = files[0].name;
      } else {
        for (const file of files) {
          filesLabel += file.name + ' ';
        }
      }
      return filesLabel;
    };

    return (
      <div>
        <div style={tab}>
          <button style={tabLinks} onClick={handleSelectTab} id='newGameTabSelect' ref={newGameTabSelectRef}>New Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='inProgressGameTabSelect' ref={inProgressGamesTabSelectRef}>In Progress Games</button>
          <button style={tabLinks} onClick={handleSelectTab} id='settingsTabSelect' ref={settingsTabSelectRef}>Tools & Settings</button>
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
              type="file"
              id="fileElem"
              multiple
              style={displayNone}
              ref={fileSelectRef}
              onChange={handleSelectPuzFiles}
            />
            <button
              id="fileSelect"
              onClick={handleDisplayFileSelect}
            >
              Choose Files
            </button>
            <label>{getFilesLabel()}</label>

            <p>New files</p>
            <ul>
              <li>newFile1.puz</li>
              <li>newFile2.puz</li>
            </ul>
            <p>Existing files</p>
            <ul>
              <li>existingFile1.puz</li>
              <li>existingFile2.puz</li>
            </ul>
          </div>
          <div>
            <p>
              <button
                type='button'
                onClick={handleUploadPuzFiles}
              >
                Upload New Files
              </button>
              <button
                type='button'
                onClick={handleUploadPuzFiles}
              >
                Upload All Files
              </button>
            </p>
            <p>
              {props.appState.fileUploadStatus}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return renderGameHome();
};

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
    boardsMap: getBoards(state),
    currentUser: getCurrentUser(state),
    puzzlesMetadata: getPuzzlesMetadata(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onAddUserToBoard: addUserToExistingBoard,
    onCreateBoard: createBoard,
    onSetBoardId: setBoardId,
    onSetFileUploadStatus: setFileUploadStatus,
    onSetPuzzleId: setPuzzleId,
    onSetUiState: setUiState,
    onUpdateLastPlayedDateTime: updateLastPlayedDateTime,
    onUploadPuzFiles: uploadPuzFiles,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(GameHome);


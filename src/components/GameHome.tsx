/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, PuzzlesMetadataMap, PuzzleMetadata, BoardEntity, BoardsMap, PuzzleExistsByFileNameMap } from '../types';
import { getAppState, getBoards, getCurrentUser, getPuzzlesMetadata, getPuzzleExistsByFileNameMap } from '../selectors';
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
  puzzleExistsByFileName: PuzzleExistsByFileNameMap;
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

    const padded = {
      margin: '4px',
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

    const getFilesLists = () => {

      const existingFiles: string[] = [];
      const newFiles: string[] = [];

      for (const file of files) {
        // eslint-disable-next-line no-prototype-builtins
        if (props.puzzleExistsByFileName.hasOwnProperty(file.name)) {
          existingFiles.push(file.name);
        } else {
          newFiles.push(file.name);
        }
      }

      return {
        newFiles,
        existingFiles,
      };
    };

    const renderUploadButton = (newFiles: any[]) => {

      return newFiles.length === 0
        ? null
        : (
          <div>
            <p>
              <button
                type='button'
                style={padded}
                onClick={handleUploadPuzFiles}
              >
                Upload Files
              </button>
            </p>
          </div>
        );
    };

    const getNewFilesList = (newFiles: any[]) => {

      if (newFiles.length === 0) {
        return null;
      }
      const newFilesListItems = newFiles.map((newFile) =>
        <li key={newFile}>{newFile}</li>
      );
      return (
        <div>
          <p>New files</p>
          <ul>{newFilesListItems}</ul>
        </div>
      );
    };

    const getExistingFilesList = (existingFiles: any[]) => {

      if (existingFiles.length === 0) {
        return null;
      }
      const existingFilesListItems = existingFiles.map((existingFile) =>
        <li key={existingFile}>{existingFile}</li>
      );
      return (
        <div>
          <p>Existing files (will not be uploaded)</p>
          <ul>{existingFilesListItems}</ul>
        </div>
      );
    };

    const renderFilesList = () => {

      if (files.length == 0) {
        return (
          <div>
            <p>No files chosen</p>
          </div>
        );
      }

      const filesLists = getFilesLists();
      const { existingFiles, newFiles } = filesLists;

      const uploadButton = renderUploadButton(newFiles);

      const newFilesList = getNewFilesList(newFiles);
      const existingFilesList = getExistingFilesList(existingFiles);

      return (
        <div>
          {newFilesList}
          {existingFilesList}
          {uploadButton}
        </div>
      );
    };

    const renderSettingsTab = () => {

      const filesList = renderFilesList();

      return (
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
              style={padded}
              onClick={handleDisplayFileSelect}
            >
              Choose Files
            </button>
          </div>
          <div>
            {filesList}
          </div>
          <div>
            <p>
              {props.appState.fileUploadStatus}
            </p>
          </div>
        </div>
      );
    };

    const newGameTabSelectRef = React.createRef<any>();
    const newGamesContentRef = React.createRef<any>();
    const inProgressGamesTabSelectRef = React.createRef<any>();
    const inProgressGamesContentRef = React.createRef<any>();
    const settingsTabSelectRef = React.createRef<any>();
    const settingsContentRef = React.createRef<any>();

    const fileSelectRef = React.createRef<any>();

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
        {renderSettingsTab()}
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
    puzzleExistsByFileName: getPuzzleExistsByFileNameMap(state),
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


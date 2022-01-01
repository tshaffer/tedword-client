import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { isNil } from 'lodash';

import { AppState, PuzzleExistsByFileNameMap } from '../types';
import { getAppState, getPuzzleExistsByFileNameMap } from '../selectors';
import { setFileUploadStatus } from '../models';
import {
  uploadPuzFiles, uploadPuzzleBuffer,
} from '../controllers';

export interface PuzzleUploadProps {
  appState: AppState,
  puzzleExistsByFileName: PuzzleExistsByFileNameMap;
  onSetFileUploadStatus: (fileUploadState: string) => any;
  onUploadPuzFiles: (files: File[]) => any;
}

const PuzzleUpload = (props: PuzzleUploadProps) => {

  const [files, setFiles] = React.useState<File[]>([]);
  const [newFiles, setNewFiles] = React.useState<File[]>([]);
  const [existingFiles, setExistingFiles] = React.useState<File[]>([]);

  React.useEffect(() => {
    buildFilesLists();
  }, [files]);

  const padded = {
    margin: '4px',
  };

  const displayNone = {
    display: 'none',
  };

  const buildFilesLists = (): void => {

    const existingFiles: File[] = [];
    const newFiles: File[] = [];

    for (const file of files) {
      // eslint-disable-next-line no-prototype-builtins
      if (props.puzzleExistsByFileName.hasOwnProperty(file.name)) {
        existingFiles.push(file);
      } else {
        newFiles.push(file);
      }
    }

    setExistingFiles(existingFiles);
    setNewFiles(newFiles);
  };

  const getNewFilesList = () => {

    if (newFiles.length === 0) {
      return null;
    }
    const newFilesListItems = newFiles.map((newFile) =>
      <li key={newFile.name}>{newFile.name}</li>
    );
    return (
      <div>
        <p>New files</p>
        <ul>{newFilesListItems}</ul>
      </div>
    );
  };

  const getExistingFilesList = () => {

    if (existingFiles.length === 0) {
      return null;
    }
    const existingFilesListItems = existingFiles.map((existingFile) =>
      <li key={existingFile.name}>{existingFile.name}</li>
    );
    return (
      <div>
        <p>Existing files (will not be uploaded)</p>
        <ul>{existingFilesListItems}</ul>
      </div>
    );
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

    if (e.target.files.length > 0) {
      props.onSetFileUploadStatus('Upload pending...');
    } else {
      props.onSetFileUploadStatus('');
    }
  };

  const handleUploadPuzFiles = () => {
    props.onSetFileUploadStatus('Uploading files...');
    props.onUploadPuzFiles(files);
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

  const renderFilesList = () => {

    if (files.length == 0) {
      return (
        <div>
          <p>No files chosen</p>
        </div>
      );
    }

    const uploadButton = renderUploadButton(newFiles);

    const newFilesList = getNewFilesList();
    const existingFilesList = getExistingFilesList();

    return (
      <div>
        {newFilesList}
        {existingFilesList}
        {uploadButton}
      </div>
    );
  };

  const fileSelectRef = React.createRef<any>();

  const filesList = renderFilesList();

  return (
    <div>
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

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
    puzzleExistsByFileName: getPuzzleExistsByFileNameMap(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetFileUploadStatus: setFileUploadStatus,
    onUploadPuzFiles: uploadPuzzleBuffer,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(PuzzleUpload);


import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HashRouter, Redirect } from 'react-router-dom';

import ReactModal = require('react-modal');

import { UiState, UsersMap, VersionInfo } from '../types';
import {
  updateLastPlayedDateTime,
  initializeApp,
} from '../controllers';
import { setUiState, setFileUploadStatus, setUserName } from '../models';
import { getAppInitialized, getUsers, getVersionInfo } from '../selectors';

import NewGames from './NewGames';
import ExistingGames from './ExistingGames';
import PuzzleUpload from './PuzzleUpload';

export interface LauncherProps {
  appInitialized: boolean;
  versionInfo: VersionInfo;
  users: UsersMap,
  onInitializeApp: () => any;
  onSetFileUploadStatus: (fileUploadState: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onUpdateLastPlayedDateTime: (boardId: string, dt: Date) => any;
  onSetUserName: (userName: string) => any;
}

const Launcher = (props: LauncherProps) => {

  const [redirectTarget, setRedirectTarget] = React.useState('');

  const [showAboutModal, setShowAboutModal] = React.useState(false);

  React.useEffect(() => {
    console.log('Launcher: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);

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

  const renderLauncher = () => {

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

    function handleSignout() {

      localStorage.setItem('userName', '');

      const users: string[] = [];
      for (const userKey in props.users) {
        if (Object.prototype.hasOwnProperty.call(props.users, userKey)) {
          users.push(userKey);
        }
      }

      if (users.length > 0) {
        props.onSetUserName(users[0]);
      }
      props.onSetUiState(UiState.SelectUser);

      setRedirectTarget('login');
    }

    const handleShowAbout = () => {
      setShowAboutModal(true);
    };

    const handleHideAbout = () => {
      setShowAboutModal(false);
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

    const divStyle = {
      height: '98vh',
    };

    if (!props.appInitialized) {
      return (
        <div style={divStyle}>Loading...</div>
      );
    }

    if (redirectTarget === 'login') {
      return <Redirect to='/login'/>;
    }
    
    return (
      <HashRouter>
        <div>
          <div>
            <ReactModal
              isOpen={showAboutModal}
              style={modalStyle}
              ariaHideApp={false}
            >
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <p style={{ marginBottom: '6px' }}>tedword</p>
                  <p>{'Client version: ' + props.versionInfo.clientVersion}</p>
                  <p>{'Server version: ' + props.versionInfo.serverVersion}</p>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                  }}
                >
                  <button
                    onClick={handleHideAbout}
                  >
                    Close
                  </button>
                </div>
              </div>
            </ReactModal>
          </div>
          <div>
            <button onClick={handleSignout}>Signout</button>
            <button onClick={handleShowAbout}>About</button>
          </div>
          <div style={tab}>
            <button style={tabLinks} onClick={handleSelectTab} id='newGameTabSelect' ref={newGameTabSelectRef}>New Games</button>
            <button style={tabLinks} onClick={handleSelectTab} id='inProgressGameTabSelect' ref={inProgressGamesTabSelectRef}>In Progress Games</button>
            <button style={tabLinks} onClick={handleSelectTab} id='settingsTabSelect' ref={settingsTabSelectRef}>Tools & Settings</button>
          </div>
          <div id='newGameContent' style={tabcontent} ref={newGamesContentRef}>
            <NewGames/>
          </div>
          <div id='inProgressGamesContent' style={tabcontent} ref={inProgressGamesContentRef}>
            <ExistingGames />
          </div>
          <div id='settingsContent' style={tabcontent} ref={settingsContentRef}>
            <PuzzleUpload />
          </div>
        </div>
      </HashRouter>

    );
  };

  return renderLauncher();
};

function mapStateToProps(state: any) {
  return {
    appInitialized: getAppInitialized(state),
    versionInfo: getVersionInfo(state),
    users: getUsers(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onInitializeApp: initializeApp,
    onSetFileUploadStatus: setFileUploadStatus,
    onSetUiState: setUiState,
    onUpdateLastPlayedDateTime: updateLastPlayedDateTime,
    onSetUserName: setUserName,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);


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

  const [selectedTab, setSelectedTab] = React.useState<string>('inProgressGameTabSelect');

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

    const unselectedTabcontent = {
      display: 'none',
      padding: '6px 12px',
      border: '1px solid #ccc',
      borderTop: 'none',
    };

    const selectedTabcontent = {
      display: 'block',
      padding: '6px 12px',
      border: '1px solid #ccc',
      borderTop: 'none',
    };

    const tab = {
      overflow: 'hidden',
      border: '1px solid #ccc',
      backgroundColor: '#f1f1f1',
    };

    const tabLinkSelected = {
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
      padding: '14px 16px',
      transition: '0.3s',
      backgroundColor: '#ccc',
    };

    const tabLinkUnselected = {
      border: 'none',
      outline: 'none',
      cursor: 'pointer',
      padding: '14px 16px',
      transition: '0.3s',
      backgroundColor: 'inherit',
    };

    const divStyle = {
      height: '98vh',
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
      setSelectedTab(evt.target.id);
    }

    if (!props.appInitialized) {
      return (
        <div style={divStyle}>Loading...</div>
      );
    }

    if (redirectTarget === 'login') {
      return <Redirect to='/login' />;
    }

    const getRenderedTabs = () => {
      switch (selectedTab) {
        case 'newGameTabSelect':
          return (
            <div style={tab}>
              <button style={tabLinkSelected} onClick={handleSelectTab} id='newGameTabSelect'>New Games</button>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='inProgressGameTabSelect' >In Progress Games</button>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='settingsTabSelect' >Tools & Settings</button>
            </div>
          );
        default:
        case 'inProgressGameTabSelect':
          return (
            <div style={tab}>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='newGameTabSelect'>New Games</button>
              <button style={tabLinkSelected} onClick={handleSelectTab} id='inProgressGameTabSelect' >In Progress Games</button>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='settingsTabSelect' >Tools & Settings</button>
            </div>
          );
        case 'settingsTabSelect':
          return (
            <div style={tab}>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='newGameTabSelect'>New Games</button>
              <button style={tabLinkUnselected} onClick={handleSelectTab} id='inProgressGameTabSelect' >In Progress Games</button>
              <button style={tabLinkSelected} onClick={handleSelectTab} id='settingsTabSelect' >Tools & Settings</button>
            </div>
          );
      }
    };

    const getRenderedTabContent = () => {
      switch (selectedTab) {
        case 'newGameTabSelect':
          return (
            <div>
              <div id='newGameContent' style={selectedTabcontent}>
                <NewGames />
              </div>
              <div id='inProgressGamesContent' style={unselectedTabcontent}>
                <ExistingGames />
              </div>
              <div id='settingsContent' style={unselectedTabcontent}>
                <PuzzleUpload />
              </div>
            </div>);
        default:
        case 'inProgressGameTabSelect':
          return (
            <div>
              <div id='newGameContent' style={unselectedTabcontent}>
                <NewGames />
              </div>
              <div id='inProgressGamesContent' style={selectedTabcontent}>
                <ExistingGames />
              </div>
              <div id='settingsContent' style={unselectedTabcontent}>
                <PuzzleUpload />
              </div>
            </div>
          );
        case 'settingsTabSelect':
          return (
            <div>
              <div id='newGameContent' style={unselectedTabcontent}>
                <NewGames />
              </div>
              <div id='inProgressGamesContent' style={unselectedTabcontent}>
                <ExistingGames />
              </div>
              <div id='settingsContent' style={selectedTabcontent}>
                <PuzzleUpload />
              </div>
            </div>
          );
      }
    };

    const renderedTabs = getRenderedTabs();
    const renderedTabContent = getRenderedTabContent();

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
          {renderedTabs}
          {renderedTabContent}
        </div >
      </HashRouter >

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


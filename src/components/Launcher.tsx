import { cloneDeep } from 'lodash';

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { HashRouter, Redirect } from 'react-router-dom';

import ReactModal = require('react-modal');

import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import InfoIcon from '@material-ui/icons/Info';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { UiState, UsersMap, VersionInfo } from '../types';
import {
  deleteGames,
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
  onDeleteGames: (boardIds: string[]) => any;
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    display: 'none',
    [
      theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
}));

const Launcher = (props: LauncherProps) => {

  const [redirectTarget, setRedirectTarget] = React.useState('');

  const [showAboutModal, setShowAboutModal] = React.useState(false);

  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = React.useState(false);

  const [selectedTab, setSelectedTab] = React.useState<string>('inProgressGameTabSelect');

  interface SelectedExistingGamesById {
    [id: string]: boolean;  // value is boardId
  }

  const [selectedExistingGamesById, setSelectedExistingGamesById] = React.useState<SelectedExistingGamesById>({});

  React.useEffect(() => {
    console.log('Launcher: ', props.appInitialized);
    if (!props.appInitialized) {
      props.onInitializeApp();
    }
  }, [props.appInitialized]);

  const classes = useStyles();

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

    const unselectedTabContent = {
      display: 'none',
      padding: '6px 12px',
      border: '1px solid #ccc',
      borderTop: 'none',
    };

    const selectedTabContent = {
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

    const isGameSelected = (): boolean => {
      for (const existingGameId in selectedExistingGamesById) {
        if (Object.prototype.hasOwnProperty.call(selectedExistingGamesById, existingGameId)) {
          const isSelected = selectedExistingGamesById[existingGameId];
          if (isSelected) {
            return true;
          }
        }
      }
      return false;
    };

    const getSelectedBoardIds = (boardIds: string[]): string[] => {

      const selectedBoardIds = [];

      for (const existingGameId of boardIds) {
        if (Object.prototype.hasOwnProperty.call(selectedExistingGamesById, existingGameId)) {
          const isSelected = selectedExistingGamesById[existingGameId];
          if (isSelected) {
            selectedBoardIds.push(existingGameId);
          }
        }
      }
      return selectedBoardIds;
    };

    const handleToggleSelectGame = (boardId: string) => {
      const localSelectedExistingGamesById = cloneDeep(selectedExistingGamesById);
      localSelectedExistingGamesById[boardId] = !localSelectedExistingGamesById[boardId];
      setSelectedExistingGamesById(localSelectedExistingGamesById);
    };

    const handleDeleteInvoked = () => {
      setConfirmDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
      setConfirmDeleteDialogOpen(false);
    };

    const handleDeleteSelectedGames = () => {
      const boardIdsToDelete: string[] = getSelectedBoardIds(Object.keys(selectedExistingGamesById));
      props.onDeleteGames(boardIdsToDelete);
      setConfirmDeleteDialogOpen(false);
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

    const renderDeleteIcon = () => {
      if (isGameSelected()) {
        return (
          <IconButton
            className={classes.menuButton}
            color='inherit'
            onClick={handleDeleteInvoked}
          >
            <DeleteIcon />
          </IconButton>
        );
      } else {
        return null;
      }
    };

    const renderToolbar = () => {
      return (
        <div className={classes.root}>
          <AppBar position='static'>
            <Toolbar>
              <IconButton
                className={classes.menuButton}
                color='inherit'
              >
                <MenuIcon />
              </IconButton>
              <Typography className={classes.title} variant='h6' noWrap>
                Tedword
              </Typography>
              {renderDeleteIcon()}
              <Dialog
                open={confirmDeleteDialogOpen}
                onClose={handleCloseDeleteDialog}
              >
                <DialogTitle id='alert-dialog-title'>{'Delete games?'}</DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Delete the selected games?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseDeleteDialog} color='primary'>
                    No
                  </Button>
                  <Button onClick={handleDeleteSelectedGames} color='primary' autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
              <IconButton
                className={classes.menuButton}
                color='inherit'
                onClick={handleShowAbout}
              >
                <InfoIcon />
              </IconButton>
              <Button color='inherit' onClick={handleSignout}>Logout</Button>
            </Toolbar>
          </AppBar>
        </div>
      );
    };

    const getRenderedTable = () => {

      let newGamesTabStyle;
      let newGamesTabContentStyle;
      let inProgressGamesTabStyle;
      let inProgressGamesTabContentStyle;
      let settingsTabStyle;
      let settingsTabContentStyle;

      switch (selectedTab) {
        case 'newGameTabSelect':
          newGamesTabStyle = tabLinkSelected;
          newGamesTabContentStyle = selectedTabContent;
          inProgressGamesTabStyle = tabLinkUnselected;
          inProgressGamesTabContentStyle = unselectedTabContent;
          settingsTabStyle = tabLinkUnselected;
          settingsTabContentStyle = unselectedTabContent;
          break;
        default:
        case 'inProgressGameTabSelect':
          newGamesTabStyle = tabLinkUnselected;
          newGamesTabContentStyle = unselectedTabContent;
          inProgressGamesTabStyle = tabLinkSelected;
          inProgressGamesTabContentStyle = selectedTabContent;
          settingsTabStyle = tabLinkUnselected;
          settingsTabContentStyle = unselectedTabContent;
          break;
        case 'settingsTabSelect':
          newGamesTabContentStyle = unselectedTabContent;
          newGamesTabStyle = tabLinkUnselected;
          inProgressGamesTabStyle = tabLinkUnselected;
          inProgressGamesTabContentStyle = unselectedTabContent;
          settingsTabStyle = tabLinkSelected;
          settingsTabContentStyle = selectedTabContent;
          break;
      }

      return (
        <div>
          <div style={tab}>
            <button style={newGamesTabStyle} onClick={handleSelectTab} id='newGameTabSelect'>New Games</button>
            <button style={inProgressGamesTabStyle} onClick={handleSelectTab} id='inProgressGameTabSelect' >In Progress Games</button>
            <button style={settingsTabStyle} onClick={handleSelectTab} id='settingsTabSelect' >Tools & Settings</button>
          </div>
          <div id='newGameContent' style={newGamesTabContentStyle}>
            <NewGames />
          </div>
          <div id='inProgressGamesContent' style={inProgressGamesTabContentStyle}>
            <ExistingGames
              onToggleSelectGame={handleToggleSelectGame}
            />
          </div>
          <div id='settingsContent' style={settingsTabContentStyle}>
            <PuzzleUpload />
          </div>
        </div>
      );
    };

    const toolbar = renderToolbar();

    const renderedTable = getRenderedTable();

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
          {toolbar}
          {renderedTable}
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
    onDeleteGames: deleteGames,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);


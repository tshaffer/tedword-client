import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { AppState, UiState, UsersMap } from '../types';
import { getAppState, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';

export interface LoginProps {
  appState: AppState,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
}

const Login = (props: LoginProps) => {

  const getSelectedUserName = (userNames: string[]) => {
    const userNameFromRedux: string = props.appState.userName;
    return userNameFromRedux === '' ? userNames[0] : userNameFromRedux;
  };

  const getUserNames = (): string[] => {
    const userNames: string[] = [];
    for (const userName in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
        userNames.push(userName);
      }
    }
    return userNames;
  };

  const getUserOptions = (userNames: string[]) => {
    const userOptions = userNames.map((userName: string) => {
      return getUserOption(userName);
    });
    return userOptions;
  };

  const getUserOption = (userName: string) => {
    return (
      <option
        key={userName}
        value={userName}
      >
        {userName}
      </option>
    );
  };

  const handleUserChange = (event) => {
    props.onSetUserName(event.target.value);
  };


  const handleLogin = () => {
    props.onSetUiState(UiState.SelectPuzzleOrBoard);
    localStorage.setItem('userName', props.appState.userName);
  };


  const renderSelectUser = () => {

    const userNames: string[] = getUserNames();
    if (userNames.length === 0) {
      return null;
    }

    const userOptions = getUserOptions(userNames);

    const selectedUserName = getSelectedUserName(userNames);

    return (
      <div>

        <p>Select user</p>
        <select
          tabIndex={-1}
          value={selectedUserName}
          onChange={handleUserChange}
        >
          {userOptions}
        </select>
        <p>
          <button
            type="button"
            onClick={handleLogin}
          >
            Login
          </button>
        </p>
      </div>
    );

  };


  return renderSelectUser();
};

function mapStateToProps(state: any) {
  return {
    users: getUsers(state),
    appState: getAppState(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSetUserName: setUserName,
    onSetUiState: setUiState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


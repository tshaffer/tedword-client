import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Select from 'react-select';

import { AppState, UiState, User, UsersMap } from '../types';
import { setStartupAppState } from '../controllers';
import { getAppState, getUsers } from '../selectors';
import { setUiState, setUserName } from '../models';
import { isNil } from 'lodash';

export interface LoginProps {
  appState: AppState,
  users: UsersMap;
  onSetUserName: (userName: string) => any;
  onSetUiState: (uiState: UiState) => any;
  onSetStartupAppState: () => any;
}

const Login = (props: LoginProps) => {

  const [selectedUser, setSelectedUser] = React.useState<User>(null);

  const getUsers = (): User[] => {
    const users: User[] = [];
    for (const userName in props.users) {
      if (Object.prototype.hasOwnProperty.call(props.users, userName)) {
        const user: User = props.users[userName];
        users.push(user);
      }
    }
    return users;
  };

  const getUserOptions = (users: User[]) => {
    const userOptions = users.map((user: User) => {
      return {
        value: user,
        label: user.userName,
      };
    });
    return userOptions;
  };

  // https://react-select.com/typescript
  // https://github.com/JedWatson/react-select/blob/master/packages/react-select/src/types.ts
  const handleUserChange = (selectedUser: any) => {
    console.log('handleUserChange, selected user is:', selectedUser.value);
    setSelectedUser(selectedUser.value);
  };

  const handleLogin = () => {
    if (isNil(selectedUser)) {
      console.log('Select a user then click on Login');
      return;
    }
    localStorage.setItem('userName', selectedUser.userName);
    props.onSetUserName(selectedUser.userName);
    props.onSetStartupAppState();
  };

  const renderSelectUser = () => {

    const users: User[] = getUsers();
    const userOptions = getUserOptions(users);
  
    return (
      <div>
        <p>Select user</p>
        <Select
          options={userOptions}
          onChange={handleUserChange}
          placeholder={'Select a user'}
        />
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
    onSetStartupAppState: setStartupAppState,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);


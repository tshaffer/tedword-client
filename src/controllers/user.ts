import axios from 'axios';
import { UiState, User } from '../types';
import { addUser, setUiState, setUserName } from '../models';

import { apiUrlFragment, serverUrl } from '../index';
import { isNil, isString } from 'lodash';

export const loadUsers = () => {
  return (dispatch: any) => {

    const path = serverUrl + apiUrlFragment + 'users';

    return axios.get(path)
      .then((usersResponse: any) => {
        const users: User[] = (usersResponse as any).data;
        // TEDTODO - add all in a single call
        for (const user of users) {
          dispatch(addUser(user.userName, user));
        }
        if (users.length > 0) {
          
          let selectedUser = '';

          // if there's a stored / persistent userName and it matches a user name in the downloaded list of users,
          // bypass the signin screen
          const storedUserName = localStorage.getItem('userName');
          if (isString(storedUserName)) {
            const matchedUser = users.find(o => o.userName === storedUserName);

            if (!isNil(matchedUser)) {
              dispatch(setUserName(matchedUser.userName));
              dispatch(setUiState(UiState.SelectPuzzleOrBoard));
              return;
            } else {
              selectedUser = users[0].userName;
            }

          } else {
            selectedUser = users[0].userName;
          }
          dispatch(setUserName(selectedUser));
        }
      });
  };
};

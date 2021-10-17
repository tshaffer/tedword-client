import axios from 'axios';
import { User } from '../types';
import { addUser, setUserName } from '../models';

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

          const storedUserName = localStorage.getItem('userName');
          if (isString(storedUserName)) {
            const matchedUser = users.find(o => o.userName === storedUserName);
            if (!isNil(matchedUser)) {
              selectedUser = matchedUser.userName;
            }
          } else {
            selectedUser = users[0].userName;
          }
          dispatch(setUserName(selectedUser));
        }
      });
  };
};

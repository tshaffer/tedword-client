import axios from 'axios';
import { User } from '../types';
import { addUser, setUserName } from '../models';

import { apiUrlFragment, serverUrl } from '../index';

export const loadUsers = () => {
  return (dispatch: any) => {
    // const path = 'http://localhost:8888/api/v1/users';
    const path = serverUrl + apiUrlFragment + 'users';

    axios.get(path)
      .then((usersResponse: any) => {
        const users: User[] = (usersResponse as any).data;
        // TEDTODO - add all in a single call
        for (const user of users) {
          dispatch(addUser(user.userName, user));
        }
        if (users.length > 0) {
          dispatch(setUserName(users[0].userName));
        }
      });
  };
};

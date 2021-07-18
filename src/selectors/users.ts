import {
  TedwordState,
  UsersMap,
} from '../types';

export const getUsers = (state: TedwordState): UsersMap => {
  return state.users;
};

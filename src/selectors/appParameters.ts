import {
  AppParameters,
  StartPage,
  TedwordState
} from '../types';

export const getAppParameters = (state: TedwordState): AppParameters => {
  return state.appParameters;
};

export const getStartPage = (state: TedwordState): StartPage => {
  return getAppParameters(state).startPage;
};

export const getStartupBoardId = (state: TedwordState): string | null => {
  return getAppParameters(state).startupBoardId;
};

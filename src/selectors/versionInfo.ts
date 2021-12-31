import {
  VersionInfo,
  TedwordState
} from '../types';

export const getVersionInfo = (state: TedwordState): VersionInfo => {
  return state.versionInfo;
};

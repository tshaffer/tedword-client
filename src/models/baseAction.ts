/* eslint-disable @typescript-eslint/ban-types */
import { Action } from 'redux';

export interface TedwordBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {} | null;
}


export interface TedwordModelBaseAction<T> extends Action {
  type: string;   // override Any - must be a string
  payload: T;
  error?: boolean;
  meta?: {};
}

export interface TedwordPlaylistAction<T> extends TedwordBaseAction {
  payload: T;
}

export interface TedwordApiAction<T> extends TedwordBaseAction {
  payload: T;
}




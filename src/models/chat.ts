import { cloneDeep } from 'lodash';
import { Chat, ChatMember, ChatState } from '../types';
import { TedwordModelBaseAction } from './baseAction';

// ------------------------------------
// Constants
// ------------------------------------
export const SET_JOINED = 'SET_JOINED';
export const ADD_CHAT = 'ADD_CHAT';
export const ADD_CHAT_MEMBER = 'ADD_CHAT_MEMBER';

// ------------------------------------
// Actions
// ------------------------------------

export interface SetJoinedPayload {
  joined: boolean;
}

export const setJoined = (
  joined: boolean,
): any => {
  return {
    type: SET_JOINED,
    payload: {
      joined,
    },
  };
};

export interface AddChatPayload {
  sender: string;
  message: string;
  timestamp: Date;
}

export const addChat = (
  sender: string,
  message: string,
  timestamp: Date,
): any => {
  return {
    type: ADD_CHAT,
    payload: {
      sender,
      message,
      timestamp,
    }
  };
};

export interface AddChatMemberPayload {
  userName: string;
}

export const addChatMember = (
  userName: string,
): any => {
  return {
    type: ADD_CHAT_MEMBER,
    payload: {
      userName,
    }
  };
};

// ------------------------------------
// Reducer
// ------------------------------------

const initialState: ChatState = {
  joined: false,
  members: [],
  chats: [],
};

export const chatStateReducer = (
  state: ChatState = initialState,
  action: TedwordModelBaseAction<SetJoinedPayload & AddChatPayload & AddChatMemberPayload>
): ChatState => {
  switch (action.type) {
    case SET_JOINED: {
      return { ...state, joined: action.payload.joined };
    }
    case ADD_CHAT: {
      const newChat: Chat = { ...action.payload };
      const newState = cloneDeep(state);
      newState.chats.push(newChat);
      return newState;
    }
    case ADD_CHAT_MEMBER: {
      const newChatMember: ChatMember = { ...action.payload };
      const newState = cloneDeep(state);
      newState.members.push(newChatMember);
      return newState;
    }
    default:
      return state;
  }
};

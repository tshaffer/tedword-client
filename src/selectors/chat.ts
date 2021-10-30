import {
  Chat,
  ChatMember,
  ChatState,
  TedwordState
} from '../types';

export const getChatState = (state: TedwordState): ChatState => {
  return state.chat;
};

export const getJoinedChat = (state: TedwordState): boolean => {
  return getChatState(state).joined;
};

export const getChatMembers = (state: TedwordState): ChatMember[] => {
  return getChatState(state).members;
};

export const getChats = (state: TedwordState): Chat[] => {
  return getChatState(state).chats;
};

import axios from 'axios';
import { apiUrlFragment, serverUrl } from '../types';

import { pusher } from '../components/BoardTop';

import {
  addChat,
  addChatMember,
  setJoined
} from '../models';

let chatMembers: any;
let userName: string = '';

export const joinChat = (boardid: string, username: string) => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'joinChat';
    axios.post(
      path,
      {
        boardid,
        username
      },
    ).then((response) => {
      dispatch(setJoined(true));
      userName = username;

      console.log('joinChat: ', 'presence-' + boardid);
      const channel = pusher.subscribe('presence-' + boardid);

      channel.bind('pusher:subscription_succeeded', (members: any) => {
        console.log('controllers/chat.ts - pusher:subscription_succeeded');
        console.log(channel.members);
        chatMembers = channel.members;
        const chatMemberNames: string[] = Object.keys(chatMembers.members);
        for (const chatMemberName of chatMemberNames) {
          dispatch(addChatMember(chatMemberName));
        }
      });

      // User joins chat
      channel.bind('pusher:member_added', (member: any) => {
        console.log(`${member.id} joined the chat`);
        dispatch(addChatMember(member.id));
      });

      // Listen for chat messages
      dispatch(listen(boardid));
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });
  };
};

export const sendMessage = (newMessage: string) => {
  return (dispatch: any, getState: any) => {
    const boardid = getState().appState.boardId;
    console.log('sendMessage');
    console.log('presence-' + boardid);
    const path = serverUrl + apiUrlFragment + 'sendMessage';
    axios.post(
      path,
      {
        boardid,
        username: userName,
        message: newMessage,
      }
    ).then((response) => {
      console.log('response to sendMessage', response);
    });
  };
};

const listen = (boardid: string) => {
  return (dispatch: any) => {
    console.log('listen');
    console.log('presence-' + boardid);
    const channel = pusher.subscribe('presence-' + boardid);
    channel.bind('message_sent', (data) => {
      console.log('messageReceived', data);
      dispatch(addChat(data.username, data.message, new Date()));
    });
  };
};

import axios from 'axios';
import { apiUrlFragment, serverUrl } from '../types';

import { pusher } from '../components/Home';

import { addChatMember, setJoined } from '../models';

let chatMembers: any;
let userName: string = '';

export const joinChat = (username: string) => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'joinChat';
    axios.post(
      path,
      { username },
    ).then((response) => {
      dispatch(setJoined(true));
      userName = username;
      const channel = pusher.subscribe('presence-groupChat');
      channel.bind('pusher:subscription_succeeded', (members: any) => {
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
      listen();
      return;
    }).catch((error) => {
      console.log('error');
      console.log(error);
      return;
    });
  };
};

export const sendMessage = (newMessage: string) => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'sendMessage';
    axios.post(
      path,
      {
        username: userName,
        message: newMessage,
      }
    ).then((response) => {
      console.log('response to sendMessage', response);
    });
  };
};

const listen = () => {
  const channel = pusher.subscribe('presence-groupChat');
  channel.bind('message_sent', (data) => {
    console.log('messageReceived', data);
    // messages.push({
    //   username: data.username,
    //   message: data.message
    // });
  });
}
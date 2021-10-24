import axios from 'axios';
import { apiUrlFragment, serverUrl } from '../types';

import { pusher } from '../components/Home';

let chatMembers: any;
let userName: string = '';

export const joinChat = (username: string) => {
  return (dispatch: any) => {
    const path = serverUrl + apiUrlFragment + 'joinChat';
    axios.post(
      path,
      { username },
    ).then((response) => {
      userName = username;
      const channel = pusher.subscribe('presence-groupChat');
      channel.bind('pusher:subscription_succeeded', (members: any) => {
        chatMembers = channel.members;
        console.log('chatMembers: ', chatMembers);
        console.log('members', members);
      });
      // User joins chat
      channel.bind('pusher:member_added', (member: any) => {
        console.log(`${member.id} joined the chat`);
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
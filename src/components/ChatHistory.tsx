import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/app.css';

import {
  Chat,
  ChatsAtTime,
  ChatsBySender,
  OrderedChats,
} from '../types';

import {
  getChats,
  getCurrentUser,
} from '../selectors';
import { isNil } from 'lodash';
import _ = require('lodash');

export interface ChatHistoryProps {
  currentUser: string;
  chats: Chat[];
}

const ChatHistory = (props: ChatHistoryProps) => {

  const getDateTimeString = (dt: Date): string => {
    const month = (dt.getMonth() + 1).toString();
    const d = dt.getDate().toString();
    const y = (dt.getFullYear() - 2000).toString();

    let h = dt.getHours();
    let amPM = 'AM';
    if (h === 0) {
      h = 12;
    } else if (h === 12) {
      amPM = 'PM';
    } else if (h > 12) {
      h = h - 12;
      amPM = 'PM';
    }
    const hS: string = h.toString();

    const minute = dt.getMinutes().toString();
    return (month + '/' + d + '/' + y + ', ' + hS + ':' + minute + ' ' + amPM);
  };



  const msecToTriggerNewMessageGroup = 60000;

  // const buildOrderedChats: OrderedChats = () => {
  const getChatHistory: any = () => {

    console.log('props.chats');
    console.log(props.chats);

    const orderedChats: OrderedChats = {
      chatsAtTime: [],
    };

    let chatsAtTime: ChatsAtTime;
    let chatsBySender: ChatsBySender;

    let timeOfPriorMessage: number = new Date(0).getTime();
    let lastSender = '';

    for (const chat of props.chats) {

      const { sender, message, timestamp } = chat;

      const timeOfCurrentMessage = timestamp.getTime();
      const startNewTimeGroup: boolean = (timeOfCurrentMessage - timeOfPriorMessage) > msecToTriggerNewMessageGroup;

      if (startNewTimeGroup) {

        // save prior group of chats at a specific time
        if (!isNil(chatsAtTime)) {

          // save prior set of chats by person
          if (!isNil(chatsBySender)) {
            chatsAtTime.chatsBySender.push(chatsBySender);
          }
          orderedChats.chatsAtTime.push(chatsAtTime);

        }

        // initialize data for new chat time
        chatsAtTime = {
          chatsTime: timestamp,
          chatsBySender: [],
        };

        chatsBySender = null;
        lastSender = '';
      }

      if (sender !== lastSender) {

        // save chats by prior sender
        if (!isNil(chatsBySender)) {
          chatsAtTime.chatsBySender.push(chatsBySender);
        }

        // initialize data for new sender
        chatsBySender = {
          sender,
          messages: [],
        };
      }

      chatsBySender.messages.push(message);

      timeOfPriorMessage = timeOfCurrentMessage;
      lastSender = sender;
    }

    // flush out last messages - is this always safe??
    if (!isNil(orderedChats) && !isNil(orderedChats.chatsAtTime) && !isNil(chatsAtTime) && !isNil(chatsAtTime.chatsBySender) && !isNil(chatsBySender)) {
      chatsAtTime.chatsBySender.push(chatsBySender);
      orderedChats.chatsAtTime.push(chatsAtTime);
    }

    console.log(orderedChats);
    return orderedChats as OrderedChats;
  };

  const renderChatMessageFromMe = (message: string) => {
    return (
      <div className='sender-me-my-message'>
        {message}
      </div>
    );
  };

  const renderChatMessageFromOther = (message: string) => {
    return (
      <div className='sender-other-other-message'>
        {message}
      </div>
    );
  };

  const renderChatMessageOtherSender = (sender: string) => {
    return (
      <div className='sender-name'>
        {sender}
      </div>
    );
  };

  const renderChatMessageAtTime = (timestamp: Date) => {
    return (
      <div className='sender-date-time'>
        {getDateTimeString(timestamp)}
      </div>
    );
  };

  const renderChatHistory = (chatHistory: OrderedChats) => {

    const chatJSX: any = [];

    for (const chatsAtTime of chatHistory.chatsAtTime) {
      const { chatsTime, chatsBySender } = chatsAtTime;
      const chatMessageAtTime = renderChatMessageAtTime(chatsTime)
      chatJSX.push(chatMessageAtTime);

      for (const chatMessagesBySender of chatsBySender) {
        if (chatMessagesBySender.sender === props.currentUser) {
          for (const message of chatMessagesBySender.messages) {
            const chatMessageByMe = renderChatMessageFromMe(message);
            chatJSX.push(chatMessageByMe);
          }
        } else {
          const otherSenderJSX = renderChatMessageOtherSender(chatMessagesBySender.sender);
          chatJSX.push(otherSenderJSX);
          for (const message of chatMessagesBySender.messages) {
            const chatMessageByOther = renderChatMessageFromOther(message);
            chatJSX.push(chatMessageByOther);
          }
        }
      }
    }

    return (
      <div className='chat-body'>
        {chatJSX}
      </div>
    );
  };

  const chatHistory = getChatHistory();

  const chatHistoryJsx = renderChatHistory(chatHistory);

  return (
    <div className='chat-body'>
      {chatHistoryJsx}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    chats: getChats(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatHistory);


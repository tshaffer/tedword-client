import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/app.css';
import { getCurrentUser, getChatMembers, getChats } from '../selectors';
import { sendMessage } from '../controllers';
import { ChatMember, Chat } from '../types';

import ChatHistory from './ChatHistory';

export interface ChatWindowProps {
  currentUser: string;
  chatMembers: ChatMember[];
  chats: Chat[];
  onSendMessage: (message: string) => any;
}

let chatBubbleRef;

const ChatWindow = (props: ChatWindowProps) => {

  chatBubbleRef = React.createRef();

  const [message, setMessage] = React.useState<string>('');

  const openChatBubble = () => {
    chatBubbleRef.current.classList.toggle('open');
  };

  const closeChatBubble = () => {
    chatBubbleRef.current.classList.toggle('open');
  };

  const handleMessageChanged = (event) => {
    setMessage(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      console.log('send message:', message);
      props.onSendMessage(message);
      setMessage('');
    }
  };

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

  const getSenderMe = (chat: Chat): any => {
    return (
      <div className='sender-me' key={chat.timestamp.toString() + 'me'}>
        <div className='my-message'>
          {chat.message}
        </div>
      </div>
    );
  };

  const getSenderOther = (chat: Chat): any => {
    return (
      <div className='sender-other' key={chat.timestamp.toString() + chat.sender}>
        <div className='sender-date-time'>
          {getDateTimeString(chat.timestamp)}
        </div>
        <div className='sender-name'>
          {chat.sender}
        </div>
        <div className='other-message'>
          {chat.message}
        </div>
      </div>
    );
  };

  const getChat = (chat: Chat): any => {
    if (chat.sender === props.currentUser) {
      return getSenderMe(chat);
    } else {
      return getSenderOther(chat);
    }
  };

  const getChatHistory = () => {
    const allChats = props.chats.map((chat: Chat) => {
      return getChat(chat);
    });
    return allChats;
  };

  const msecToTriggerNewMessageGroup = 60000;

  const getChatHistoryTest = () => {
    let timeOfPriorMessage: number = new Date(0).getTime();
    let lastSender: string = '';

    for (const chat of props.chats) {
      const { sender, message, timestamp } = chat;
      const timeOfCurrentMessage = timestamp.getTime();
      const startNewTimeGroup = (timeOfCurrentMessage - timeOfPriorMessage) > msecToTriggerNewMessageGroup;
      if (startNewTimeGroup) {
        console.log('start new time group at: ', timestamp);
      } else {
        console.log('continue time group as the last message was at: ', timestamp);
      }
      timeOfPriorMessage = timeOfCurrentMessage;
      if ((sender !== lastSender) || startNewTimeGroup) {
        console.log('start new sender group: ', sender);
      } else {
        console.log('continue sender group: ', sender);
      }
      lastSender = sender;
    }
  };

  getChatHistoryTest();

  const chatHistory = getChatHistory();

  const getChatParticipantList = () => {

    const chatParticipantList: string[] = [];

    for (const chatMember of props.chatMembers) {
      if (chatMember.userName !== props.currentUser) {
        chatParticipantList.push(chatMember.userName);
      }
    }
    if (chatParticipantList.length === 0) {
      chatParticipantList.push('Chat Window');
    }

    let chatParticipantListStr: string = '';
    for (let i = 0; i < chatParticipantList.length; i++) {
      chatParticipantListStr += chatParticipantList[i];
      if (i < (chatParticipantList.length - 1)) {
        chatParticipantListStr += ', ';
      }
    }

    return (
      <p>{chatParticipantListStr}</p>
    );
  };

  const renderChatParticipants = () => {

    const chatParticipantListJsx: any = getChatParticipantList();

    return (
      <div className='user-status-info'>
        <a href='#'>
          {chatParticipantListJsx}
        </a>
      </div>
    );
  };

  // <ChatHistory />
  //           {chatHistory}

  return (
    <div id='chat-bubble' ref={chatBubbleRef}>
      <div id='chat-container'>
        <div className='chat-header'>
          <div className='user-avatar' onClick={openChatBubble}>
            <div className='img-container'>
              <img src='https://source.unsplash.com/random/35x35' />
            </div>
            {renderChatParticipants()}
          </div>
          <div className='chat-comm'>
            <a href='#' onClick={closeChatBubble}>
              <img src='../icons/closeIcon.svg' />
            </a>
          </div>
        </div>
        <div className='chat-body'>
          <ChatHistory />
        </div>

        <div className='chat-footer'>
          <input
            type='text'
            value={message}
            onChange={handleMessageChanged}
            onKeyDown={handleKeyDown}
            placeholder={'Type a message...'}
          />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    chatMembers: getChatMembers(state),
    chats: getChats(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSendMessage: sendMessage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);

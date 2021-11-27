import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../styles/app.css';
import { getCurrentUser, getJoinedChat, getChatMembers, getChats } from '../selectors';
import { joinChat, sendMessage } from '../controllers';
import { ChatMember, Chat } from 'src';

export interface ChatWindowProps {
  currentUser: string;
  joined: boolean;
  chatMembers: ChatMember[];
  chats: Chat[];
  onJoinChat: (userName: string) => any;
  onSendMessage: (message: string) => any;
}

let chatBubbleRef;

const ChatWindow = (props: ChatWindowProps) => {

  chatBubbleRef = React.createRef();

  const [chatBubbleOpen, setChatBubbleOpen] = React.useState<boolean>(false);

  const [message, setMessage] = React.useState<string>('');

  const openChatBubble = () => {
    setChatBubbleOpen(true);
    chatBubbleRef.current.classList.toggle('open');
    props.onJoinChat(props.currentUser);
  };

  const closeChatBubble = () => {
    setChatBubbleOpen(false);
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

  const getSenderMe = (chat: Chat): any => {
    return (
      <div className='sender-me'>
        <div className='my-message'>
          {chat.message}
        </div>
      </div>
    );
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

  const getSenderOther = (chat: Chat): any => {
    return (
      <div className='sender-other'>
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

  const chatHistory = getChatHistory();

  return (
    <div id='chat-bubble' ref={chatBubbleRef}>
      <div id='chat-container'>
        <div className='chat-header'>
          <div className='user-avatar' onClick={openChatBubble}>
            <div className='img-container'>
              <img src='https://source.unsplash.com/random/35x35' />
            </div>
            <div className='user-status-info'>
              <a href='#'>
                John Doe
              </a>
              <p>Active now</p>
            </div>
          </div>
          <div className='chat-comm'>
            <a href='#' onClick={closeChatBubble}>
              <img src='../icons/closeIcon.svg' />
            </a>
          </div>
        </div>
        <div className='chat-body'>
          {chatHistory}
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
    joined: getJoinedChat(state),
    chatMembers: getChatMembers(state),
    chats: getChats(state),
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onJoinChat: joinChat,
    onSendMessage: sendMessage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);

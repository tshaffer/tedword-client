import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Chat,
  ChatMember,
} from '../types';

import { joinChat, sendMessage } from '../controllers/chat';
import {
  getChatMembers,
  getChats,
  getCurrentUser,
  getJoinedChat,
} from '../selectors';

export interface ChatProps {
  currentUser: string;
  joined: boolean;
  chatMembers: ChatMember[];
  chats: Chat[];
  onJoinChat: (userName: string) => any;
  onSendMessage: (message: string) => any;
}

let chatProps;

const Chat = (props: ChatProps) => {

  chatProps = props;

  const [message, setMessage] = React.useState<string>('');

  const padded = {
    margin: '4px',
  };

  const handleJoinChat = () => {
    props.onJoinChat(props.currentUser);
  };

  const handleMessageChanged = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log('Send message ' + message);
    props.onSendMessage(message);
    setMessage('');
  };

  const getNotJoinedChatUI = () => {
    return (
      <div>
        <button
          style={padded}
          onClick={handleJoinChat}
        >
          Join Chat
        </button>
        <br />
      </div>
    );
  };


  const getChatTo = () => {
    const chatUsers: string[] = props.chatMembers.map((chatMember: ChatMember) => {
      return chatMember.userName;
    });
    const memberList = chatUsers.join(', ');
    const chatTo = 'To: ' + memberList;
    return chatTo;
  };

  const getChatMessage = (chat: Chat): JSX.Element => {
    return (
      <p>{chat.message}</p>
    );
  };

  const getChatHistory = (): JSX.Element[] => {
    const chatHistoryJsx: JSX.Element[] = props.chats.map( (chat: Chat) => {
      return getChatMessage(chat);
    }); 
    return chatHistoryJsx;
  };

  const getChatMessageToSend = () => {
    return (
      <div>
        <span>Message:</span>
        <input
          type='text'
          value={message}
          onChange={handleMessageChanged}
        />
        <button
          style={padded}
          onClick={handleSendMessage}
        >
          Send Message
        </button>
      </div>
    );
  };

  const getJoinedChatUI = () => {
    const chatTo = getChatTo();
    const chatHistory: JSX.Element[] = getChatHistory();
    const chatMessageToSend = getChatMessageToSend();
    return (
      <div>
        <p>{chatTo}</p>
        <p>History here</p>
        <div>{chatHistory}</div>
        {chatMessageToSend}
      </div>
    );
  };

  const getChatJsx = () => {
    if (!props.joined) {
      return getNotJoinedChatUI();
    } else {
      return getJoinedChatUI();
    }
  };

  const chatJsx = getChatJsx();
  return (
    <div style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
      <h3>Chat</h3>
      {chatJsx}
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Chat,
  ChatMember,
} from '../types';

import ModelessDialog from './ModelessDialog';

import { joinChat, sendMessage } from '../controllers/chat';
import {
  getChatMembers,
  getChats,
  getCurrentUser,
  getJoinedChat,
} from '../selectors';
import ChatWindow from './ChatWindow';

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

  const chatDialogStyle = {
    width: '60rem',
    height: '20rem',
    boxShadow: 'rgba(0,0,0,.3) 0 0.3rem 1rem',
    background: 'red'
  };

  const container = {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '720px',
    padding: '1em',
  };

  const content = {
    marginLeft: '5em',
    color: 'white',
  };

  const handleJoinChat = () => {
    console.log('handleJoinChat invoked in Chat.tsx');
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
    const chatUsers: string[] = [];
    for (const chatMember of props.chatMembers) {
      const { userName } = chatMember;
      // filter out duplicates
      if (chatUsers.indexOf(userName) < 0) {
        chatUsers.push(userName);
      }
    }
    const indexOfMe: number = chatUsers.indexOf(props.currentUser);
    if (indexOfMe >= 0) {
      chatUsers.splice(indexOfMe, 1);
    }

    const memberList = chatUsers.join(', ');
    const chatTo = 'To: ' + memberList;
    return chatTo;
  };

  const getChatMessage = (chat: Chat): JSX.Element => {
    return (
      <p>{'From: ' + chat.sender + '- ' + chat.message}</p>
    );
  };

  const getChatHistory = (): JSX.Element[] => {
    const chatHistoryJsx: JSX.Element[] = props.chats.map((chat: Chat) => {
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

  const onCloseChat = () => {
    console.log('onCloseChat invoked');
  };

  const getJoinedChatUI = () => {
    // const chatTo = getChatTo();
    // const chatHistory: JSX.Element[] = getChatHistory();
    // const chatMessageToSend = getChatMessageToSend();
    // return (
    //   <div>
    //     <p>{chatTo}</p>
    //     <div>{chatHistory}</div>
    //     {chatMessageToSend}
    //   </div>
    // );
    /*
        <div style={content}>
          <h2>This is a dialog box</h2>
          <button onClick={onCloseChat}>Close dialog</button>
        </div>
    */
    //             <button onClick={onCloseChat}>Close dialog</button>

    return (
      <div>
        <ModelessDialog
          isOpen={true}
          onClose={onCloseChat}
          noBackdrop={true}
          clickBackdropToClose={false}
          style={chatDialogStyle}
          containerClassName={container}>
          <div style={content}>
            <ChatWindow />
          </div>
        </ModelessDialog>
      </div >
    );
  };

  const getChatJsx = () => {
    // if (!props.joined) {
    //   return getNotJoinedChatUI();
    // } else {
    //   return getJoinedChatUI();
    // }
    return getJoinedChatUI();
  };

  const chatJsx = getChatJsx();
  //     <div style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
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

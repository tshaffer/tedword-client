import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  AppState,
  Chat,
  ChatMember,
} from '../types';

import ModelessDialog from './ModelessDialog';

import { joinChat, sendMessage } from '../controllers/chat';
import {
  getAppState,
  getChatMembers,
  getChats,
  getCurrentUser,
  getJoinedChat,
} from '../selectors';
import ChatWindow from './ChatWindow';

export interface ChatProps {
  appState: AppState,
  currentUser: string;
  joined: boolean;
  chatMembers: ChatMember[];
  chats: Chat[];
  onJoinChat: (boardId: string, userName: string) => any;
  onSendMessage: (message: string) => any;
}

let chatProps;

const Chat = (props: ChatProps) => {

  chatProps = props;

  React.useEffect(() => {
    console.log('Chat useEffect invoked');
    props.onJoinChat(props.appState.boardId, props.currentUser);
  }, []);

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

  const onCloseChat = () => {
    console.log('onCloseChat invoked');
  };

  const getChatJsx = () => {
    return (
      <div>
        <ModelessDialog
          isOpen={true}
          onClose={onCloseChat}
          noBackdrop={true}
          clickBackdropToClose={false}
          style={chatDialogStyle}
          containerClassName={container}>
          <ChatWindow />
        </ModelessDialog>
      </div >
    );
  };

  const chatJsx = getChatJsx();

  return (
    <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
      {chatJsx}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    appState: getAppState(state),
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

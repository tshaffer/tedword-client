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

  const getChatJsx = () => {
    return (
      <ModelessDialog>
        <ChatWindow />
      </ModelessDialog>
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

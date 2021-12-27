import * as React from 'react';
import { connect } from 'react-redux';

import '../../styles/app.css';

import { ChatMember } from '../../types';
import { getCurrentUser, getChatMembers } from '../../selectors';

interface ChatHeaderPropsFromParent {
  onOpenChatBubble: () => any;
  onCloseChatBubble: () => any;
}

export interface ChatHeaderProps extends ChatHeaderPropsFromParent{
  currentUser: string;
  chatMembers: ChatMember[];
}

const ChatHeader = (props: ChatHeaderProps) => {

  const renderChatParticipantList = () => {

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

    const chatParticipantListJsx: any = renderChatParticipantList();

    return (
      <div className='user-status-info'>
        <a href='#'>
          {chatParticipantListJsx}
        </a>
      </div>
    );
  };

  return (
    <div className='chat-header'>
      <div className='user-avatar' onClick={props.onOpenChatBubble}>
        <div className='img-container'>
          <img src='https://source.unsplash.com/random/35x35' />
        </div>
        {renderChatParticipants()}
      </div>
      <div className='chat-comm'>
        <a href='#' onClick={props.onCloseChatBubble}>
          <img src='../../icons/closeIcon.svg' />
        </a>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    currentUser: getCurrentUser(state),
    chatMembers: getChatMembers(state),
  };
}

export default connect(mapStateToProps)(ChatHeader);

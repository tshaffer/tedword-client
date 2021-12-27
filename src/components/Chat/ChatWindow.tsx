import * as React from 'react';

import '../../styles/app.css';

import ChatHeader from './ChatHeader';
import ChatHistory from './ChatHistory';
import ChatFooter from './ChatFooter';

let chatWindowRef;

const ChatWindow = () => {

  chatWindowRef = React.createRef();

  const openChatBubble = () => {
    chatWindowRef.current.classList.toggle('open');
  };

  const closeChatBubble = () => {
    chatWindowRef.current.classList.toggle('open');
  };

  return (
    <div id='chat-bubble' ref={chatWindowRef}>
      <ChatHeader onOpenChatBubble={openChatBubble} onCloseChatBubble={closeChatBubble} />
      <ChatHistory />
      <ChatFooter />
    </div>
  );
};

export default ChatWindow;

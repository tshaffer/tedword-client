import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { joinChat, sendMessage } from '../controllers/chat';

export interface ChatProps {
  chatUser: string;
  onJoinChat: (userName: string) => any;
  onSendMessage: (message: string) => any;
}

const Chat = (props: ChatProps) => {

  const [chatUser, setChatUser] = React.useState<string>('');
  const [message, setMessage] = React.useState<string>('');

  const padded = {
    margin: '4px',
  };

  const handleChatUserChanged = (event) => {
    setChatUser(event.target.value);
  };

  const handleJoinChat = () => {
    console.log('Add ' + chatUser + ' to chat');
    props.onJoinChat(chatUser);
  };

  const handleMessageChanged = (event) => {
    setMessage(event.target.value);
  };

  const handleSendMessage = () => {
    console.log('Send message ' + message);
    props.onSendMessage(message);
  };

  return (
    <div style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
      <span>Name:</span>
      <input
        type='text'
        value={chatUser}
        onChange={handleChatUserChanged}
      />
      <button
        style={padded}
        onClick={handleJoinChat}
      >
        Join Chat
      </button>
      <br/>
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

function mapStateToProps(state: any) {
  return {
    chatUser: 'Ted',
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onJoinChat: joinChat,
    onSendMessage: sendMessage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import '../../styles/app.css';

import { sendMessage } from '../../controllers';

export interface ChatFooterProps {
  onSendMessage: (message: string) => any;
}

const ChatFooter = (props: ChatFooterProps) => {

  const [message, setMessage] = React.useState<string>('');

  const handleMessageChanged = (event) => {
    setMessage(event.target.value);
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     console.log('send message:', message);
  //     props.onSendMessage(message);
  //     setMessage('');
  //   }
  // };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    // if (event.charCode === 13) {
    if (event.key === 'Enter') {
      props.onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className='chat-footer'>
      <input
        type='text'
        value={message}
        onChange={handleMessageChanged}
        onKeyPress={handleKeyPress}
        placeholder={'Type a message...'}
      />
    </div>

  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    onSendMessage: sendMessage,
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatFooter);

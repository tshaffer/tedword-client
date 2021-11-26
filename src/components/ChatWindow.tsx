import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CSSProperties } from 'hoist-non-react-statics/node_modules/@types/react';

import '../styles/app.css';

export interface ChatWindowProps {
  placeholder: string;
}


let chatBubbleRef;

const ChatWindow = () => {

  chatBubbleRef = React.createRef();

  const [chatBubbleOpen, setChatBubbleOpen] = React.useState<boolean>(false);

  const openChatBubble = () => {
    setChatBubbleOpen(true);
    chatBubbleRef.current.classList.toggle('open');
  };

  const closeChatBubble = () => {
    setChatBubbleOpen(false);
    chatBubbleRef.current.classList.toggle('open');
  };

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
          <div className='sender-other'>
            <div className='user-avatar'>
              <div className='img-container'>
                <img src='https://source.unsplash.com/random/35x35' />
              </div>
              <div className='other-message'>
                Hi there!
              </div>
            </div>
          </div>
        </div>

        <div className='sender-me'>
          <div className='my-message'>
            Hello
          </div>
        </div>

        <div className='chat-footer'>
          <input type='textarea' placeholder={'Type a message...'} />
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
    placeholder: 'pizza',
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatWindow);

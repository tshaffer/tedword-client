import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CSSProperties } from 'hoist-non-react-statics/node_modules/@types/react';

import '../styles/app.css';

export interface ChatWindowProps {
  placeholder: string;
}

// https://stackoverflow.com/questions/39853646/how-to-import-a-css-file-in-a-react-component

// https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
// https://stackoverflow.com/questions/13444647/css-class-definition-with-multiple-identifiers

let chatBubbleRef;

const ChatWindow = (props: ChatWindowProps) => {

  chatBubbleRef = React.createRef();

  const [chatBubbleOpen, setChatBubbleOpen] = React.useState<boolean>(false);

  const chatBubble: CSSProperties = {
    height: '55px',
    overflow: 'hidden',
    minWidth: '285px',
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: '0px',
    right: '50px',
    borderTopLeftRadius: '5px',
    borderTopRightRadius: '5px',
    border: '1px solid #e4e4e4',
  };

  /*
  #chat-bubble.open {
    min-height: 350px;
  }
  */

  const chatContainer: CSSProperties = {
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
  };

  const chatHeader: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: '25px',
    zIndex: 10,
    position: 'relative',
    padding: '8px',
    boxShadow: ' 0 2px 1px rgba(0, 0, 0, .1)',
    cursor: 'pointer',
    backgroundColor: '#fff',
    transition: 'background-color 0.3s ease-in',
  };

  // https://stackoverflow.com/questions/28365233/inline-css-styles-in-react-how-to-implement-ahover
  // https://stackoverflow.com/questions/44688144/how-to-do-css-hover-function-in-jsx
  /*
  .chat-header:hover {
  background-color: #f7f7f7;
  }
  */

  const userAvatar: CSSProperties = {
    display: 'flex',
    flex: 1,
  };

  // .class1 .class2 will match only the elements with class2 within elements with class1.
  // .user-avatar .img-container {
  const userAvatarAndImgContainer: CSSProperties = {
    position: 'relative',
  };

  const userStatusInfo: CSSProperties = {
    fontSize: '13px',
    margin: 0,
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#000',
  };

  const userStatusInfoA: CSSProperties = {
    fontSize: '13px',
    margin: 0,
    textDecoration: 'none',
    fontWeight: 'bold',
    color: '#000',
  };

  const userStatusInfoP: CSSProperties = {
    fontSize: '11px',
    color: 'gray',
  };

  // https://blog.logrocket.com/how-to-use-svgs-in-react/
  const chatComm: CSSProperties = {
    // display: 'none',
  };

  const chatBody: CSSProperties = {
    padding: '8px',
  };

  const senderOther: CSSProperties = {
    padding: '8px',
  };

  // const imgContainer: CSSProperties = {
  //   padding: '8px',
  // };

  const otherMessage: CSSProperties = {
    backgroundColor: '#f1f0f0',
    borderRadius: '25px',
    padding: '8px 11px',
    fontSize: '14px',
  };


  const chatFooter: CSSProperties = {
    borderTop: '1px solid #e4e4e4',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: '8px',
  };

  const senderMe: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const senderMeMyMessage: CSSProperties = {
    backgroundColor: '#3578e5',
    color: '#fff',
    borderRadius: '25px',
    padding: '8px 11px',
    fontSize: '14px',
  };

  const sendeMeSeenAt: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    color: '#90949C',
    fontSize: '11px',
    marginTop: '8px',

  };

  const openChatBubble = () => {
    console.log('openChatBubble');
    setChatBubbleOpen(true);
    chatBubbleRef.current.classList.toggle('open');
  };

  const closeChatBubble = () => {
    console.log('closeChatBubble');
    setChatBubbleOpen(false);
    chatBubbleRef.current.classList.toggle('open');
  };

  const modalStyle = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };


  //     <div style={chatBubble}>

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
          <div className='seen-at'>
            <img className='check' src='./icons/check.svg' /> Seen 8:00 AM
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

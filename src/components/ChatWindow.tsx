import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { CSSProperties } from 'hoist-non-react-statics/node_modules/@types/react';

export interface ChatWindowProps {
  placeholder: string;
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
// https://stackoverflow.com/questions/13444647/css-class-definition-with-multiple-identifiers

const ChatWindow = (props: ChatWindowProps) => {

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


  return (
    <div style={chatBubble}>
      <div style={chatContainer}>
        <div style={chatHeader}>
          <div style={userAvatar}>
            <div style={userAvatarAndImgContainer}>
              <img src="https://source.unsplash.com/random/35x35" />
            </div>
            <div style={userStatusInfo}>
              <a
                style={userStatusInfoA}
                href="#"
              >
                John Doe
              </a>
              <p style={userStatusInfoP}>Active now</p>
            </div>
          </div>
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

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface ChatProps {
  chatUser: string;
}

const Chat = (props: ChatProps) => {

  return (
    <div style={{ position: 'absolute', bottom: '0px', left: '0px' }}>
      <p>line one of pizza</p>
      <p>line two of pizza</p>
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
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);

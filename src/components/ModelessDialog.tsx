import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface ModelessDialogProps {
  children: any;
}

const ModelessDialog = (props: ModelessDialogProps) => {

  const chatContainerStyle: any = {
    marginRight: 'auto',
    maxWidth: '290px',
    padding: '1em',
    position: 'fixed',
    top: '95%',
    left: '95%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    boxShadow: 'rgba(0,0,0,.3) 0 0.3rem 1rem',
    background: 'red',
    marginLeft: '5em',
    color: 'white',
  };

  return (
    <div style={chatContainerStyle}>
      {props.children}
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    children: ownProps.children,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelessDialog);

import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface ModelessDialogProps {
  // children: any;
  className: string;
  containerClassName: string;
  backdropClassName: string;
  noBackdrop: boolean;
  clickBackdropToClose: boolean;

  onClose: () => any;
}

const ModelessDialog = (props: ModelessDialogProps) => {

  console.log(props);

  const containerStyle = {
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '720px',
    padding: '1em',
  };

  const dialogStyle: any = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    width: '60rem',
    height: '20rem',
    boxShadow: 'rgba(0,0,0,.3) 0 0.3rem 1rem',
    background: 'red'
  };

  const contentStyle = {
    marginLeft: '5em',
    fontStyle: 'italic',
    color: 'white',
  };

  const defaultDialogStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    background: 'rgba(255, 255, 255, 1)'
  };

  const defaultBackdropStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 9998,
    background: 'rgba(0, 0, 0, 0.3)'
  };

  const finalDialogStyle = Object.assign({}, defaultDialogStyle) as any;
  const finalBackdropStyle = Object.assign({}, defaultBackdropStyle) as any;

  const close = (e) => {
    e.preventDefault();
    if (props.onClose) {
      props.onClose();
    }
  };

  // return (
  //   <div className={props.containerClassName}>
  //     <div className={props.className} style={finalDialogStyle}>
  //       {props.children}
  //     </div>
  //     {!props.noBackdrop &&
  //       <div className={props.backdropClassName} style={finalBackdropStyle}
  //         onClick={props.clickBackdropToClose && close} />}
  //   </div>
  // );
  // return (
  //   <div>
  //     <div style={finalDialogStyle}>
  //       {props.children}
  //     </div>
  //     {!props.noBackdrop &&
  //       <div className={props.backdropClassName} style={finalBackdropStyle}
  //         onClick={props.clickBackdropToClose && close} />}
  //   </div>
  // );
  // return (
  //   <div>
  //     <div style={finalDialogStyle}>
  //       buried pizza
  //     </div>
  //   </div>
  // );
  return (
    <div style={containerStyle}>
      <div style={dialogStyle}>
        <div style={contentStyle}>
          <h2>This is a dialog box</h2>
          <button onClick={close}>Close dialog</button>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return {
    // children: ownProps.children,
    className: ownProps.className,
    containerClassName: ownProps.containerClassName,
    backdropClassName: ownProps.backdropClassName,
    noBackdrop: ownProps.noBackdrop,
    clickBackdropToClose: ownProps.clickBackdropToClose,
    onClose: ownProps.onClose,
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelessDialog);

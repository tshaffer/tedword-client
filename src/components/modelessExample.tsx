import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Draggable from 'react-draggable';
// import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ResizableBox } from 'react-resizable';

import { makeStyles } from '@material-ui/core/styles';

// const styles = (theme) => ({
//   resizable: {
//     position: 'relative',
//     '& .react-resizable-handle': {
//       position: 'absolute',
//       width: 20,
//       height: 20,
//       bottom: 0,
//       right: 0,
//       background:
//         'url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+\')',
//       'background-position': 'bottom right',
//       padding: '0 3px 3px 0',
//       'background-repeat': 'no-repeat',
//       'background-origin': 'content-box',
//       'box-sizing': 'border-box',
//       cursor: 'se-resize'
//     }
//   }
// });

const useStyles = makeStyles({
  resizable: {
    position: 'relative',
    '& .react-resizable-handle': {
      position: 'absolute',
      width: 20,
      height: 20,
      bottom: 0,
      right: 0,
      background:
        'url(\'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2IDYiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiNmZmZmZmYwMCIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI2cHgiIGhlaWdodD0iNnB4Ij48ZyBvcGFjaXR5PSIwLjMwMiI+PHBhdGggZD0iTSA2IDYgTCAwIDYgTCAwIDQuMiBMIDQgNC4yIEwgNC4yIDQuMiBMIDQuMiAwIEwgNiAwIEwgNiA2IEwgNiA2IFoiIGZpbGw9IiMwMDAwMDAiLz48L2c+PC9zdmc+\')',
      'background-position': 'bottom right',
      padding: '0 3px 3px 0',
      'background-repeat': 'no-repeat',
      'background-origin': 'content-box',
      'box-sizing': 'border-box',
      cursor: 'se-resize'
    }
  },
});


const Modeless = () => {

  const [open, setOpen] = React.useState<boolean>(false);

  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*
          <ResizableBox
            height={400}
            width={600}
            className={this.props.classes.resizable}
          >
        <Dialog
          open={true}
          onClose={handleClose}
          TransitionComponent={Draggable}
          maxWidth={false}
          aria-labelledby="form-dialog-title"
        >
  */
  return (
    <div>
      <Button onClick={handleClickOpen}>Open form dialog</Button>
      {open && (
        <Dialog
          open={true}
          onClose={handleClose}
          TransitionComponent={Draggable}
          maxWidth={false}
          aria-labelledby="form-dialog-title"
        >
          <ResizableBox
            height={400}
            width={600}
            className={classes.resizable}
          >
            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To subscribe to this website, please enter your email address
                here. We will send updates occasionally.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleClose} color="primary">
                Subscribe
              </Button>
            </DialogActions>
          </ResizableBox>
        </Dialog>
      )}
    </div>
  );
};

function mapStateToProps(state: any) {
  return {
  };
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
  }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Modeless);

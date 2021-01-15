import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function AlertDialog(props) {
   return (
     <div>
        <Dialog
          open={props.open}
          onClose={props.onClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
           <DialogTitle id="alert-dialog-title">{"Delete post?"}</DialogTitle>
           <DialogContent>
              <DialogContentText id="alert-dialog-description">
                 Are you sure?
              </DialogContentText>
           </DialogContent>
           <DialogActions>
              <Button onClick={props.onDelete} color="primary">
                 OK
              </Button>
              <Button onClick={props.onClose} color="primary" autoFocus>
                 Cancel
              </Button>
           </DialogActions>
        </Dialog>
     </div>
   );
}
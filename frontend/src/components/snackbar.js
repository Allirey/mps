import React from 'react';
import MuiAlert from '@material-ui/lab/Alert';
import {makeStyles, Snackbar} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    snackbar: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackBar = props => {
    const classes = useStyles();

    // const [open, setOpen] = React.useState(false);
    //
    // const handleClick = () => {
    //     setOpen(true);
    // };
    //
    // const handleClose = (event, reason) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpen(false);
    // }

    return (
        <div className={classes.snackbar}>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: "center"}}
                open={props.open}
                autoHideDuration={6000}
                onClose={props.onClose}
            >
                <Alert onClose={props.onClose} severity="success">
                    {props.text}
                </Alert>
            </Snackbar>
        </div>
    )
}

export default SnackBar
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

    return (
        <div className={classes.snackbar}>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: "center"}}
                open={props.open}
                autoHideDuration={6000}
                onClose={props.onClose}
            >
                <Alert onClose={props.onClose} severity={props.severity}>
                    {props.text}
                </Alert>
            </Snackbar>
        </div>
    )
}

SnackBar.defaultProps = {
    severity: "success"
}

export default SnackBar
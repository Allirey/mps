import React from 'react';
import withStore from '../../hocs/withStore';
import SignUp from "../../components/authentication/register";
import {Link} from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import {Fab, Grid, Typography, withStyles} from "@material-ui/core";

const styles = theme => ({
    paper: {
        marginTop: theme.spacing(3),
    }
});

class UserCreate extends React.Component {

    render() {
        const {classes} = this.props;

        return (
            <div className={classes.paper}>
                <SignUp/>
            </div>
        )
    }
}

export default withStyles(styles)(withStore(UserCreate));
import React, {useEffect, useState} from 'react';
import {Link, Redirect, useLocation} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(5),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#3b535f",  //   #b0bec5
        "&:hover": {backgroundColor: "#b0bec5",}
    },
}));

function SignIn(props) {
    const classes = useStyles();
    const [errors, setErrors] = useState('');
    const [passwordErrTxt, setPasswordErrTxt] = useState('');

    const users = props.stores.authStore;
    const {inProgress} = props.stores.authStore;
    const {password} = users.values

    useEffect(() => {
        return () => {
            users.reset()
        }
    }, [])

    let location = useLocation();

    const setError = (errors) => {
        const errorsMap = {password: setPasswordErrTxt}
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }


    const isPasswordValid = () => {
        let isValid = password.length > 0;
        setPasswordErrTxt(isValid ? '' : 'This field is required');

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isPasswordValid()) return

        // users.login()
        //     .then(() => (props.history.replace(!!location.state ? location.state.from : "/")))
        //     .catch((e) => (setErrors(e.message)));
        // todo returns "OK" in error if empty form submitted
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Change Password
                </Typography>

                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}>

                    <TextField
                        size={"small"}
                        value={users.values.password}
                        onChange={(e) => users.setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="c_password"
                        label="Current Password"
                        type="password"
                        id="c_password"
                        autoComplete="current-password"
                        error={!!passwordErrTxt || !!errors}
                        helperText={passwordErrTxt || errors}
                    />

                    <TextField
                        size={"small"}
                        value={users.values.password}
                        onChange={(e) => users.setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="n_password"
                        label="New Password"
                        type="password"
                        id="n_password"
                        autoComplete="current-password"
                        error={!!passwordErrTxt || !!errors}
                        helperText={passwordErrTxt || errors}
                    />

                    <TextField
                        size={"small"}
                        value={users.values.password}
                        onChange={(e) => users.setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="n_password2"
                        label="New Password (again)"
                        type="password"
                        id="n_password2"
                        autoComplete="current-password"
                        error={!!passwordErrTxt || !!errors}
                        helperText={passwordErrTxt || errors}
                    />


                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                        disabled={inProgress}
                    >
                        Change Password
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default withStore(SignIn);
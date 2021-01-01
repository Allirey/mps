import React, {useEffect, useState} from 'react';
import {Link, Redirect, useLocation} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import authImg from "./imgs/auth.png";
import SnackBar from "../../components/snackbar";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" to="/">
                glitcher.org
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#3b535f",  //   #b0bec5
        "&:hover": {backgroundColor: "#b0bec5",}
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
}));

function SignIn(props) {
    const classes = useStyles();
    const [errors, setErrors] = useState('');
    const [userNameErrTxt, setUserNameErrTxt] = useState('');
    const [passwordErrTxt, setPasswordErrTxt] = useState('');

    const users = props.stores.authStore;
    const {inProgress} = props.stores.authStore;
    const {username, password} = users.values

    const [open, setOpen] = React.useState(props.stores.authStore.showSuccessActivated);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    useEffect(() => {
        return () => {
            users.reset()
            props.stores.authStore.setShowSuccessActivated(false);
        }
    }, [])

    let location = useLocation();

    const setError = (errors) => {
        const errorsMap = {password: setPasswordErrTxt, username: setUserNameErrTxt}
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const isUNameValid = () => {
        let isValid = username.length > 0;
        setUserNameErrTxt(isValid ? '' : 'This field is required');

        return isValid;
    };

    const isPasswordValid = () => {
        let isValid = password.length > 0;
        setPasswordErrTxt(isValid ? '' : 'This field is required');

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isUNameValid() | !isPasswordValid()) return

        users.login()
            .then(() => (props.history.replace(!!location.state ? location.state.from : "/")))
            .catch((e) => (setErrors(e.message)));
        // todo returns "OK" in error if empty form submitted
    }
    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <div className={classes.logo}>
                    <img src={authImg} alt={''}/>
                </div>

                <SnackBar open={open}
                          onClose={handleClose}
                          text={"Successfully activated! You can now login into your account."}/>

                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}>
                    <TextField
                        value={users.values.username}
                        onChange={(e) => users.setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="username"
                        label="Username or E-mail"
                        name="username"
                        autoComplete="off"
                        // autoFocus
                        error={!!userNameErrTxt || !!errors}
                        helperText={userNameErrTxt}

                    />
                    <TextField
                        value={users.values.password}
                        onChange={(e) => users.setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
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
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="/accounts/password/reset" variant="body2">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link to="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    );
}

export default withStore(SignIn);
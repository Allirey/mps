import React, {useEffect, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../hocs/withStore';
import authImg from "./imgs/auth.png";

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#3b535f", //   #b0bec5
        "&:hover": {backgroundColor: "#b0bec5",}
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
}));

function SignUp(props) {
    const classes = useStyles();
    const [userNameErrTxt, setUserNameErrTxt] = useState('');
    const [emailErrTxt, setEmailErrTxt] = useState('');
    const [passwordErrTxt, setPasswordErrTxt] = useState('');

    const users = props.stores.authStore;
    const {inProgress} = props.stores.authStore;
    const {username, password, email} = users.values


    useEffect(() => {
        return () => users.reset()
    }, [])

    const setError = (errors) => {
        const errorsMap = {email: setEmailErrTxt, password: setPasswordErrTxt, username: setUserNameErrTxt}
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const isUNameValid = () => {
        let isValid = /^[a-zA-Z0-9]{4,16}$/.test(username);

        setUserNameErrTxt(isValid ? '' : username.length ?
            'username too short. enter at least 4 characters' : 'This field is required');

        return isValid;
    };

    const isEmailValid = () => {
        const supportedEmailList = [
            'gmail.com', 'mail.ru', 'protonmail.com',
            'yahoo.com', 'googlemail.com', 'zoho.com',
            'hotmail.com', 'live.com', 'msn.com', 'aol.com', 'yandex.ru',
        ]

        let isValid = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email);
        setEmailErrTxt(isValid ? '' : email.length ? 'Please enter a valid email address.' : 'This field is required');

        if (!isValid) return isValid;

        if (!supportedEmailList.includes(email.split('@')[1])) {
            setEmailErrTxt(`Sorry, ${email.split('@')[1]} not supported`)
            return false
        }

        return isValid;
    };

    const isPasswordValid = () => {
        let isValid = /^[a-zA-Z0-9]{4,15}$/.test(password);

        setPasswordErrTxt(isValid ? '' : password.length ?
            'password too short, enter at least 6 characters' : 'This field is required');

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isUNameValid() | !isPasswordValid() | !isEmailValid()) return

        users.register().then(() => props.history.replace("/")).catch(setError);
    }

    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <div className={classes.logo} >
                    <img src={authImg} alt={''}/>
                </div>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                size={"small"}
                                value={users.values.username}
                                onChange={(e) => users.setUsername(e.target.value)}
                                autoComplete="off"
                                name="username"
                                variant="outlined"
                                fullWidth
                                id="username"
                                label="Username"
                                // autoFocus
                                error={!!userNameErrTxt}
                                helperText={userNameErrTxt}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size={"small"}
                                value={users.values.password}
                                onChange={(e) => users.setPassword(e.target.value)}
                                variant="outlined"
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                error={!!passwordErrTxt}
                                helperText={passwordErrTxt}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                size={"small"}
                                value={users.values.email}
                                onChange={(e) => users.setEmail(e.target.value)}
                                variant="outlined"
                                fullWidth
                                id="email"
                                label="E-mail address"
                                name="email"
                                autoComplete="off"
                                error={!!emailErrTxt}
                                helperText={emailErrTxt}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        size={"small"}
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                        disabled={inProgress}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright/>
            </Box>
        </Container>
    );
}

export default withStore(SignUp);
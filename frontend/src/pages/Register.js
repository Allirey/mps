import React, {useEffect, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import {Button, CssBaseline, Avatar, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../hocs/withStore';

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
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
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
}));

function SignUp(props) {
    const classes = useStyles();
    const [userNameErrorText, setUserNameErrTxt] = useState('');
    const [emailErrorText, setEmailErrTxt] = useState('');
    const [passwordErrorText, setPasswordErrTxt] = useState('');

    const users = props.stores.authStore;
    const {inProgress} = props.stores.authStore;


    useEffect(() => {
        return () => users.reset()
    }, [])

    const setError = (errors) => {
        const errorsMap = {email: setEmailErrTxt, password: setPasswordErrTxt, username: setUserNameErrTxt}
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        users.register().then(() => props.history.replace("/")).catch(setError);
    }

    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar} style={{backgroundColor: "purple"}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form
                    className={classes.form}
                    // noValidate
                    onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={users.values.username}
                                onChange={(e) => users.setUsername(e.target.value)}
                                autoComplete="off"
                                name="username"
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                // onKeyDown={e => e.keyCode === 13 ? handleSubmit() : []}
                                autoFocus
                                error={!!userNameErrorText}
                                helperText={userNameErrorText}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={users.values.password}
                                onChange={(e) => users.setPassword(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                // onKeyDown={e => e.keyCode === 13 ? handleSubmit() : []}
                                error={!!passwordErrorText}
                                helperText={passwordErrorText}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={users.values.email}
                                onChange={(e) => users.setEmail(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="E-mail address"
                                name="email"
                                autoComplete="off"
                                // onKeyDown={e => e.keyCode === 13 ? handleSubmit() : []}
                                error={!!emailErrorText}
                                helperText={emailErrorText}
                            />
                        </Grid>
                    </Grid>
                    <Button
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
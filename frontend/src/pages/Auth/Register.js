import React, {useEffect, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import authImg from "./imgs/auth.png";
import {Helmet} from "react-helmet";

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
        "& a": {
            textDecoration: "none",
            color: "blue"
        }
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
    const [userNameErr, setUserNameErr] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passwordErr, setPasswordErr] = useState('');

    const users = props.stores.authStore;
    const {inProgress} = props.stores.authStore;
    const {username, password, email} = users.values

    useEffect(() => {
        return () => users.reset()
    }, [])

    const setErrors = (errors) => {
        const errorsMap = {email: setEmailErr, password: setPasswordErr, username: setUserNameErr}
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const isFormValid = () => {
        [setEmailErr, setPasswordErr, setUserNameErr].forEach(func => func(''))

        let nameErr = /^[\w]{2,32}$/.test(username) ? '' : username.length ?
            'Enter valid username. Allowed latin letters, numbers, and _ . 2-32 characters' : 'This field is required';
        let passwordErr = password.length < 6 ? password.length ? 'password too short, enter at least 6 characters' :
            'This field is required' : "";
        let emailErr = /^.+@.+\.[A-Za-z]{2,3}$/.test(email) ? '' : email.length ?
            'Please enter a valid email address. We will send you activation link' : 'This field is required';

        !!nameErr && setUserNameErr(nameErr)
        !!passwordErr && setPasswordErr(passwordErr)
        !!emailErr && setEmailErr(emailErr)

        return !(nameErr || passwordErr || emailErr);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isFormValid()) return

        users.register().then(() => {
            props.stores.notifications.notify('Activation link has been sent to your email. Please check your mailbox.');
            props.history.replace("/")
        }).catch((e) => {
            setErrors(e.message)
        });
    }

    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <Helmet
            title={'Sign up'}
            />
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <div className={classes.logo}>
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
                                error={!!userNameErr}
                                helperText={userNameErr}
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
                                autoComplete="new-password"
                                error={!!passwordErr}
                                helperText={passwordErr}
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
                                error={!!emailErr}
                                helperText={emailErr}
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
        </Container>
    );
}


export default withStore(SignUp);
import React, {useEffect, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import forgotImg from "./imgs/auth.png";

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
        marginTop: theme.spacing(9),
    },
    submit: {
        margin: theme.spacing(8, 0, 2),
        backgroundColor: "#3b535f", //   #b0bec5
        "&:hover": {backgroundColor: "#b0bec5",}
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    }
}));

function ResetPassword(props) {
    const classes = useStyles();

    const [emailErrTxt, setEmailErrTxt] = useState('');
    const {inProgress, reset, setEmail} = props.stores.authStore;
    const {email} = props.stores.authStore.values

    useEffect(() => {
        return () => reset()
    }, [])

    const setError = (errors) => {
        errors[email] && setEmailErrTxt(errors[email])
    }

    const isEmailValid = () => {
        let isValid = /^.+@.+\.[A-Za-z]{2,3}$/.test(email);
        setEmailErrTxt(isValid ? 'reset password functionality under development, sorry for inconveniences' :
            email.length ? 'Please enter a valid email address.' : 'This field is required');

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isEmailValid()) return

        // users.register().then(() => props.history.replace("/")).catch(setError);
    }

    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <div className={classes.logo} >
                    <img src={forgotImg} alt={''}/>
                </div>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                        disabled={inProgress}
                    >
                        Reset My Password
                    </Button>
                    <Grid container justify="flex-start">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Back to Sign in
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

export default withStore(ResetPassword);
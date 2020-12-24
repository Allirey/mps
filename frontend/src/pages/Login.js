import React, {useEffect} from 'react';
import {Link, Redirect, useLocation} from "react-router-dom";
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        backgroundColor: "#3b535f",  //   #b0bec5
        "&:hover": {backgroundColor: "#b0bec5",}
    },
}));

function SignIn(props) {
    const classes = useStyles();
    const users = props.stores.authStore;

    useEffect(() => {
        return () => users.reset()
    }, [])

    let location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault()
        users.login()
            .then(() => props.history.replace(!!location.state ? location.state.from : "/"))
            .catch(e => console.log(e));
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
                    Sign in
                </Typography>
                <form
                    className={classes.form}
                    // noValidate
                    onSubmit={handleSubmit}>
                    <TextField
                        value={users.values.username}
                        onChange={(e) => users.setUsername(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Username or E-mail"
                        name="email"
                        autoComplete="off"
                        // onKeyDown={e => e.keyCode === 13 ? handleSubmit() : []}
                        autoFocus
                    />
                    <TextField
                        value={users.values.password}
                        onChange={(e) => users.setPassword(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        // onKeyDown={e => e.keyCode === 13 ? handleSubmit() : []}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onSubmit={handleSubmit}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link to="#" variant="body2">
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
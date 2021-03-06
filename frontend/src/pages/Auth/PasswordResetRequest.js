import {useEffect, useState} from 'react';
import {Link, Redirect} from "react-router-dom";
import {Button, CssBaseline, TextField, Grid, Typography, makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import forgotImg from "./imgs/auth.png";
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
        marginTop: theme.spacing(9),
        "& a": {
            textDecoration: "none",
            color: "blue"
        }
    },
    submit: {
        margin: theme.spacing(8, 0, 2),
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    }
}));

function ResetPasswordRequest(props) {
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
        setEmailErrTxt('')
        let isValid = /^.+@.+\.[A-Za-z]{2,3}$/.test(email);
        setEmailErrTxt(isValid ? '' :
            email.length ? 'Please enter a valid email address.' : 'This field is required');

        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!isEmailValid()) return

        props.stores.authStore.passwordResetRequest(email).then(() => {
            reset()
            props.stores.notifications.notify('Please, check your email for reset password link')
        })
            .catch(e=>{
                setEmailErrTxt(e.message)
            });
    }

    if (props.stores.authStore.isAuthenticated) return <Redirect to={"/"}/>

    return (
        <Container component="main" maxWidth="xs">
            <Helmet
            title={"Reset password"}
            />
            <CssBaseline/>
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Reset Password
                </Typography>
                <div className={classes.logo}>
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
        </Container>
    );
}

export default withStore(ResetPasswordRequest);
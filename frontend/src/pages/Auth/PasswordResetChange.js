import React, {useEffect, useState} from 'react';
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
import {useParams} from 'react-router-dom';
import withStore from '../../hocs/withStore';
import {Helmet} from "react-helmet";

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

function ResetPassword(props) {
    const classes = useStyles();

    const [newPErr, setNewPErr] = useState('');
    const [newP2Err, setNewP2Err] = useState('');
    const [err, setErr] = useState('');

    const [newP, setNewP] = useState('');
    const [newP2, setNewP2] = useState('');

    const {authStore} = props.stores;
    const {inProgress} = authStore;

    const {id, token} = useParams();

    const resetFields = () => [setNewP, setNewP2].forEach(func => func(""))

    useEffect(() => {
        return () => {
            resetFields()
        }
    }, [])

    const setErrors = (errors) => {
        const errorsMap = {
            password: setNewPErr,
            password2: setNewP2Err,
            non_field_errors: setErr,
        }
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const isFormValid = () => {
        [setNewPErr, setNewP2Err, setErr].forEach(func => func(""))

        let newErrs = newP.length ? (newP.length < 6 ? "New password should be at least 6 characters" : "") : 'This field is required';
        let new2Errs = newP2.length ? "" : 'This field is required';
        let errs = newP.length && newP2.length && newP !== newP2 ? "Password fields didn't match." : "";

        !!newErrs && setNewPErr(newErrs)
        !!new2Errs && setNewP2Err(new2Errs)
        !!errs && setErr(errs)

        return !newErrs && !new2Errs && !errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!isFormValid()) return

        authStore.passwordResetChange(id, token, newP, newP2).then(data => {
                resetFields();
                props.stores.notifications.notify('Password successfully changed!')
                props.history.replace('/login')
            }
        ).catch(e => {
                console.warn(e);
                //todo check error if token incorrect

                // setErrors(e.message)
            }
        )
    }

    return (
        <Container component="main" maxWidth="xs">
            <Helmet
            title={'Reset password'}
            />
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
                        value={newP}
                        onChange={(e) => setNewP(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="password"
                        label="New Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        error={!!newPErr}
                        helperText={newPErr}
                    />

                    <TextField
                        size={"small"}
                        value={newP2}
                        onChange={(e) => setNewP2(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="n_password2"
                        label="New Password (again)"
                        type="password"
                        id="n_password2"
                        autoComplete="new-password"
                        error={!!newP2Err || !!err}
                        helperText={err || newP2Err}
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

export default withStore(ResetPassword);
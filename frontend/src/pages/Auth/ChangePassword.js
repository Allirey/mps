import React, {useEffect, useState} from 'react';
import {Button, CssBaseline, TextField, Grid, Box, Typography, makeStyles, Container} from '@material-ui/core';
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

function ChangePassword(props) {
    const classes = useStyles();

    const [oldPErr, setOldPErr] = useState('');
    const [newPErr, setNewPErr] = useState('');
    const [newP2Err, setNewP2Err] = useState('');
    const [err, setErr] = useState('');

    const [oldP, setOldP] = useState('');
    const [newP, setNewP] = useState('');
    const [newP2, setNewP2] = useState('');

    const {authStore} = props.stores;
    const {inProgress} = authStore;

    const resetFields = () => [setOldP, setNewP, setNewP2].forEach(func => func(""))

    useEffect(() => {
        return () => {
            resetFields()
        }
    }, [])

    const setErrors = (errors) => {
        const errorsMap = {
            old_password: setOldPErr,
            password: setNewPErr,
            password2: setNewP2Err,
            non_field_errors: setErr,
        }
        Object.entries(errors).forEach(([key, value]) => errorsMap[[key]](value))
    }

    const isFieldsValid = () => {
        [setOldPErr, setNewPErr, setNewP2Err, setErr].forEach(func => func(""))

        let oldErrs = oldP.length ? "" : 'This field is required';
        let newErrs = newP.length ? (newP.length < 6 ? "New password should be at least 6 characters" : "") : 'This field is required';
        let new2Errs = newP2.length ? "" : 'This field is required';
        let errs = newP.length && newP2.length && newP !== newP2 ? "Password fields didn't match." : "";

        !!oldErrs && setOldPErr(oldErrs)
        !!newErrs && setNewPErr(newErrs)
        !!new2Errs && setNewP2Err(new2Errs)
        !!errs && setErr(errs)

        return !oldErrs && !newErrs && !new2Errs && !errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!isFieldsValid()) return

        authStore.changePassword(oldP, newP, newP2).then(data => {
                resetFields();
                props.stores.notifications.notify("Password successfully changed!");
                props.history.replace('/settings')
            }
        ).catch(e => {
                setErrors(e.message)
            }
        )
    }

    return (
        <Container component="main" maxWidth="xs">
            <Helmet
            title={'Change password'}
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
                        value={oldP}
                        onChange={(e) => setOldP(e.target.value)}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="oldpassword"
                        label="Current Password"
                        type="password"
                        id="oldpassword"
                        error={!!oldPErr}
                        helperText={oldPErr}
                    />

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

export default withStore(ChangePassword);
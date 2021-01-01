import React, {useEffect} from 'react';
import {useParams} from "react-router-dom";
import { makeStyles, Container} from '@material-ui/core';
import withStore from '../../hocs/withStore';
import Spinner from '../../components/spinner';

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

function AccountActivation(props) {
    const classes = useStyles();
    const {id, token} = useParams();

    useEffect(() => {
        props.stores.authStore.activate(id, token).then(() => {
                props.stores.authStore.setShowSuccessActivated(true);
                props.history.replace("/login")
            }
        ).catch((e)=>{
            console.log(e)
            //todo show snackbar with error
            props.history.replace("/")
        })
    }, [])

    return (
        <Container component="main" maxWidth="xs">
            <Spinner/>
        </Container>
    );
}

export default withStore(AccountActivation);
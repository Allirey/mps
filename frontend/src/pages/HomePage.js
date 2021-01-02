import React, {useEffect} from "react";
import {Container, makeStyles} from "@material-ui/core";
import withStore from '../hocs/withStore';
import SnackBar from "../components/snackbar";
import logo from "./undraw_development_ouy3.svg";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(10),
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
}))

function HomePage(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(props.stores.authStore.showSuccessRegister);
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    }

    useEffect(() => {
        return () => props.stores.authStore.setShowSuccessRegister(false);
    }, [])

    return (
        <Container className={classes.root}>
            <SnackBar open={open}
                      text={'Activation link has been sent to your email. Please check your mailbox.'}
                      onClose={handleClose}/>

            <h1>Development in progress....</h1>

            <div className={classes.logo}>
                <img src={logo} alt={''}/>
            </div>
        </Container>
    )
}

export default withStore(HomePage)
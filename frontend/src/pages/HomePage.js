import React, {useEffect} from "react";
import {Container, makeStyles, List, ListItem, Typography} from "@material-ui/core";
import withStore from '../hocs/withStore';
import SnackBar from "../components/snackbar";
import logo from "./undraw_development_ouy3.svg";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
    todos:{
        marginTop: theme.spacing(2)
    }
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

            <Typography variant={"h3"}>Development in progress....</Typography>

            <div className={classes.logo}>
                <img src={logo} alt={''}/>
            </div>
            <Typography variant={"h4"} className={classes.todos}>Current todos:</Typography>
            <List>
                <ListItem>password change</ListItem>
                <ListItem>password recover</ListItem>
                <ListItem>edit user info in settings</ListItem>
                <ListItem>quizy rewrite using db</ListItem>
                <ListItem>redesign chess db</ListItem>
                <ListItem>blog</ListItem>
                <ListItem>admin/moderator page</ListItem>
                <ListItem>live chat</ListItem>
                <ListItem>chess tactics</ListItem>
                <ListItem>chess theory</ListItem>
            </List>


        </Container>
    )
}

export default withStore(HomePage)
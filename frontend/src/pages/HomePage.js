import React from "react";
import {Container, makeStyles, Typography} from "@material-ui/core";
import withStore from '../hocs/withStore';
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
    todos: {
        marginTop: theme.spacing(2)
    }
}))

function HomePage(props) {
    const classes = useStyles();

    return (
        <Container className={classes.root}>
            <Typography variant={"h3"}>Development in progress....</Typography>

            <div className={classes.logo}>
                <img src={logo} alt={''}/>
            </div>
        </Container>
    )
}

export default withStore(HomePage)
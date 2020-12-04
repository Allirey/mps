import React from "react";
import {AppBar, Button, Container, makeStyles, Toolbar, Box} from "@material-ui/core";
import {Link} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    root: {
        background: "white",
        flexGrow: 1,
        "& div": {
            maxHeight: 50,
            display: "flex"
        },

        "& div > button":
            {
                maxWidth: "200px",
                backgroundColor: "white",
                "&:hover": {
                    backgroundColor: "white",
                }
            },
        "& div > button > span > a":
            {
                color: "grey",
                textDecoration: "none",
                "&:hover": {
                    color: "black"
                }
            }
    },

}));

export default function (props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <AppBar position="static" className={classes.root}>
                <Toolbar component={Container} variant={"dense"}>
                    <Button disableRipple> <Link to="/">glitcher.org</Link> </Button>
                    <Button disableRipple> <Link to="/chess/analysis">Chess db</Link> </Button>
                    <Button disableRipple> <Link to="/quizy">Quizy</Link> </Button>
                    <Button disableRipple> <Link to="/about">About</Link> </Button>
                    <Box style={{flexGrow: 1}}/>
                    <Button disableRipple> <Link to="/login">Sign in</Link> </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

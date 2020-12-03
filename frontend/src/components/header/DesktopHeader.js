import React from "react";
import {AppBar, Button, Container, makeStyles, Toolbar, Typography, Box} from "@material-ui/core";
import {Link} from "react-router-dom";
import Header from "./index";

const useStyles = makeStyles((theme) => ({
    root: {

        // todo
    }
}));

export default class extends React.Component {
    render() {
        return (
            <>
                <AppBar position="static" style={{background: "#ffffff", flexGrow: 1}}>
                    <Toolbar component={Container} variant={"dense"} style={{minHeight: 50}}>
                        <Button disableRipple={true} color={"primary"}
                                style={{maxWidth: "110px", backgroundColor: "#FFffff"}}>
                            <Link to="/" style={{textDecoration: 'none', color: "grey"}}>glitcher.org</Link>
                        </Button>

                        <Button disableRipple={true} style={{maxWidth: "200px", backgroundColor: "#FFffff"}}>
                            <Link to="/chess/analysis" style={{textDecoration: 'none', color: "grey"}}>Chess db</Link>
                        </Button>

                        <Button disableRipple={true} style={{maxWidth: "200px", backgroundColor: "#FFffff"}}>
                            <Link to="/quizy" style={{textDecoration: 'none', color: "grey"}}>Quizy</Link>
                        </Button>

                        <Button disableRipple={true} style={{maxWidth: "200px", backgroundColor: "#FFffff"}}>
                            <Link to="/about" style={{textDecoration: 'none', color: "grey"}}>About</Link>
                        </Button>

                        <Box flexGrow={1}/>

                        <Button disableRipple={true} style={{maxWidth: "200px", backgroundColor: "#FFffff"}}>
                            <Link to="/login" style={{textDecoration: 'none', color: "grey"}}>Sign in</Link>
                        </Button>

                        </Toolbar>
                </AppBar>
            </>)
    }
}
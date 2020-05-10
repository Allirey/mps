import React from "react";
import {AppBar, Button, Toolbar, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class extends React.Component {
    render() {
        return (
            <>
                <AppBar position="static" style={{background: "#2B3648", flexGrow: 1}}>
                    <Toolbar variant={"dense"} style={{minHeight: 50}}>
                        <Button disableRipple={true} color={"primary"} style={{maxWidth: "110px", backgroundColor: "#FFC000"}} component={Typography}>
                            <Link to="/" style={{textDecoration: 'none', color: "#2B3648"}}>glitcher.org</Link>
                        </Button>
                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/chess/games" style={{textDecoration: 'none', color: "white"}}>games search</Link>
                        </Button>
                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/chess/explorer" style={{textDecoration: 'none', color: "white"}}>Opening
                                explorer</Link>
                        </Button>
                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/chess/analysis" style={{textDecoration: 'none', color: "white"}}>Analysis</Link>
                        </Button>

                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/quizy" style={{textDecoration: 'none', color: "white"}}>Quizy</Link>
                        </Button>

                        <Button style={{maxWidth: "200px"}}>
                            <Link to="/about" style={{textDecoration: 'none', color: "white"}}>About</Link>
                        </Button>
                    </Toolbar>
                </AppBar>
            </>)
    }
}
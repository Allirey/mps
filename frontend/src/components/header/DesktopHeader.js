import React from "react";
import {AppBar, Button, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class extends React.Component {
    render() {
        return (
            <>
                <AppBar position="static" style={{background: "#6B5B95", flexGrow: 1}}>
                    <Toolbar variant={"dense"} style={{minHeight: 36}}>
                        <Button color={"primary"} style={{maxWidth: "100px"}}>
                            <Link to="/" style={{textDecoration: 'none', color: "white"}}>Home</Link>
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
                            <Link to="/about" style={{textDecoration: 'none', color: "white"}}>About</Link>
                        </Button>
                    </Toolbar>
                </AppBar>
            </>)
    }
}
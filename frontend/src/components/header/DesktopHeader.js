import React from "react";
import {AppBar, Button, Grid, Toolbar} from "@material-ui/core";
import {Link} from "react-router-dom";

export default class extends React.Component {
    render() {
        return (
            <>
                <AppBar position="static" style={{background: "#008B8B", flexGrow: 1, marginBottom: 5}}>
                    <Toolbar>

                        <Button color={"primary"} style={{maxWidth: "100px", backgroundColor: "#783782"}}>
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
                            <Link to="/about" style={{textDecoration: 'none', color: "white"}}>About</Link>
                        </Button>

                    </Toolbar>
                </AppBar>
            </>)
    }
}
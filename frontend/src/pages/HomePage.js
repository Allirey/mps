import React from "react";
import { Typography } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";

export default class extends React.Component {
    render() {
        return (
            <Container>
                <Typography><h1>Welcome! :)</h1></Typography>
                <br />
                <Link to={"/chess/analysis"} style={{ textDecoration: "none", color: "blue" }}>analysis</Link>
            </Container>
        );
    }
}
import React from "react";
import { Typography, withStyles } from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";

const styles = (theme) => ({
    root: {
        color: "red"
    },
});

class Home extends React.Component {
    render() {
        const {classes} = this.props;

        return (
            <Container>
                <Typography className={classes.root}><h1>Welcome! :)</h1></Typography>
                <br />
                <Link to={"/chess/analysis"} style={{ textDecoration: "none", color: "blue" }}>analysis</Link>
            </Container>
        );
    }
}

export default withStyles(styles)(Home)
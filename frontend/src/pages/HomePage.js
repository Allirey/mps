import React from "react";
import { withStyles, Container} from "@material-ui/core";

const styles = (theme) => ({
    root: {
        marginTop: theme.spacing(10),
    },
});

class Home extends React.Component {
    render() {
        const {classes} = this.props;
        return (
            <Container className={classes.root}>
                <h1>Development in progress....</h1>
            </Container>
        );
    }
}

export default withStyles(styles)(Home)
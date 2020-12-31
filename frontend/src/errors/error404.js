import React from 'react';
import {Grid, makeStyles, Container, Box} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },

}));

export default function (props) {
    const classes = useStyles();
//todo simplify return iframe size for mobile and desktop
    return (
        <Container>
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
            >
                <Grid item md={6}>
                    <p><h1>404</h1> The requested URL <b>{`${props.location.pathname}`}</b> was not found on this
                        server.<br/> Can you solve this one?
                    </p>

                </Grid>
                <Box display={{xs: "none", md: "block"}}>
                    <iframe src="https://lichess.org/training/frame?theme=blue&bg=light"
                            style={{width: "50vh", height: "35vw"}}
                            frameBorder="0">
                    </iframe>
                </Box>

                <Box display={{xs: "block", md: "none"}}>
                    <iframe src="https://lichess.org/training/frame?theme=blue&bg=light"
                            style={{width: "40vh", height: "85vw"}}
                            frameBorder="0">
                    </iframe>
                </Box>
            </Grid>
        </Container>
    );
}



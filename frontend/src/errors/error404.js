import React from 'react';
import {Grid, makeStyles, Container, Box, Typography} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },

}));

const Error404 = (props) => {
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
                <Grid item>
                    <Typography gutterBottom variant={"h3"} align={"center"}>404</Typography>
                    <Typography> The requested URL was not found on this
                        server.
                    </Typography>
                    <Typography>Can you solve this one?</Typography>
                    <br/>
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

export default Error404



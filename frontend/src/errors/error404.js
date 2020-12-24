import React from 'react';
import {Grid, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

const Iframe = () => (
    <iframe src="https://lichess.org/training/frame?theme=blue&bg=light"
            style={{width: "380px", height: "421px"}}
            frameBorder="0">
    </iframe>
)

export default function (props) {
    const classes = useStyles();

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '85vh'}}
        >
            <Grid item md={6}>
                <p><h1>404</h1> The requested URL <b>{`${props.location.pathname}`}</b> was not found on this
                    server.<br/> Can you solve this one?
                </p>
            </Grid>
            <Grid item xs={3}>
                <Iframe/>
            </Grid>
        </Grid>
    );
}



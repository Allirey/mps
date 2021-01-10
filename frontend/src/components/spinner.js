import React from 'react';
import {Grid, makeStyles, CircularProgress} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
    },
}));

export default function CircularIndeterminate() {
    const classes = useStyles();

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{minHeight: '90vh'}}
        >
            <Grid item xs={3}>
                <CircularProgress size={100} color={"primary"}/>
            </Grid>
        </Grid>
    );
}
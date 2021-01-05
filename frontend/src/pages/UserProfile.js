import React, {useEffect} from "react";
import {Container, makeStyles} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {useParams, Link} from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        marginTop: theme.spacing(10),
    },
    logo: {
        width: "21em",
        "& img": {width: "100%", height: "100%"}
    },
}))

function UserProfile(props) {
    const classes = useStyles();

    const {username} = useParams();
    console.log(username)


    useEffect(() => {

        return () => {
        };
    }, [])

    return (
        <Container className={classes.root}>
           User's public info:
               <ul>
                   <li>name</li>
                   <li>social links</li>
                   <li>biography</li>
                   <li>posts</li>
                   <li>comments</li>
                   <li>stats</li>
                   <li>bookmarks</li>
               </ul>
        </Container>
    )
}

export default withStore(UserProfile)
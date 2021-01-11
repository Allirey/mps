import React, {useEffect, useState} from "react";
import {Container, makeStyles, Link, Typography} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {useParams} from "react-router-dom";
import Spinner from '../components/spinner';
import UserNotFound from '../errors/UserNotFound';

const useStyles = makeStyles(theme => ({
   root: {
      marginTop: theme.spacing(10),
      "& $a": {
         color: "blue",
         '&:hover': {
            textDecoration: "none",
            backgroundColor: "cyan",
         },
      }
   },
   logo: {
      width: "21em",
      "& img": {width: "100%", height: "100%"}
   },
}))

function UserProfile(props) {
   const classes = useStyles();
   const [currentUser, setCurrentUser] = useState(null);
   const {username} = useParams();
   const {inProgress} = props.stores.authStore

   useEffect(() => {
      props.stores.authStore.getUser(username).then(data => setCurrentUser(data)).catch(e => {
         console.warn(e)
      })
      return () => {
      };
   }, [username])

   if (inProgress) return <Spinner/>
   else if (!currentUser) return <UserNotFound username={username}/>
   else return (
        <Container className={classes.root}>
           User's public info:
           <ul>
              <li><Typography>name: {currentUser.first_name}</Typography></li>
              <li><Typography>bio: {currentUser.biography}</Typography></li>
              <li><Typography>website: <Link rel="noreferrer" target="_blank"
                                             href={`//${currentUser.web_site.split("//").reverse()[0]}`}>
                 {currentUser.web_site.split("//").reverse()[0]}</Link></Typography>
              </li>
           </ul>
           More coming soon...
        </Container>
      )
}

export default withStore(UserProfile)
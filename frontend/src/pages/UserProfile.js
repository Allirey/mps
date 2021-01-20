import React, {useEffect, useState} from "react";
import {Container, makeStyles, Link, Typography} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {useParams} from "react-router-dom";
import UserNotFound from '../errors/UserNotFound';
import {Helmet} from "react-helmet";
import {Skeleton} from '@material-ui/lab';

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
   const [isLoading, setIsLoading] = useState(true);
   const {username} = useParams();

   useEffect(() => {
      props.stores.authStore.getUser(username).then(data => setCurrentUser(data)).catch(e => {
         console.warn(e)
      }).finally(() => {
         setIsLoading(false)
      })
      return () => {
      };
   }, [username])

   if (isLoading) return (
     <Container>
        <Skeleton width={"0%"}/><Skeleton width={"0%"}/><Skeleton width={"0%"}/><Skeleton width={"0%"}/>
        <Typography>
           <Skeleton width={"17%"}/>
           <Skeleton width={"0%"}/>
           <Skeleton width={"30%"}/>
           <Skeleton width={"40%"}/>
           <Skeleton width={"25%"}/>
           <Skeleton width={"0%"}/>
           <Skeleton width={"20%"}/>
        </Typography>
     </Container>
   )
   else if (!currentUser) return <UserNotFound username={username}/>
   else return (
        <Container className={classes.root}>
           <Helmet
             title={`${username} - user profile`}
           />
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
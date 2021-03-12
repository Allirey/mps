import {useEffect, useState} from "react";
import {Container, makeStyles, Link, Typography, Fade, Paper, useTheme, useMediaQuery} from "@material-ui/core";
import withStore from '../hocs/withStore';
import {useParams} from "react-router-dom";
import UserNotFound from '../errors/UserNotFound';
import {Helmet} from "react-helmet";
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
   root: {
      "& $a": {
         color: "blue",
         '&:hover': {
            textDecoration: "none",
            backgroundColor: "cyan",
         },
      },
      [theme.breakpoints.down("xs")]: {
         margin: theme.spacing(0),
         marginTop: theme.spacing(1),
      },
      margin: theme.spacing(3),
      padding: theme.spacing(3),
   },
}))

function UserProfile(props) {
   const classes = useStyles();
   const theme = useTheme();
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));

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
     <Container className={classes.root} maxWidth={"sm"}>
        <Typography variant={"h3"}><Skeleton width={'150px'}/></Typography>
        <Typography>
           <Skeleton width={"170px"}/>
           <Skeleton width={"250px"}/>
           <Skeleton width={"160px"}/>
        </Typography>
     </Container>
   )
   else if (!currentUser) return <UserNotFound username={username}/>
   else return (
        <Fade in={true}>
           <Container className={classes.root} component={Paper} maxWidth={"sm"}>
              <Helmet
                title={`${username} - user profile`}
              />
              <Typography variant={"h3"}>{currentUser.username}</Typography>
              <Typography>name: {currentUser.first_name}</Typography>
              <Typography>bio: {currentUser.biography}</Typography>
              <Typography>website: <Link rel="noreferrer" target="_blank"
                                         href={`//${currentUser.web_site.split("//").reverse()[0]}`}>
                 {currentUser.web_site.split("//").reverse()[0]}</Link>
              </Typography>
           </Container>
        </Fade>
      )
}

export default withStore(UserProfile)
import React from "react";
import {AppBar, Button, Container, makeStyles, Toolbar, Box} from "@material-ui/core";
import {Link} from "react-router-dom";
import Menu from '../Menu';
import {Skeleton} from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
   root: {
      position: 'relative',
      zIndex: theme.zIndex.drawer + 1,
      color: "black",
      background: "white",
      flexGrow: 1,
      "& div": {
         display: "flex",
      },
      "& div > button":
        {
           maxWidth: "200px",
           backgroundColor: "white",
           "&:hover": {
              backgroundColor: "white",
           }
        },
      "& div > button > span > a":
        {
           color: "grey",
           textDecoration: "none",
           "&:hover": {
              color: "black"
           }
        },
      "& $button": {
         textTransform: "none",
      }
   },
   skeleton: {
      width: 25, height: 25, marginRight: 19
   }
}));

export default function (props) {
   const classes = useStyles();

   return (
     <AppBar position="static" className={classes.root}>
        <Toolbar component={Container} variant={"dense"}>
           <Button disableRipple> <Link to="/">glitcher.org</Link> </Button>
           <Button disableRipple> <Link to="/chess/analysis">Chess db</Link> </Button>
           <Button disableRipple> <Link to="/chess/openings">Chess openings</Link> </Button>
           <Button disableRipple> <Link to="/blog">Blog</Link> </Button>
           <Button disableRipple> <Link to="/about">About</Link> </Button>
           <Box style={{flexGrow: 1}}/>
           {props.isLoading ? <Skeleton variant={"circle"} className={classes.skeleton}/> :
             !props.currentUser ? <Button disableRipple><Link to="/login">Sign in</Link></Button>
               : <Menu logout={props.logout} username={props.currentUser.username}/>
           }
        </Toolbar>
     </AppBar>
   )
}

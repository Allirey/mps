import {AppBar, Button, Container, makeStyles, Toolbar, Box} from "@material-ui/core";
import {Link} from "react-router-dom";
import Menu from '../Menu';
import {Skeleton} from '@material-ui/lab';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const useStyles = makeStyles(theme => ({
   root: {
      position: 'relative',
      zIndex: theme.zIndex.drawer + 1,
      flexGrow: 1,
      "& div": {display: "flex",},
      "& $a": {
         textTransform: "none",
         textDecoration: "none",
      },
      "& div > button": {maxWidth: "200px",},
      "& $button": {textTransform: "none",}
   },
   skeleton: {
      width: 25, height: 25, marginRight: 19
   }
}));

const DesktopHeader = props => {
   const classes = useStyles();

   return <AppBar position="static" className={classes.root}>
      <Toolbar component={Container} variant={"dense"}>
         <Button disableRipple component={Link} to="/"> glitcher.org</Button>
         <Button disableRipple component={Link} to="/chess/analysis"> Chess db </Button>
         <Button disableRipple component={Link} to="/chess/openings"> Chess openings </Button>
         <Button disableRipple component={Link} to="/blog"> Blog </Button>
         <Button disableRipple component={Link} to="/about"> About </Button>
         <Box style={{flexGrow: 1}}/>

         <Button size={"small"} disableRipple onClick={props.toggleTheme}>{props.theme === 'dark' ? <Brightness7Icon/> :
           <Brightness4Icon/>}</Button>

         {props.isLoading ? <Skeleton variant={"circle"} className={classes.skeleton}/> :
           !props.currentUser ? <Button disableRipple component={Link} to="/login">Sign in</Button>
             : <Menu logout={props.logout} username={props.currentUser.username}/>
         }
      </Toolbar>
   </AppBar>
}

export default DesktopHeader

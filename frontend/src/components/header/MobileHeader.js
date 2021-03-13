import {useState} from "react";
import {Link} from "react-router-dom";
import {
   SwipeableDrawer, List, Divider, ListItem, ListItemIcon, ListItemText,
   IconButton, AppBar, Toolbar, Box, Button, makeStyles
} from "@material-ui/core";
import {Search, Home, Info, ChromeReaderMode} from '@material-ui/icons';
import {Skeleton} from '@material-ui/lab';
import MenuIcon from '@material-ui/icons/Menu';
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Menu from './Menu';

const useStyles = makeStyles(theme => ({
   root: {},
   appBar: {
      zIndex: theme.zIndex.drawer + 1,
      color: "black",
      background: theme.palette.secondary.dark,
      flexGrow: 1,
      position: "relative",
   },
   list: {
      width: 250,
   },
}));

export default function SwipeableTemporaryDrawer(props) {
   const classes = useStyles();
   const [state, setState] = useState({
      left: false,
   });

   const toggleDrawer = (anchor, open) => event => {
      if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
         return;
      }

      setState({...state, [anchor]: open});
   };

   const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

   const list = (
     <div
       className={classes.list}
       role="presentation"
       onClick={toggleDrawer('left', false)}
       onKeyDown={toggleDrawer('left', false)}
     >
        <List>
           <ListItem disableRipple button component={Link} to={"/"}>
              <ListItemIcon>
                 <Home/>
              </ListItemIcon>
              <ListItemText primary={"Home"}/>
           </ListItem>

           <ListItem disableRipple button component={Link} to={"/chess/analysis"}>
              <ListItemIcon>
                 <Search/>
              </ListItemIcon>
              <ListItemText primary={"Chess db"}/>
           </ListItem>

           <ListItem disableRipple button component={Link} to={"/chess/openings"}>
              <ListItemIcon>
                 <Search/>
              </ListItemIcon>
              <ListItemText primary={"Chess openings"}/>
           </ListItem>

           <ListItem disableRipple button component={Link} to={"/blog"}>
              <ListItemIcon>
                 <ChromeReaderMode/>
              </ListItemIcon>
              <ListItemText primary={"Blog"}/>
           </ListItem>

           <ListItem disableRipple button component={Link} to={"/about"}>
              <ListItemIcon>
                 <Info/>
              </ListItemIcon>
              <ListItemText primary={"About"}/>
           </ListItem>
        </List>
        <Divider/>
     </div>
   );

   return (
     <div className={classes.root}>
        <AppBar position="static" className={classes.appBar}>
           <Toolbar variant={"dense"}>
              <IconButton
                onClick={toggleDrawer('left', true)}
                aria-label="menu"
                style={{marginRight: 10}}
              ><MenuIcon/></IconButton>

              {/*<Typography variant="h6" style={{flexGrow: 1}}>*/}
              {/*    Glitcher*/}
              {/*</Typography>*/}
              <Box flexGrow={1}/>

              <Button size={"small"} disableRipple onClick={props.toggleTheme}>{props.theme === 'dark' ?
                <Brightness7Icon/> :
                <Brightness4Icon/>}
              </Button>

              {props.isLoading ? <Skeleton variant={"circle"} width={25} height={25} style={{marginRight: 19}}/> :
                !props.currentUser ?
                  <Button disableRipple component={Link} to="/login">Sign in</Button> :
                  <Menu logout={props.logout} username={props.currentUser.username}/>}
           </Toolbar>
        </AppBar>

        <SwipeableDrawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
           {list}
        </SwipeableDrawer>
     </div>
   );
}
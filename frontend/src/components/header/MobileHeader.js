import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    SwipeableDrawer, List, Divider, ListItem, ListItemIcon, ListItemText,
    IconButton, AppBar, Toolbar
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import {Search, Home, AccountTree} from '@material-ui/icons';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
});

export default function SwipeableTemporaryDrawer() {
    const classes = useStyles();
    const [state, setState] = React.useState({
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
                <ListItem button component={Link} to={"/"}>
                    <ListItemIcon>
                        <Home/>
                    </ListItemIcon>
                    <ListItemText primary={"Home"}/>
                </ListItem>
                <ListItem button component={Link} to={"/chess/games"}>
                    <ListItemIcon>
                        <Search/>
                    </ListItemIcon>
                    <ListItemText primary={"Games search"}/>
                </ListItem>
                <ListItem button component={Link} to={"/chess/explorer"}>
                    <ListItemIcon>
                        <AccountTree/>
                    </ListItemIcon>
                    <ListItemText primary="Opening explorer"/>
                </ListItem>
                <ListItem button component={Link} to={"/about"}>
                    <ListItemText primary={"About"}/>
                </ListItem>
            </List>
            <Divider/>
        </div>
    );

    return (
        <div>
            <AppBar position="static" style={{background: "#2B3648", flexGrow: 1}}>
                <Toolbar variant={"dense"}>
                    <IconButton
                        onClick={toggleDrawer('left', true)}
                        aria-label="menu"
                        style={{marginRight: 10, color: "white"}}
                    ><MenuIcon/></IconButton>

                    {/*<Typography variant="h6" style={{flexGrow: 1}}>*/}
                    {/*    Glitcher*/}
                    {/*</Typography>*/}
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
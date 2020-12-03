import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {
    SwipeableDrawer, List, Divider, ListItem, ListItemIcon, ListItemText,
    IconButton, AppBar, Toolbar, Box, Button
} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import {Link} from "react-router-dom";
import {Search, Home, AccountTree, Subject} from '@material-ui/icons';

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

                <ListItem button component={Link} to={"/chess/analysis"}>
                    <ListItemIcon>
                        <Search/>
                    </ListItemIcon>
                    <ListItemText primary={"Chess db"}/>
                </ListItem>

                <ListItem button component={Link} to={"/quizy"}>
                    <ListItemIcon>
                        <Subject/>
                    </ListItemIcon>
                    <ListItemText primary={"Quizy"}/>
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
            <AppBar position="static" style={{background: "#ffffff", flexGrow: 1}}>
                <Toolbar variant={"dense"}>
                    <IconButton
                        onClick={toggleDrawer('left', true)}
                        aria-label="menu"
                        style={{marginRight: 10, color: "grey"}}
                    ><MenuIcon/></IconButton>

                    {/*<Typography variant="h6" style={{flexGrow: 1}}>*/}
                    {/*    Glitcher*/}
                    {/*</Typography>*/}
                    <Box flexGrow={1}/>
                    <Button disableRipple={true} style={{maxWidth: "200px", backgroundColor: "#FFffff"}}>
                            <Link to="/login" style={{textDecoration: 'none', color: "grey"}}>Sign in</Link>
                        </Button>
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
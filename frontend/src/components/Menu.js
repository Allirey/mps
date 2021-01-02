import React from 'react';
import {Button, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, makeStyles} from "@material-ui/core";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

export default function MenuListComposition(props) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = React.useRef(open);
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <div>
                <Button
                    disableRipple
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                >
                    <AccountCircleRoundedIcon/>
                </Button>
                <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    style={{zIndex: 10000}}
                >
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'}}
                        >
                            <Paper                 >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem disableRipple onClick={handleClose}>{props.username}</MenuItem>
                                        <MenuItem disableRipple onClick={props.logout}>Logout</MenuItem>
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}
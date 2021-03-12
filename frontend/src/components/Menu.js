import {Button, ClickAwayListener, Grow, Paper, Popper, MenuItem, MenuList, makeStyles} from "@material-ui/core";
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import {Link} from 'react-router-dom';
import {useEffect, useRef, useState} from "react";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        "& a": {
            textDecoration: "none",
            color: theme.palette.text.primary
        }
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    icon: {}
}));

export default function MenuListComposition(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = e => {
        if (anchorRef.current && anchorRef.current.contains(e.target)) {
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
    const prevOpen = useRef(open);
    useEffect(() => {
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
                    <AccountCircleRoundedIcon className={classes.icon}/>
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
                            <Paper>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        <MenuItem disableRipple component={Link} to={`/users/${props.username}`} onClick={handleClose}>{props.username}</MenuItem>
                                        <MenuItem disableRipple component={Link} to={"/settings"} onClick={handleClose}>Settings</MenuItem>
                                        <MenuItem disableRipple onClick={props.logout}>Sign out</MenuItem>
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
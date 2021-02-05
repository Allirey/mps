import React, {useState, useRef, useEffect} from "react";
import {
   Button,
   ClickAwayListener,
   Grow,
   makeStyles,
   MenuItem,
   MenuList,
   Paper,
   useMediaQuery,
   useTheme, Popper
} from "@material-ui/core";
import FastRewindTwoToneIcon from "@material-ui/icons/FastRewindTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import FastForwardTwoToneIcon from "@material-ui/icons/FastForwardTwoTone";
import SearchIcon from '@material-ui/icons/Search';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import MenuIcon from '@material-ui/icons/Menu';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CachedIcon from '@material-ui/icons/Cached';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import GetAppIcon from '@material-ui/icons/GetApp';

const ACTIONS = {FLIP: 'flip', RESET: 'reset', COPY: 'copy', DOWNLOAD: 'download'}
const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const useStyles = makeStyles(theme => ({
   root: {
      padding: "4px",
      "& $button": {
         margin: "0px 1px",
         minWidth: "45px",
         maxWidth: "45px",
         "& $span": {
            paddingRight: 0,
            paddingLeft: 0,

         },
         paddingRight: 0,
         paddingLeft: 0,
      }
   },
   mobile: {
      "& *": {
         padding: 0
      },
   },
   navBtn: {
      minWidth: "14vw",
      maxWidth: "14vw",
   },
   ffNavBtn: {
      minWidth: "10vw",
      maxWidth: "10vw",
   },
   active: {
      backgroundColor: "black",
      color: "white",
      boxShadow: "0 0 5px #1b78d0, 0 0 20px #1b78d0",
      // boxShadow: "0 2px 2px 0 rgb(0, 0, 0, 14%), 0 3px 1px -2px rgb(0, 0, 0, 20%), 0 1px 5px 0 rgb(0, 0, 0, 12%)",
      "&:hover": {
         backgroundColor: "black",
         color: "white",
         // boxShadow: "0 0 5px #1b78d0,0 0 20px #1b78d0",
      }
   }

}))

export default function (props) {
   const classes = useStyles()
   const [open, setOpen] = useState(false);
   const anchorRef = useRef(null);

   const handleToggle = () => {
      setOpen((prevOpen) => !prevOpen);
   };

   const handleClose = (e, action = '') => {
      if (anchorRef.current && anchorRef.current.contains(e.target)) {
         return;
      }

      switch (action) {
         case ACTIONS.FLIP:
            props.onFlip()
            break
         case ACTIONS.COPY:
            props.onCopy()
            break
         case ACTIONS.DOWNLOAD:
            props.onDownload()
            break
         case ACTIONS.RESET:
            props.onReset()
            break
      }


      setOpen(false);
   };

   function handleListKeyDown(e) {
      if (e.key === 'Tab') {
         e.preventDefault();
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


   const theme = useTheme();

   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

   return (
     <div className={`${classes.root} ${!matchesSM ? classes.mobile : null}`}>

        <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showBook && classes.active}`} disableRipple
                size={"small"}
                onClick={props.onBookClick}> <EqualizerIcon/></Button>

        {props.currentDB === DATABASES.UKR && <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showSearch && classes.active}`}
                disableRipple size={"small"}
                onClick={props.onSearchClick}
        ><SearchIcon/></Button>}


        <Button className={!matchesSM ? classes.ffNavBtn : null} disableRipple size={"small"}
                onClick={props.toFirst}><FastRewindTwoToneIcon/></Button>

        <Button className={!matchesSM ? classes.navBtn : null} disableRipple size={"small"}
                onClick={props.toPrev}><SkipPreviousTwoToneIcon/></Button>

        <Button className={!matchesSM ? classes.navBtn : null} disableRipple size={"small"}
                onClick={props.toNext}><SkipNextTwoToneIcon/></Button>

        <Button className={!matchesSM ? classes.ffNavBtn : null} disableRipple size={"small"}
                onClick={props.toLast}><FastForwardTwoToneIcon/></Button>

        <Button
          className={open ? classes.active : null}
          disableRipple
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleToggle}><MenuIcon/></Button>

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

                         <MenuItem disableRipple onClick={e => handleClose(e, ACTIONS.FLIP)}>
                            <CachedIcon/> Flip board
                         </MenuItem>

                         <MenuItem disableRipple onClick={e => handleClose(e, ACTIONS.COPY)}>
                            <FileCopyIcon/> Copy pgn
                         </MenuItem>

                         <MenuItem disableRipple onClick={e => handleClose(e, ACTIONS.DOWNLOAD)}>
                            <GetAppIcon/> Download pgn
                         </MenuItem>

                         <MenuItem disableRipple onClick={e => handleClose(e, ACTIONS.RESET)}>
                            <InsertDriveFileIcon/> Reset game
                         </MenuItem>

                      </MenuList>
                   </ClickAwayListener>
                </Paper>
             </Grow>
           )}
        </Popper>
     </div>
   )
}

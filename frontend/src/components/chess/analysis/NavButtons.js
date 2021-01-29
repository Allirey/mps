import React from "react";
import {Button, makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import FastRewindTwoToneIcon from "@material-ui/icons/FastRewindTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import FastForwardTwoToneIcon from "@material-ui/icons/FastForwardTwoTone";
import SwapVertTwoToneIcon from "@material-ui/icons/SwapVertTwoTone";
import SearchIcon from '@material-ui/icons/Search';
import EqualizerIcon from '@material-ui/icons/Equalizer';

const useStyles = makeStyles(theme => ({
   root: {
      padding:"4px",
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
      backgroundColor: "green",
      color: "white",
      "&:hover": {
         backgroundColor: "green",
         color: "white",
      }
   }

}))

export default function (props) {
   const classes = useStyles()
   const theme = useTheme();

   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

   return (
     <div className={`${classes.root} ${!matchesSM && classes.mobile}`}>

        <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showBook && classes.active}`} disableRipple
                size={"small"} variant={"outlined"}
                onClick={props.onBookClick}> <EqualizerIcon/></Button>

        <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showSearch && classes.active}`}
                disableRipple size={"small"} variant={"outlined"}
                onClick={props.onSearchClick}
        ><SearchIcon/></Button>


        <Button className={!matchesSM && classes.ffNavBtn} disableRipple size={"small"} variant={"outlined"}
                onClick={props.toFirst}><FastRewindTwoToneIcon/></Button>

        <Button className={!matchesSM && classes.navBtn} disableRipple size={"small"} variant={"contained"}
                style={{backgroundColor: "#00CED1"}}
                onClick={props.toPrev}><SkipPreviousTwoToneIcon/></Button>

        <Button className={!matchesSM && classes.navBtn} disableRipple size={"small"} variant={"contained"}
                style={{backgroundColor: "#00CED1"}}
                onClick={props.toNext}><SkipNextTwoToneIcon/></Button>

        <Button className={!matchesSM && classes.ffNavBtn} disableRipple size={"small"} variant={"outlined"}
                onClick={props.toLast}><FastForwardTwoToneIcon/></Button>

        <Button className={!matchesSM && classes.ffNavBtn} disableRipple size={"small"} variant={"contained"}
                color={"primary"}
                onClick={props.onFlip}><SwapVertTwoToneIcon/></Button>

        {/*<Button variant={"contained"}>reset</Button>*/}
     </div>
   )
}

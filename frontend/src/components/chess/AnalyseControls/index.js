import React from "react";
import {Button, Grid, makeStyles, useMediaQuery, useTheme} from "@material-ui/core";
import FastRewindTwoToneIcon from "@material-ui/icons/FastRewindTwoTone";
import SkipPreviousTwoToneIcon from "@material-ui/icons/SkipPreviousTwoTone";
import SkipNextTwoToneIcon from "@material-ui/icons/SkipNextTwoTone";
import FastForwardTwoToneIcon from "@material-ui/icons/FastForwardTwoTone";
import SearchIcon from '@material-ui/icons/Search';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import CachedIcon from '@material-ui/icons/Cached';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import withStore from "../../../hocs/withStore";

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const useStyles = makeStyles(theme => ({
   root: {
      padding: "4px",
      "& $button": {
         margin: "0px 1px",
         minWidth: "40px",
         maxWidth: "40px",
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
      "&:hover": {
         backgroundColor: "black",
         color: "white",
      }
   }

}))

const AnalyseControls = props => {
   const classes = useStyles()
   const theme = useTheme();
   const {chessNotation: notation, chessOpeningExplorer: chess} = props.stores

   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

   return <Grid container className={`${classes.root} ${!matchesSM ? classes.mobile : null}`} direction={'row'}>
      <Grid item container xs>
         <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showBook && classes.active}`}
                 disableRipple
                 size={"small"}
                 onClick={props.onBookClick}> <EqualizerIcon/></Button>

         {chess.currentDB === DATABASES.UKR &&
         <Button className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showSearch && classes.active}`}
                 disableRipple size={"small"}
                 onClick={props.onSearchClick}
         ><SearchIcon/></Button>}
         {!matchesLG && props.showChaptersButton && <Button
           disableRipple
           onClick={props.onChaptersClick}
           className={`${!matchesSM ? classes.ffNavBtn : null} ${props.showChapters && classes.active}`}
         >
            <FormatListBulletedIcon/>
         </Button>}

      </Grid>

      <Grid item xs={"auto"}>
         <Button className={!matchesSM ? classes.ffNavBtn : null} disableRipple size={"small"}
                 onClick={notation.toFirst}><FastRewindTwoToneIcon/></Button>

         <Button className={!matchesSM ? classes.navBtn : null} disableRipple size={"small"}
                 onClick={notation.toPrev}><SkipPreviousTwoToneIcon/></Button>

         <Button className={!matchesSM ? classes.navBtn : null} disableRipple size={"small"}
                 onClick={notation.toNext}><SkipNextTwoToneIcon/></Button>

         <Button className={!matchesSM ? classes.ffNavBtn : null} disableRipple size={"small"}
                 onClick={notation.toLast}><FastForwardTwoToneIcon/></Button>

         <Button className={!matchesSM ? classes.ffNavBtn : null} disableRipple size={"small"}
                 onClick={notation.flipBoard}><CachedIcon/></Button>
      </Grid>
   </Grid>

}

export default withStore(AnalyseControls)

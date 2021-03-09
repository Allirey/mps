import React from "react";
import {makeStyles, Typography, useMediaQuery, useTheme} from "@material-ui/core";

const NAG_TAGS = {
   '$1': '!', '$2': '?', '$3': '!!', '$4': '??', '$5': '!?', '$6': '?!', '$7': '□', '$10': '=',
   '$13': '∞', '$14': '+/=', '$15': '=/+', '$16': '±', '$17': '∓', '$18': '+-', '$19': '-+',
   '$22': '⨀', '$23': '⨀', '$32': '↑↑', '$36': '↑', '$37': '↑', '$40': '→', '$41': '→',
   '$45': '=/∞', '$46': '=/∞', '$132': '⇆', '$139': '⨁', '$140': '∆', '$146': 'N',
}

const useStyles = makeStyles({
   move: {
      cursor: "pointer",
      whiteSpace: 'nowrap',
      padding: '0.25em 0.17em',
      borderRadius: "3px",
      // fontSize: "0.9em",
      display: "inline-block",
      "&:hover": {
         color: "#fff",
         backgroundColor: "#1b78d0",
      },
   },
   index: {
      color: "#a5a5a5",
      fontSize: "90%",
      paddingRight: "0.2em",
   },
   active: {
      backgroundColor: "#d1e4f6",
      // color: "#FFFFFF",
      "& $span": {
         backgroundColor: "#d1e4f6",
         // color: "#FFFFFF",
      }
   },
   mainline: {
      fontWeight: 500
   },
   mobileMove: {
      fontSize: "0.8em",
   },
   mistake: {color: "#e69f00"},
   blunder: {color: "#df5353"},
   inaccuracy: {color: "#56b4e9"},
});

const Move = ({node, isActive, refs, index, jumpTo, onMenuClick}) => {
   const classes = useStyles();
   const theme = useTheme()
   const onlyXS = useMediaQuery(theme.breakpoints.only('xs'))

   const classByNag = () => {
      const badMoves = {'$2': classes.mistake, '$4': classes.blunder, '$6': classes.inaccuracy}
      if (!node.nag?.some(el => Object.keys(badMoves).includes((el)))) return null

      return badMoves[node.nag[0]]
   }

   return <Typography
     component={"span"}
     onContextMenu={e => onMenuClick(e, node)}
     ref={el => {
        if (isActive) refs[node] = el
     }}
     onClick={() => jumpTo(node)}
     className={`${classes.move} ${isActive ? classes.active : null} \
     ${classes.mainline} ${onlyXS ? classes.mobileMove : null} ${classByNag()}`}>
      {index && <span className={classes.index}>{index}</span>}{node.san}
      {node.nag && node.nag.length ? `${node.nag.map(n => NAG_TAGS[n]).join(' ')}` : ''}
   </Typography>
}

export default Move
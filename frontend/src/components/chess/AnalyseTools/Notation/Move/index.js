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
         backgroundColor: "#d1e4f6",
      },
      fontWeight: "bold",
   },
   index: {
      color: "#a5a5a5",
      fontSize: "90%",
      paddingRight: "0.2em",
   },
   active: {
      backgroundColor: "#d1e4f6",
      "& $span": {backgroundColor: "#d1e4f6",}
   },
   mobileMove: {fontSize: "0.8em",},
   // move glyphs color
   brilliant: {color: "#dd9c38"}, // #e69f00
   good: {color: "#33b333"}, // 5A8D03
   interesting: {color: "#56b4e9"},
   inaccuracy: {color: "#e28aa0"},
   mistake: {color: "#ee5f5b"},
   blunder: {color: "#ff0000"},
});

const Move = ({node, isActive, refs, index, jumpTo, onMenuClick}) => {
   const classes = useStyles();
   const theme = useTheme()
   const onlyXS = useMediaQuery(theme.breakpoints.only('xs'))

   const classByNag = () => {
      const moveClasses = {
         '$1': classes.good, '$3': classes.brilliant, '$5': classes.interesting,
         '$2': classes.mistake, '$4': classes.blunder, '$6': classes.inaccuracy
      }
      if (!node.nag?.some(el => Object.keys(moveClasses).includes((el)))) return null

      return moveClasses[node.nag[0]]
   }

   return <Typography
     component={"span"}
     onContextMenu={e => onMenuClick(e, node)}
     ref={el => {
        if (isActive) refs[node] = el
     }}
     onClick={() => jumpTo(node)}
     className={`${isActive ? classes.active : null} ${classes.move} \
     ${onlyXS ? classes.mobileMove : null} ${classByNag()}`}>
      {index && <span className={classes.index}>{index}</span>}{node.san}
      {node.nag && node.nag.length ? `${node.nag.map(n => NAG_TAGS[n]).join(' ')}` : ''}
   </Typography>
}

export default Move
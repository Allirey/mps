import React, {Fragment, memo, useEffect} from "react";
import {
   makeStyles,
   Menu,
   MenuItem,
   Typography,
   useMediaQuery,
   ThemeProvider,
   createMuiTheme
} from "@material-ui/core";

const initialState = {mouseX: null, mouseY: null,};
const ACTIONS = {PROMOTE: 'promote', DELETE_LINE: 'deleteLine', DELETE_NEXT: 'deleteNext'}
const NAG_TAGS = {
   '$1': '!', '$2': '?', '$3': '!!', '$4': '??', '$5': '!?', '$6': '?!', '$7': '□', '$10': '=',
   '$13': '∞', '$14': '+/=', '$15': '=/+', '$16': '±', '$17': '∓', '$18': '+-', '$19': '-+',
   '$22': '⨀', '$23': '⨀', '$32': '↑↑', '$36': '↑', '$37': '↑', '$40': '→',  '$41': '→',
   '$45': '=/∞', '$46': '=/∞', '$132': '⇆', '$139': '⨁', '$140': '∆', '$146': 'N',
}

const theme = createMuiTheme({
   typography: {
      fontFamily: [
         '-apple-system',
         'BlinkMacSystemFont',
         '"Segoe UI"',
         'Roboto',
         '"Helvetica Neue"',
         'Arial',
         'sans-serif',
         '"Apple Color Emoji"',
         '"Segoe UI Emoji"',
         '"Segoe UI Symbol"',
      ].join(','),
   },
});

const useStyles = makeStyles({
   root: {
      userSelect: "none",
      overflow: "auto",
      cursor: "default",
      padding: 8,
      lineHeight: "1.3",
      position:"relative",


      "& $span": {
         cursor: "pointer",
         whiteSpace: 'nowrap',
         padding: 1,
         borderRadius: 4,
         fontSize: "0.9em",
         fontWeight: 500,
      },
      "& span.active": {
         backgroundColor: "#435866",
         color: "#FFFFFF",
      },
      "& blockquote": {
         borderLeft: "2px solid #ccc",
         paddingLeft: "15px",
         paddingRight: "15px",

         marginRight: 5,
         marginLeft: "0px",
         marginTop: 0,
         marginBottom: 0,
      },
      "& $p": {
         margin: 0,
         padding: 0,
      }
   },
});

function Notation(props) {
   const classes = useStyles();
   const [menuState, setMenuState] = React.useState(initialState);
   const [contextMove, setContextMove] = React.useState(null);
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'))

   const refs = {}


   useEffect(() => {
      refs[props.currentNode] && refs[props.currentNode].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })

   }, [props.currentNode])

   const handleClick = (event, move) => {
      event.preventDefault();
      setContextMove(move)

      setMenuState({
         mouseX: event.clientX - 2,
         mouseY: event.clientY - 4,
      });
   };

   const handleClose = (action = '') => {
      switch (action) {
         case ACTIONS.PROMOTE:
            props.promoteLine(contextMove)
            break
         case ACTIONS.DELETE_NEXT:
            props.deleteRemaining(contextMove)
            break
         case ACTIONS.DELETE_LINE:
            props.deleteLine(contextMove)
            break
      }

      setMenuState(initialState);
      setContextMove(null)
   }

   const toArr = linked => {
      const nodes = [];

      let currentNode = linked.first;
      while (currentNode) {
         nodes.push(currentNode);
         currentNode = currentNode.next;
      }
      return nodes
   }

   const nodes = toArr(props.notation);

   const renderTree = (data, appender = 0) => {
      const moveCount = i => Math.round((i + appender + 1) / 2)
      return (
        <Fragment>
           {data.map((node, i) => {
              return <Fragment key={i}>
                 <Typography
                   component={"span"}
                   onContextMenu={(e) => handleClick(e, node)}
                   ref={el => {
                      if (node.san === props.currentNode.san && node.fen === props.currentNode.fen)
                         refs[node] = el
                   }}
                   key={`${node.san}${node.fen}`}
                   onClick={() => props.jumpTo(node)}
                   className={props.currentNode === node && !!node.san ? "active" : null}>
                    {(i + appender) % 2 ? `${moveCount(i)}.` : !i && !!node.san && `${moveCount(i) - 1}...`}{node.san}
                    {node.nag && node.nag.length ? `${node.nag.map(n => NAG_TAGS[n]).join(' ')}` : ''}
                 </Typography>{" "}{node.subLines.map((variation, j) =>
                <blockquote key={`${variation.first.fen}${j + 100}`}>{renderTree(toArr(variation), i + appender)}
                </blockquote>)}
              </Fragment>
           })}
        </Fragment>
      )
   }

   return (
     <ThemeProvider theme={theme}>
        <div className={classes.root}>
           {nodes.length !== 1 ? renderTree(nodes) :
             <Typography variant="h4" color="textSecondary"
                         style={{opacity: 0.2}}>{!matchesOnlyXS && "Notation"}</Typography>}
        </div>
        <Menu
          className={classes.menu}
          keepMounted
          open={menuState.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
             menuState.mouseY !== null && menuState.mouseX !== null
               ? {top: menuState.mouseY, left: menuState.mouseX}
               : undefined
          }
        >
           <MenuItem tabIndex={0} disableRipple onClick={() => handleClose(ACTIONS.PROMOTE)}>promote line</MenuItem>
           <MenuItem tabIndex={0} disableRipple onClick={() => handleClose(ACTIONS.DELETE_NEXT)}>delete next
              moves</MenuItem>
           <MenuItem tabIndex={0} disableRipple onClick={() => handleClose(ACTIONS.DELETE_LINE)}>delete line</MenuItem>
        </Menu>
     </ThemeProvider>
   )
}

export default memo(Notation)
import {Fragment, memo, useEffect, useState} from "react";
import {
   makeStyles,
   Menu,
   MenuItem,
   Typography,
   useMediaQuery,
   ThemeProvider,
   createMuiTheme, Paper
} from "@material-ui/core";

import Move from './Move'

const initialState = {mouseX: null, mouseY: null,};
const ACTIONS = {PROMOTE: 'promote', DELETE_LINE: 'deleteLine', DELETE_NEXT: 'deleteNext'}

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
      height: "100%",
      touchAction: "manipulation",
      userSelect: "none",
      overflow: "auto",
      cursor: "default",
      padding: "7px 3px 7px 7px",
      lineHeight: "1.4",
      // position: "relative",
      "& blockquote": {
         borderLeft: "2px solid #ccc",
         paddingLeft: "15px",
         paddingRight: "15px",

         marginRight: 5,
         marginLeft: "0px",
         marginTop: 0,
         marginBottom: 0,
      },
   },
});

function Notation(props) {
   const classes = useStyles();
   const [menuState, setMenuState] = useState(initialState);
   const [contextMove, setContextMove] = useState(null);
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'))

   const refs = {}

   useEffect(() => {
      refs[props.currentNode] && refs[props.currentNode].scrollIntoView({
         // behavior: 'smooth',
         block: 'center',
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
              const index = (i + appender) % 2 ? `${moveCount(i)}.` : !i && !!node.san && `${moveCount(i) - 1}...`
              return <Fragment key={i}>
                 <Move
                   node={node}
                   isActive={props.currentNode === node && !!node.san}
                   refs={refs}
                   index={index}
                   jumpTo={props.jumpTo}
                   onMenuClick={handleClick}
                 />

                 {node.subLines.map((variation, j) => <blockquote key={`${variation.first.fen}${j + 100}`}>
                    {renderTree(toArr(variation), i + appender)}
                 </blockquote>)}
              </Fragment>
           })}
        </Fragment>
      )
   }

   return (
     <ThemeProvider theme={theme}>
        <div className={classes.root}>
           {nodes.length > 1 ? renderTree(nodes) :
             <Typography variant="h4" color="textSecondary"
                         style={{opacity: 0.2}}>{!matchesOnlyXS && "Notation"}</Typography>}
        </div>
        <Menu
          transitionDuration={0}
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
import React, {Fragment} from "react";
import {makeStyles, Typography, Menu, MenuItem} from "@material-ui/core";

const initialState = {
   mouseX: null,
   mouseY: null,
};

const ACTIONS = {
   PROMOTE: 'promote',
   DELETE_LINE: 'deleteLine',
   DELETE_NEXT: 'deleteNext'
}

const useStyles = makeStyles({
   root: {
      userSelect: "none",
      overflow: "auto",
      height: "35vh",
      cursor: "default",
      padding: 5,
      lineHeight: "1.3",

      "& $span": {
         cursor: "pointer",
         whiteSpace: 'nowrap',
         padding: 1,
         borderRadius: 4,
         "&:hover": {
            backgroundColor: "lightblue",
         }
      },
      "& span.active": {
         backgroundColor: "#435866",
         color: "#FFFFFF",
         "&:hover": {
            backgroundColor: "#435866",
         }
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
   }
});

function Notation(props) {
   const classes = useStyles();
   const [menuState, setMenuState] = React.useState(initialState);
   const [contextMove, setContextMove] = React.useState(null);

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
                 <span
                   onContextMenu={(e) => handleClick(e, node)}
                   key={node.san}
                   onClick={() => props.jumpTo(node)}
                   className={props.currentNode === node && !!node.san ? "active" : null}>
         {(i + appender) % 2 ? `${moveCount(i)}.` : !i && !!node.san && `${moveCount(i) - 1}...`}{node.san}
         </span>{" "}{node.subLines.map(variation =>
                <blockquote key={i}>{console.log(node.san)}{renderTree(toArr(variation), i + appender)}</blockquote>)}
              </Fragment>
           })}
        </Fragment>
      )
   }

   if (nodes === []) return <></>;

   return (
     <>
        {/*<Typography><h3>{game.white} - {game.black} {game.result}</h3></Typography>*/}
        <Typography className={classes.root}>
           {renderTree(nodes)}
        </Typography>
        <Menu
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
           <MenuItem disableRipple disabled onClick={() => handleClose(ACTIONS.PROMOTE)}>promote line</MenuItem>
           <MenuItem disableRipple onClick={() => handleClose(ACTIONS.DELETE_NEXT)}>delete next moves</MenuItem>
           <MenuItem disableRipple onClick={() => handleClose(ACTIONS.DELETE_LINE)}>delete line</MenuItem>
        </Menu>
     </>
   )
}

export default Notation
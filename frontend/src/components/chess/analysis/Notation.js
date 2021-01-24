import React, {Fragment} from "react";
import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles({
   root: {
      overflow: "auto",
      height: "35vh",
      cursor: "default",
      padding: 5,

      "& $span": {
         cursor: "pointer",
         whiteSpace: 'nowrap',
         padding: 1,
      },
      "& span.active": {
         backgroundColor: "#435866",
         color: "#FFFFFF",
         borderRadius: 4,
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

   const toArr = tree => {
      const nodes = [];

      let currentNode = tree.first;
      while (currentNode) {
         nodes.push(currentNode);
         currentNode = currentNode.next;
      }
      return nodes
   }

   const nodes = toArr(props.notation);

   // todo this shit should be refactored one day, but for now it's worked, and fuck you notation!! fuck you!!!
   const renderTree = (data, appender = 0) => {
      const M = (pr) => <span key={pr.move.san}
                              onClick={() => {
                                 props.jumpTo(pr.move)
                              }}
                              className={props.currentNode === pr.move && !!pr.move.san ? "active" : null}>
         {pr.i % 2 === 1 ? Math.round((pr.i + 1) / 2) + '.' :
           (pr.dots ? `${Math.round((pr.i + 1) / 2) - 1}...` : '')}{pr.move.san}</span>
      return (
        <>
           {data.map((node, i) => {
              return !node.subLines.length ? <Fragment key={i}>{<M move={node} i={i + appender}
                                                   dots={i === 0 && !!node.san}/>}{" "}</Fragment> :
                <Fragment key={i}><M i={i + appender} move={node} dots={i === 0}/>{" "}{node.subLines.map(variation => {
                   return <blockquote key={variation.parentMove.fen}>
                      {renderTree(toArr(variation), i + appender)}
                   </blockquote>
                })} </Fragment>
           })}
        </>
      )
   }

   if (nodes === []) return <></>;

   return (
     <>
        {/*<Typography><h3>{game.white} - {game.black} {game.result}</h3></Typography>*/}
        <Typography className={classes.root}>
           {renderTree(nodes)}
        </Typography>
     </>
   )
}

export default Notation
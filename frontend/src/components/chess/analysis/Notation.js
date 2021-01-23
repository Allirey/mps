import React from "react";
import {makeStyles, Typography} from "@material-ui/core";

const useStyles = makeStyles({
   root: {
      overflow: "auto",
      height: "35vh",
      cursor: "default",

      "& span": {
         cursor: "pointer",
         whiteSpace: 'nowrap'
      },
      "& span.active": {
         backgroundColor: "#435866",
         color: "#FFFFFF",
         borderRadius: 4,
      },
      "& blockquote":{
         borderLeft: "4px solid #ccc",
         paddingLeft: "7px",

         marginLeft: "0px",
         marginTop: 0,
         marginBottom: 0,
      },
      "& $p":{
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
   console.log(nodes.map(x=> x.san))
      return nodes
   }

   const nodes = toArr(props.notation);

   const renderTree = data => {
      return (
        <>
           {data.map(x => {
              return !x.subLines.length? <span key={x.san}>{x.san}{' '}</span>:
                <><span key={x.san}>{x.san}</span>{x.subLines.map(x => {
                    return <blockquote key={x.parentMove.fen}>
                       {renderTree(toArr(x))}
                    </blockquote>
                 })} </>
           })}
        </>
      )
   }

   if (nodes === []) return <></>;

   return (
     <>
        {/*<Typography><h3>{game.white} - {game.black} {game.result}</h3></Typography>*/}
        <Typography className={classes.root}>
           {/*{renderTree(nodes)}*/}
           {nodes.map((move, i) => (
             <React.Fragment key={i}>
                        <span
                          onClick={() => {
                             props.jumpTo(move)
                          }}
                          className={props.currentNode === move ? "active" : null}
                        >
                            {i % 2 === 1 ? Math.round((i + 1) / 2) + '. ' : ''}{move.san}
                        </span>
                {' '}
             </React.Fragment>
           ))}
        </Typography>
     </>
   )
}

export default Notation
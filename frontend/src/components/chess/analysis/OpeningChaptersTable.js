import {Grid, makeStyles, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(theme => ({
   root: {
       overflow: "auto"
   },
   active: {
      backgroundColor: '#45474e',
      "& $span":{color:"white"},
      color:"white",
      "&:hover": {
         backgroundColor: '#45474e',
         "& $span":{color:"white"},
      }
   }
}))

const ChaptersTable = (props) => {
   const classes = useStyles()

   return <div className={classes.root}>
      <Table size={"small"} >
      <TableBody>
         {props.currentOpening && props.currentOpening.chapters.map(chapter =>
           <TableRow className={props.currentChapter && props.currentChapter.id === chapter.id && classes.active}
                     key={chapter.id} style={{cursor: "pointer"}} onClick={() => props.getChapter(chapter.id)}>
              <TableCell>
                 <Typography component={"span"} variant={"h6"} style={{display: "block"}}>{chapter.title}</Typography>
                 <Typography component={"span"} style={{display: "block"}}>{chapter.description}</Typography>
              </TableCell>
           </TableRow>
         )}
      </TableBody>
   </Table></div>
}

export default ChaptersTable
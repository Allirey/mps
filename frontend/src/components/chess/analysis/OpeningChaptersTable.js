import {Grid, makeStyles, Table, TableBody, TableCell, TableRow, Typography} from "@material-ui/core";
import React from "react";
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
   root: {
      overflow: "auto",
      userSelect:"none",
      "& $a": {
         textDecoration: "none",
         color: "black",
      }
   },
   active: {
      backgroundColor: '#45474e',
      "& h2": {color: "white"},
      color: "white",
      "&:hover": {
         backgroundColor: '#45474e',
         "& h2": {color: "white"},
      }
   }
}))

const ChaptersTable = (props) => {
   const classes = useStyles()

   return <div className={classes.root}>
      <Table size={"small"}>
         <TableBody>
            {props.currentOpening && props.currentOpening.chapters.map((chapter, i) =>
              <TableRow
                className={props.currentChapter && props.currentChapter.url === chapter.url ? classes.active: null}
                key={chapter.url}
                style={{cursor: "pointer"}}
              >
                 <TableCell>
                    <Link to={`/chess/openings/${props.currentOpening.slug}/${i + 1}`}>
                       <Typography component={"h2"} variant={"h5"}
                                   style={{display: "block"}}>{chapter.title}</Typography>
                       <Typography color={'textSecondary'} component={"h2"} style={{display: "block"}}>{chapter.description}</Typography>
                    </Link>
                 </TableCell>
              </TableRow>
            )}
         </TableBody>
      </Table></div>
}

export default ChaptersTable
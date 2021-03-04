import React, {useEffect, useState} from 'react'
import withStore from "../../hocs/withStore";
import {useParams} from 'react-router-dom'
import {
   Container,
   Grid,
   makeStyles,
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   Typography
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
   root: {paddingTop: theme.spacing(2)},
   chaptersTable: {
      userSelect: "none",
      "& > tbody > tr": {
         cursor: "pointer",
      }
   },
   active: {
      backgroundColor: "cyan"
   }
}))

const EditOpening = props => {
   const classes = useStyles()
   const currentOpening = props.stores.openings.currentOpening
   const currentChapter = props.stores.openings.currentChapter
   const {slug} = useParams()
   const [selectedChapter, setSelectedChapter] = useState()

   useEffect(() => {
      props.stores.openings.getOpening(slug)
      return () => {
         props.stores.openings.currentOpening = null
      }
   }, [])
   const handleRowClick = slug => {
      props.stores.openings.getChapter(slug)
      setSelectedChapter(slug)
   }

   return <Grid container component={Container} className={classes.root} direction={"column"}>
      <Grid item>
         <Typography component={"h2"} variant={"h5"} align={"center"}>{currentOpening?.title}</Typography>
      </Grid>
      <Grid container direction={"row"}>
         <Grid item>
            <Table size={"small"} className={classes.chaptersTable}>
               <TableHead>
                  <TableRow>
                     <TableCell>Title</TableCell>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {currentOpening?.chapters.map(ch => <TableRow onClick={()=> handleRowClick(ch.url)}>
                     <TableCell>{`${ch.title} ${ch.description}`}</TableCell>
                  </TableRow>)}
               </TableBody>
            </Table>
         </Grid>
         <Grid item>
            <pre>
               {currentChapter && JSON.stringify(currentChapter.data, null, 2)}
            </pre>

         </Grid>

      </Grid>
   </Grid>
}

export default withStore(EditOpening)
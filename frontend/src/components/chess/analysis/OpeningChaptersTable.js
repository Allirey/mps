import {Grid, makeStyles, Typography} from "@material-ui/core";
import React from "react";
import {Link} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
   root: {
      // padding: "8px",
      margin:"8px",
      overflow: "auto",
      userSelect: "none",
      // flexFlow: 'row nowrap',
      cursor: "pointer",
      "& $a": {
         textDecoration: "none",
         color: "black",
      },

      "& $h3": {
         // display:"flex",
         flex: "1 1 100%",
         fontSize: "1em",
         fontWeight: "normal",
         lineHeight: "1",
         margin: "0.5em 0",
         wordBreak: 'break-word',

    //      marginBlockStart: "1em",
    // marginBlockEnd: "1em",
    marginInlineStart: "0px",
    marginInlineEnd: "0px",
      },
      "& $span": {
         display: "flex",
         flex: '0 0 1.7em',
         fontWeight: 'bold',
         color: '#1b78d0',
         opacity: 0.8,
         marginRight: "0.4em",
         height: "auto",
      },
      "& $div": {
         // flexFlow: 'row nowrap',
      },

   },
   active: {
      "& $span": {
         color: '#fff',
         backgroundColor: '#1b78d0',
      },
      backgroundColor: '#e8f2fa',
      "&:hover": {
         backgroundColor: '#e8f2fa',
      }
   }
}))

const ChaptersTable = (props) => {
   const classes = useStyles()

   return <div className={classes.root}>
      {props.currentOpening && props.currentOpening.chapters.map((chapter, i) =>
        <Grid container direction={"row"}
              component={Link}
              to={`/chess/openings/${props.currentOpening.slug}/${i + 1}`}
              className={props.currentChapter && props.currentChapter.url === chapter.url ? classes.active : null}
              key={chapter.url}
              // alignItems={"center"}
              justify={"space-between"}
              // alignContent={"space-between"}
        >
           <Grid item component={"span"} container justify={"center"} alignContent={"center"}>{i + 1}</Grid>
           <Grid item component={"h3"}>
                 {`${chapter.title.replace('Chapter ', '').replace(/\d+\. /, '')}: ${chapter.description}`}
                 {/*sgdhrsejx dchjekc cdhgjdckej cdhdjckw dcrhejrck crr5chjsgdhrsejx dchjekc cdhgjdckej cdhdjckw dcrhejrck crr5chjsgdhrsejx dchjekc cdhgjdckej cdhdjckw dcrhejrck crr*/}
           </Grid>
        </Grid>
      )}
   </div>
}

export default ChaptersTable
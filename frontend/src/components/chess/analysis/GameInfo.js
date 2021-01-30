import React from "react";
import {Grid, makeStyles, Paper, Typography} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
   root: {
      padding: 8,
      backgroundColor: "#d5f3e3",
      height: "120px",
      "& $h6": {
         fontSize: "1em",
         padding: 0,
         margin: 0,
      },
      marginBottom: theme.spacing(2)
   },
}));

export const GameInfo = props => {
   const classes = useStyles();
   const data = props.data ? props.data :
     {
        White: "White", WhiteElo: "ELO", Black: "Black", BlackElo: "ELO", Date: "Date", Event: "Event", Result: "?-?"
     }

   return <Paper>
      <Grid  container direction={"row"} justify={"space-between"} className={classes.root}
            style={{opacity: props.data ? 1 : 0.2}}>
         <Grid item xs={4}>
            <div><Typography gutterBottom={false} align={"left"} variant={"h6"}>{data.White.split(' ')[0].replace(',', '')}</Typography>
            </div>
            <div><Typography gutterBottom={false} align={"left"} variant={"h6"}>{data.White.split(' ').splice(1).join(' ')}</Typography>
            </div>
            <div><Typography align={"left"}>{data.WhiteElo || 0}</Typography></div>
         </Grid>
         <Grid item xs={4}>
            <div><Typography align={"center"} variant={"h6"}>{data.Result}</Typography></div>
            <div><Typography align={"center"} variant={"body2"}>{data.Event}</Typography></div>
            <div><Typography align={"center"}>{data.Date}</Typography></div>

         </Grid>
         <Grid item xs={4}>
            <div><Typography align={"right"} variant={"h6"}>{data.Black.split(' ')[0].replace(',', '')}</Typography>
            </div>
            <div><Typography align={"right"} variant={"h6"}>{data.Black.split(' ').splice(1).join(' ')}</Typography>
            </div>
            <div><Typography align={"right"}>{data.BlackElo || 0}</Typography></div>
         </Grid>
      </Grid>
   </Paper>

}

export default GameInfo

import {Grid, makeStyles, Paper, Typography, useMediaQuery, useTheme} from "@material-ui/core";
import withStore from "../../../hocs/withStore";

const useStyles = makeStyles((theme) => ({
   root: {
      userSelect: "none",
      padding: 8,
      backgroundColor: "#cdeefa",
      // height: "120px",
      "& $h6": {
         fontSize: "1em",
         padding: 0,
         margin: 0,
      },
   },
}));

export const GameMeta = props => {
   const classes = useStyles();
   const theme = useTheme();
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'))

   const data = props.stores.chessNotation.gameHeaders
   const isDefaultHeader = data.White === '?' && data.Black === '?'

   return <>{(!matchesOnlyXS || !isDefaultHeader) && <Grid component={matchesOnlyXS? "div": Paper}>
      <Grid container direction={"row"} justify={"space-between"} className={classes.root}
            style={{opacity: isDefaultHeader ? 0.2 : 1, marginBottom: matchesOnlyXS? 0: theme.spacing(2)}}>

         {matchesOnlyXS ? <><span>{data.White}</span><span><b>{data.Result.replace('1/2-1/2', '½-½')}</b></span> <span>{data.Black}</span></> :
           <>
              <Grid item xs={4}>
                 <div><Typography gutterBottom={false} align={"left"}
                                  variant={"h6"}>{data.White.split(' ')[0].replace(',', '')}</Typography>
                 </div>
                 <div><Typography gutterBottom={false} align={"left"}
                                  variant={"h6"}>{data.White.split(' ').splice(1).join(' ')}</Typography>
                 </div>
                 <div><Typography align={"left"}>{data.WhiteElo || 0}</Typography></div>
              </Grid>
              <Grid item xs={4}>
                 <div><Typography align={"center"} variant={"h6"}>{data.Result}</Typography></div>
                 <div><Typography align={"center"} variant={"body2"}>{data.Event}</Typography></div>
                 <div><Typography align={"center"}>{data.Date}</Typography></div>

              </Grid>
              <Grid item xs={4}>
                 <div><Typography align={"right"}
                                  variant={"h6"}>{data.Black.split(' ')[0].replace(',', '')}</Typography>
                 </div>
                 <div><Typography align={"right"}
                                  variant={"h6"}>{data.Black.split(' ').splice(1).join(' ')}</Typography>
                 </div>
                 <div><Typography align={"right"}>{data.BlackElo || 0}</Typography></div>
              </Grid></>
         }
      </Grid>
   </Grid>}</>

}

export default withStore(GameMeta)

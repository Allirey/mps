import React from "react";
import {Button, Grid, TextField, Switch, Typography, withStyles, makeStyles} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
   root: {
      padding: "4px 10px",
   },

}))

const StyledSwitch = withStyles((theme) => ({
   switchBase: {
      color: theme.palette.grey[500],
      '&$checked': {
         transform: 'translateX(12px)',
         color: theme.palette.grey[500],
         '& + $track': {
            opacity: 1,
            backgroundColor: "black",
            borderColor: theme.palette.primary.main,
         },
      },
   },
   track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      backgroundColor: theme.palette.common.white,
   },
   checked: {},
}))(Switch);

export default function (props) {
   const classes = useStyles();

   return (
     <Grid className={classes.root} container direction={"row"} alignItems={"center"} justify={"space-between"} spacing={1}>
        <Grid item>
           <TextField
             autoFocus
             margin={"normal"}
             variant={"outlined"}
             size={"small"}
             label={"Player name"}
             value={props.name}
             onChange={props.onChangeName}
             onKeyDown={props.onKeyPressed}
           />
        </Grid>
        <Grid item>
           <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                 <Grid item>White</Grid>
                 <Grid item>
                    <StyledSwitch
                      disableRipple
                      checked={!props.color}
                      onChange={props.onChangeColor}
                      size={"small"}
                    />
                 </Grid>
                 <Grid item>Black</Grid>
              </Grid>
           </Typography>
        </Grid>
        <Grid item>
           <Button
             size={"small"}
             disableRipple variant={"contained"}
             style={{backgroundColor: "lightblue", textTransform: "none"}}
             onClick={props.onSubmit}
           ><SearchIcon/></Button>
        </Grid>
     </Grid>
   )
}

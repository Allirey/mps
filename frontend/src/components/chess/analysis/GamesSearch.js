import React from "react";
import {Button, Grid, TextField, Switch, Typography, withStyles, makeStyles} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
   root: {
      padding: "4px 10px",
      // border: "1px solid #000"
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
     <Grid className={classes.root} container direction={"row"} alignItems={"center"} justify={"space-evenly"}>
        <Grid item>
           <TextField
             style={{width: 110}}
             autoFocus
             margin={"normal"}
             size={"small"}
             label={""}
             placeholder={"Player name"}
             InputProps={{disableUnderline: true}}
             value={props.name}
             onChange={props.onChangeName}
             onKeyDown={props.onKeyPressed}
             spellCheck={false}
           />
        </Grid>
        <Grid item>
           <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                 <Grid item>w</Grid>
                 <Grid item>
                    <StyledSwitch
                      disableRipple
                      checked={!props.color}
                      onChange={props.onChangeColor}
                      size={"small"}
                    />
                 </Grid>
                 <Grid item>b</Grid>
              </Grid>
           </Typography>
        </Grid>
        <Grid item>
           <Button
             size={"small"}
             disableRipple
             style={{maxWidth: 45, minWidth: 45}}
             onClick={props.onSubmit}
           ><SearchIcon/></Button>
        </Grid>
     </Grid>
   )
}

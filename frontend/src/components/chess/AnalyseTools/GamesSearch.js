import {memo} from "react";
import {Button, Grid, TextField, Switch, Typography, withStyles, makeStyles, Container} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(theme => ({
   root: {
      padding: "10px",
      margin: "16px",
      width: "75vw",
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

const SearchBox = props => {
   const classes = useStyles();

   return <Container
     component={Grid}
     container
     className={classes.root}
     maxWidth={"xs"}
     spacing={2}
     direction={'column'}
   >

      <Grid item>
         <TextField
           autoFocus
           fullWidth
           label={""}
           placeholder={"Player name"}
           variant={"outlined"}
           value={props.name}
           onChange={e => props.onChangeName(e.target.value)}
           onKeyDown={e =>  e.keyCode === 13 && props.onSubmit()}
           spellCheck={false}
         />
      </Grid>

      <Grid item component={Typography} container alignItems="center" spacing={1}>
         <Grid item>white</Grid>
         <Grid item>
            <StyledSwitch
              disableRipple
              checked={props.color}
              onChange={e => props.onChangeColor(e.target.checked ? 'b' : 'w')}
              size={"small"}
            />
         </Grid>
         <Grid item>black</Grid>
      </Grid>

      <Grid item>
         <Button
           variant={"outlined"}
           fullWidth
           disableRipple
           onClick={props.onSubmit}
         >search</Button>
      </Grid>
   </Container>
}

export default memo(SearchBox)

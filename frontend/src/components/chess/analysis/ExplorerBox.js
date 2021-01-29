import React, {memo, useEffect} from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   withStyles,
   TableContainer,
   makeStyles, Typography, Button, Grid
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const result = {0: '0-1', 0.5: '1/2', 1: '1-0'}

const useStyles = makeStyles((theme) => ({
   root: {
      // fontSize: "0.8em",
      overflow: "auto",
      // height: "30vh",

      // "& $tr:hover": {backgroundColor: "cyan"},
      '&:hover table > tbody > tr:hover': {
         backgroundColor: 'cyan'
      },
      "& $tr": {
         height: "30px",
      },
      "& $th": {
         backgroundColor: "#c0d6a7"
      },

      // borderBottom: "1px solid #ccc",
   },
   gamesTable: {
      "&::-webkit-scrollbar": {display: "none",},
      borderBottom: "1px solid #ccc",
      // height: "66vh",
      // height: "20vh",
      "& tbody > tr": {cursor: "pointer",},
      '& tbody > tr:nth-child(even)': {backgroundColor: '#f7f6f4'},
      '&:hover table > tbody > tr:hover': {backgroundColor: 'cyan'},
      "& thead > tr > th": {
         backgroundColor: "#ebebeb",
         color: "black",
         border: "none",
      },
      "& tbody > tr > td": {
         // fontSize: '0.9em',
         padding: "0px 5px",
         border: "none",
      },
   }
}));

const StyledTableCell = withStyles((theme) => ({
   head: {
      backgroundColor: "#ebebeb",
      color: "black",
      border: "none",
   },
   body: {
      fontSize: "0.9em",
      padding: "2px 16px",
      border: "none",
   },
}))(TableCell);

const ExplorerBox = props => {
   const classes = useStyles();
   const [old, setOld] = React.useState([])
   const [opacity, setOpacity] = React.useState(1)

   useEffect(() => {
      if (!props.loading) {
         setOld(props.games)
         setOpacity(1)
      } else setOpacity(0.3)
   })

   const games = props.games;
   const explorerData = props.explorerData;

   if (!old || !old.length) return <Grid style={{height: "40vh"}} container justify={"center"} direction={"column"}
                                         alignItems={"center"}>
      <Typography variant={"h6"} align={"center"}> No games found</Typography>
      <Typography align={"center"}>
         <Button disableRipple style={{color: "#1b78d0"}} onClick={props.close}><CloseIcon/>Close</Button>
      </Typography>
   </Grid>

   return <TableContainer className={classes.root}>
      <Table size={"small"}>
         <TableHead>
            <TableRow>
               <StyledTableCell>Moves</StyledTableCell>
               <StyledTableCell>Games</StyledTableCell>
               <StyledTableCell>Score</StyledTableCell>
               <StyledTableCell>Year</StyledTableCell>
            </TableRow>
         </TableHead>
         <TableBody>
            {typeof (explorerData) == "undefined" ? null : explorerData.map((row, i) =>
              <TableRow key={i} hover style={{cursor: "pointer"}}
                        onClick={() => props.onMove(row.move)}>
                 <StyledTableCell><strong>{row.move}</strong></StyledTableCell>
                 <StyledTableCell>{row.games}</StyledTableCell>
                 <StyledTableCell>{row.score + '%'}</StyledTableCell>
                 <StyledTableCell>{row.date.split('-')[0]}</StyledTableCell>
              </TableRow>
            )}
         </TableBody>
      </Table>
      <Table className={classes.gamesTable} size={"small"}>
         <TableHead>
            <TableRow>
               <TableCell colSpan={4} align={"center"}>Games ({props.games.length})</TableCell>
            </TableRow>
         </TableHead>
         <TableBody style={{opacity: opacity}}>{old ? old.map((game, i) => (
           <TableRow key={game.url} hover={true} onClick={() => props.onSelectGame(game.url)}>
              <TableCell>{game.white.split(', ')[0]}</TableCell>
              <TableCell>{game.black.split(', ')[0]}</TableCell>
              <TableCell align={"center"}>{result[[game.result]]}</TableCell>
              <TableCell>{game.date.split('.')[0]}</TableCell>
           </TableRow>)) : <TableCell colSpan={4}>No search Results...</TableCell>}
         </TableBody>
      </Table>
   </TableContainer>
}

export default memo(ExplorerBox)

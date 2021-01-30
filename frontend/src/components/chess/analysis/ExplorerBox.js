import React, {memo, useEffect} from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   withStyles,
   TableContainer,
   makeStyles, Typography, Button, Grid, useTheme, useMediaQuery, Box
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

const WhiteWin = props => <span
  style={{
     backgroundColor: "#fff",
     color:"black",
     borderRadius: "3px",
     textAlign: "center",
     boxShadow:'0 -5px 7px rgb(0, 0, 0, 10%) inset',
     padding: "3px 5px",
  }}>
   1-0</span>

const BlackWin = props => <span
  style={{
     backgroundColor: "#555",
     color:"white",
     borderRadius: "3px",
     textAlign: "center",
     boxShadow:'0 5px 7px rgb(255, 255, 255, 20%) inset',
     padding: "3px 5px",
  }}>
   0-1</span>

const Draw = props => <span
  style={{
     backgroundColor: "#a0a0a0",
     color:"white",
     borderRadius: "3px",
     textAlign: "center",
     boxShadow:'0 5px 7px rgb(255, 255, 255, 20%) inset',
     padding: "3px 5px",
  }}>
   ½-½</span>

const result = {0: <BlackWin/>, 0.5: <Draw/>, 1: <WhiteWin/>}


const useStyles = makeStyles((theme) => ({
   root: {
      userSelect: "none",
      // transition: "all 150ms",
      // fontSize: "0.8em",
      overflow: "auto",
      // height: "30vh",

      // "& $tr:hover": {backgroundColor: "cyan"},
      '&:hover table > tbody > tr:hover': {
         backgroundColor: 'cyan'
      },
      "& $tr": {
         // height: "30px",
      },
      "& $th": {
         backgroundColor: "#d5f3e3",
         padding: 0,
      },

      // borderBottom: "1px solid #ccc",
   },
   gamesTable: {
      // "&::-webkit-scrollbar": {display: "none",},
      borderBottom: "1px solid #ccc",
      // height: "66vh",
      // height: "20vh",
      "& tbody > tr": {cursor: "pointer"},
      '& tbody > tr:nth-child(even)': {backgroundColor: '#f7f6f4'},
      '&:hover table > tbody > tr:hover': {backgroundColor: 'cyan'},
      "& thead > tr > th": {
         backgroundColor: "#ebebeb",
         color: "black",
         border: "none",
      },
      "& tbody > tr > td": {
         "& $span":{
            display: "block",
         },
         fontSize: '0.8em',
         padding: "5px 0px 5px 7px",
         border: "none",
      },

   }
}));

const StyledTableCell = withStyles((theme) => ({
   head: {
      backgroundColor: "#ebebeb",
      color: "black",
      border: "none",
      textAlign: "center",
   },
   body: {
      fontSize: "0.9em",
      padding: "2px 12px",
      border: "none",
      textAlign:"center",
   },
}))(TableCell);

const ExplorerBox = props => {
   const classes = useStyles();
   const theme = useTheme();

   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

   const [oldGames, setOldGames] = React.useState([])
   const [oldMoves, setOldMoves] = React.useState([])
   const [opacity, setOpacity] = React.useState(1)


   useEffect(() => {
      if (!props.loading) {
         setOldGames(props.games)
         setOldMoves(props.explorerData)
         setOpacity(1)
      } else setOpacity(0.3)
   })

   const games = props.games;
   const explorerData = props.explorerData;

   if (!oldGames || !oldGames.length) return <Grid style={{height: "40vh"}} container justify={"center"} direction={"column"}
                                         alignItems={"center"}>
      <Typography variant={"h6"} align={"center"}> No games found</Typography>
      <Typography align={"center"}>
         <Button disableRipple style={{color: "#1b78d0"}} onClick={props.close}><CloseIcon/>Close</Button>
      </Typography>
   </Grid>

   return <TableContainer className={classes.root} >
      <Table size={"small"}>
         <TableHead>
            <TableRow style={{textAlign:"center"}}>
               <StyledTableCell>Moves</StyledTableCell>
               <StyledTableCell>Games</StyledTableCell>
               <StyledTableCell>Score</StyledTableCell>
               <StyledTableCell>Year</StyledTableCell>
            </TableRow>
         </TableHead>
         <TableBody style={{opacity: opacity}}>
            {oldMoves && oldMoves.map((row, i) =>
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
         <TableBody style={{opacity: opacity}}>{oldGames ? oldGames.map((game, i) => (
           <TableRow selected={false} key={game.url} hover={true} onClick={() => props.onSelectGame(game.url)}>
              <TableCell width={'15%'}>
                 <span>{game.whiteelo}</span>
                 <span>{game.blackelo}</span>
              </TableCell>
              <TableCell>
                 <span>{game.white}</span>
                 <span>{game.black}</span>
              </TableCell>
              <TableCell width={'18%'}>{result[[game.result]]}</TableCell>
              <TableCell width={'15%'}>{game.date.split('-')[0]}</TableCell>
           </TableRow>)) : <TableCell colSpan={4}>No search Results...</TableCell>}
         </TableBody>
      </Table>
   </TableContainer>
}

export default memo(ExplorerBox)

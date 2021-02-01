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

const useStyles = makeStyles((theme) => ({
   root: {
      userSelect: "none",
      // transition: "all 150ms",
      // fontSize: "0.8em",
      overflow: "auto",
      // height: "30vh",

      // "& $tr:hover": {backgroundColor: "cyan"},
      '&:hover table > tbody > tr:hover': {backgroundColor: 'cyan'},
      "& $tr": {
         // height: "30px",
      },
      "& $th": {backgroundColor: "#d5f3e3", padding: 0,},
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
         "& $span": {display: "block",},
         fontSize: '0.8em',
         padding: "5px 0px 5px 7px",
         border: "none",
      },
   },
   white: {
      backgroundColor: "#fff",
      color: "black",
      // padding: "3px 5px",
      textAlign: "center",
      boxShadow: '0 -5px 7px rgb(0, 0, 0, 10%) inset',
      borderRadius: "3px 0 0 3px",
   },
   black: {
      backgroundColor: "#555",
      color: "white",
      // padding: "3px 5px",
      textAlign: "center",
      boxShadow: '0 5px 7px rgb(255, 255, 255, 20%) inset',
      borderRadius: "0 3px 3px 0",
   },
   draw: {
      backgroundColor: "#a0a0a0",
      color: "white",
      // padding: "3px 5px",
      textAlign: "center",
      boxShadow: '0 5px 7px rgb(255, 255, 255, 20%) inset',
   },
   result: {borderRadius: "3px",},
   bar: {
      whiteSpace: "nowrap",
      width: "100%",
      fontSize: "0.8em",
      lineHeight: "15px",
      verticalAlign:'middle',
      "& $span":{
         height:"15px",
         border: '0 solid #d9d9d9',
    borderWidth: '1px 0',
         verticalAlign: "middle",
         padding: "2px 0"
      }
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
      textAlign: "center",
   },
}))(TableCell);

const ExplorerBox = props => {
   const classes = useStyles();
   const result = {
      0: {res: '0-1', cls: classes.black},
      0.5: {res: '½-½', cls: classes.draw},
      1: {res: '1-0', cls: classes.white}
   }

   const getPercentage = data => {
      console.log(typeof data.white);
      let total = data.white + data.draw + data.black
      let white = +(data.white / total * 100).toFixed(1)
      let draw = +(data.draw / total * 100).toFixed(1)
      let black = +(data.black / total * 100).toFixed(1)

      return {total, white, draw, black}
   }

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

   if (!oldGames || !oldGames.length) return <Grid style={{height: "40vh"}} container justify={"center"}
                                                   direction={"column"}
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
               <StyledTableCell width={"15%"}>Moves</StyledTableCell>
               <StyledTableCell width={"15%"}>Games</StyledTableCell>
               <StyledTableCell width={"45%"}>White/Draw/Black</StyledTableCell>
               <StyledTableCell width={"15%"}>Year</StyledTableCell>
            </TableRow>
         </TableHead>
         <TableBody style={{opacity: opacity}}>
            {oldMoves && oldMoves.sort((x, y) => (y.white + y.draw + y.black) - (x.white + x.draw + x.black))
              .map((row, i) => {
                 const {total, white, draw, black} = getPercentage(row)

                 return <TableRow key={i} hover style={{cursor: "pointer"}}
                                  onClick={() => props.onMove(row.move)}>
                    <StyledTableCell><strong>{row.move}</strong></StyledTableCell>
                    <StyledTableCell>{total}</StyledTableCell>
                    <StyledTableCell>
                       <div className={classes.bar}>
                        <span className={classes.white}
                              style={{width: `${white}%`, display: "inline-block"}}>
                             {`${white > 11 ? white.toFixed(0) : ''}${white > 20 ? '%' : ''}`}</span>
                          <span className={classes.draw}
                                style={{width: `${draw}%`, display: "inline-block"}}>
                           {`${draw > 11 ? draw.toFixed(0) : ''}${draw > 20 ? '%' : ''}`}</span>
                          <span className={classes.black}
                                style={{width: `${black}%`, display: "inline-block"}}>
                           {`${black > 11 ? black.toFixed(0) : ''}${black > 20 ? '%' : ''}`}</span>
                       </div>
                    </StyledTableCell>
                    <StyledTableCell>{row.date.split('-')[0]}</StyledTableCell>
                 </TableRow>
              })}
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
              <TableCell width={'18%'}>
                 <span className={`${result[[game.result]]['cls']} ${classes.result}`}>
                    {result[[game.result]]['res']}
                 </span>
              </TableCell>
              <TableCell width={'15%'}>{game.date.split('-')[0]}</TableCell>
           </TableRow>)) : <TableCell colSpan={4}>No search Results...</TableCell>}
         </TableBody>
      </Table>
   </TableContainer>
}

export default memo(ExplorerBox)

import React, {memo, useEffect, useState} from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableRow,
   withStyles,
   TableContainer,
   makeStyles, Typography, Button, Grid, useTheme, useMediaQuery
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneIcon from '@material-ui/icons/Done';

const DATABASES = {UKR: 'ukr', MASTER: "master", LICHESS: 'lichess'}

const useStyles = makeStyles((theme) => ({
   root: {
      position: "relative",
      fontSize: "0.9em",
      userSelect: "none",
      '&:hover table > tbody > tr:hover': {backgroundColor: '#fff9d6'},
   },
   movesTable: {
      // "& $td": {padding : 0},
      '& tbody > tr:nth-child(even)': {backgroundColor: '#f7f6f4'},
      "& $th": {backgroundColor: "#d5f3e3"},
      "& tbody > tr > td:first-child": {
         lineHeight: "30px",
         paddingLeft: "7px",
         textAlign: "center",
      },
      "& tbody > tr > td:nth-child(2)": {
         fontSize: "0.75em",
         textAlign: "right",
      },
      "& tbody > tr > td:last-child": {
         paddingRight: "7px",
      },
   },
   gamesTable: {
      borderBottom: "1px solid #ccc",
      "& tbody > tr": {cursor: "pointer"},
      '& tbody > tr:nth-child(even)': {backgroundColor: '#f7f6f4'},
      "& thead > tr > th": {
         backgroundColor: "#ebebeb",
         color: "black",
         border: "none",
      },
      "& tbody > tr > td": {
         "& $span": {display: "block",},
         fontSize: '0.9em',
         padding: "5px 0px 5px 7px",
         border: "none",
      },
   },
   white: {
      backgroundColor: "#fff",
      color: "black",
      padding: "2px 0",
      textAlign: "center",
      boxShadow: '0 -5px 7px rgb(0, 0, 0, 10%) inset',
   },
   black: {
      backgroundColor: "#555",
      color: "white",
      padding: "2px 0",
      textAlign: "center",
      boxShadow: '0 5px 7px rgb(255, 255, 255, 20%) inset',
   },
   draw: {
      backgroundColor: "#a0a0a0",
      color: "white",
      padding: "2px 0",
      textAlign: "center",
      boxShadow: '0 5px 7px rgb(255, 255, 255, 20%) inset',
   },
   result: {borderRadius: "3px"},
   bar: {
      whiteSpace: "nowrap",
      width: "100%",
      fontSize: "0.9em",
      "& $span:first-child": {
         borderLeftWidth: "1px",
         borderRadius: "3px 0 0 3px",
      },
      "& $span:last-child": {
         borderRightWidth: "1px",
         borderRadius: "0 3px 3px 0",
      },
      "& $span": {
         height: "16px",
         // lineHeight: "14px",
         border: '0 solid #d9d9d9',
         borderWidth: '1px 0',
         verticalAlign: "middle",
         padding: "1px 0",
         textAlign: "center",
         display: "inline-block",
         fontSize: "0.9em",
      }
   },
   settings: {
      position: "absolute",
      top: 0,
      right: 0,
      cursor: "pointer",
      display: "block",
      fontSize: "1.2em",
      width: "1.5em",
      lineHeight: "1.5em",
      textAlign: "center",
      opacity: 0.6,
      "&:hover": {
         opacity: 1
      }
   },
   active: {
      backgroundColor: 'lightgreen',
      "&:hover":{
         backgroundColor: 'lightgreen',
      },

   }
}));

const StyledTableCell = withStyles((theme) => ({
   head: {
      backgroundColor: "#ebebeb",
      color: "black",
      border: "none",
      textAlign: "center",
      padding: "0px 3px",
   },
   body: {
      // fontSize: "0.9em",
      padding: "0px 7px",
      border: "none",
   },
}))(TableCell);

const ExplorerBox = props => {
   const classes = useStyles();
   const theme = useTheme();
   const [showSettings, setShowSettings] = useState(false)
   const [selectedDb, setSelectedDb] = useState(props.currentDB)

   const [oldGames, setOldGames] = useState([])
   const [oldMoves, setOldMoves] = useState([])
   const [opacity, setOpacity] = useState(1)

   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));

   useEffect(() => {
      if (!props.loading) {
         setOldGames(props.games)
         setOldMoves(props.explorerData)
         setOpacity(1)
      } else setOpacity(0.4)
   })

   const result = {
      0: {res: '0-1', cls: classes.black},
      0.5: {res: '½-½', cls: classes.draw},
      1: {res: '1-0', cls: classes.white}
   }

   const getPercentage = data => {
      let total = data.white + data.draw + data.black
      let white = +(data.white / total * 100).toFixed(1)
      let draw = +(data.draw / total * 100).toFixed(1)
      let black = +(data.black / total * 100).toFixed(1)

      return {total, white, draw, black}
   }

   const handleRowClick = (url) => {
      let db = props.currentDB === DATABASES.UKR? 'u':'lc'
      let link = `/chess/${db}/${url}`
      window.open(link, '_blank', 'noopener')
   }

   if (!oldGames || !oldGames.length) return <Grid style={{height: "40vh"}} container justify={"center"}
                                                   direction={"column"}
                                                   alignItems={"center"}>
      <Typography variant={"h6"} align={"center"}> No games found</Typography>
      <Typography align={"center"}>
         <Button disableRipple style={{color: "#1b78d0"}} onClick={props.close}><CloseIcon/>Close</Button>
      </Typography>
   </Grid>

   return <TableContainer className={classes.root}>
                <span onClick={() => setShowSettings(!showSettings)} className={classes.settings}>
         {!showSettings ? <SettingsIcon/> : <CloseIcon/>}
      </span>
      {showSettings ?
        <Grid container style={{height: "40vh"}} direction={"column"}>
           <div style={{backgroundColor: '#d5f3e3'}}>Opening explorer</div>
           <br/>
           <div><b>Database</b></div>
           <Grid item container direction={'row'} justify={"center"}>
              {Object.entries(DATABASES).map(([key, value]) => {
                 return <Button key={value} className={value === selectedDb ? classes.active: null}
                                disableRipple
                                onClick={() => setSelectedDb(value)}>
                    {value}</Button>
              })}
           </Grid>
           <Grid item container justify={"center"}>
              <Button disableRipple onClick={() => {
                 props.changeDB(selectedDb)
                 setShowSettings(false)
              }}><DoneIcon/>Save</Button>
           </Grid>
        </Grid> :
        <>
           <Table size={"small"} className={classes.movesTable}>
              <TableHead>
                 <TableRow>
                    <StyledTableCell width={"15%"}>Moves</StyledTableCell>
                    <StyledTableCell width={"14%"}>Games</StyledTableCell>
                    <StyledTableCell width={"48%"}>White/Draw/Black</StyledTableCell>
                    <StyledTableCell width={"12%"}>Year</StyledTableCell>
                 </TableRow>
              </TableHead>
              <TableBody style={{opacity: opacity}}>
                 {oldMoves && oldMoves.slice().sort((x, y) => (y.white + y.draw + y.black) - (x.white + x.draw + x.black))
                   .map((row, i) => {
                      const {total, white, draw, black} = getPercentage(row)

                      return <TableRow key={i} hover style={{cursor: "pointer"}}
                                       onClick={() => props.onMove(row.san)}>
                         <StyledTableCell><strong>{row.san}</strong></StyledTableCell>
                         <StyledTableCell>{total}</StyledTableCell>
                         <StyledTableCell>
                            <div className={classes.bar}>
                               {!!white && <span className={classes.white} style={{width: `${white}%`}}>
                             {`${white > 11 ? white.toFixed(0) : ''}${white > 20 ? '%' : ''}`}</span>}
                               {!!draw && <span className={classes.draw} style={{width: `${draw}%`}}>
                           {`${draw > 11 ? draw.toFixed(0) : ''}${draw > 20 ? '%' : ''}`}</span>}
                               {!!black && <span className={classes.black} style={{width: `${black}%`}}>
                           {`${black > 11 ? black.toFixed(0) : ''}${black > 20 ? '%' : ''}`}</span>}
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
                    <TableCell colSpan={4} align={"center"}>Games {!!props.games && props.games.length?`(${props.games.length})`: ''}</TableCell>
                 </TableRow>
              </TableHead>
              <TableBody style={{opacity: opacity}}>{oldGames ? oldGames.map((game, i) => (
                <TableRow selected={false} key={game.url} hover={true} onClick={() => handleRowClick(game.url)}>
                   <TableCell width={'15%'}>
                      <span>{game.whiteelo}</span>
                      <span>{game.blackelo}</span>
                   </TableCell>
                   <TableCell>
                      <span>{game.white}</span>
                      <span>{game.black}</span>
                   </TableCell>
                   <TableCell width={'18%'}>
                 <span className={`${result[game.result]['cls']} ${classes.result}`}>
                    {result[game.result]['res']}
                 </span>
                   </TableCell>
                   <TableCell width={'15%'}>{game.date.split('-')[0]}</TableCell>
                </TableRow>)) : <TableCell colSpan={4}>No search Results...</TableCell>}
              </TableBody>
           </Table>
        </>
      }
   </TableContainer>
}

export default memo(ExplorerBox)

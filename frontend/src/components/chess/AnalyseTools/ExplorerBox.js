import {memo, useEffect, useState} from "react";
import {
   Table, TableBody, TableCell, TableHead, TableRow, withStyles, makeStyles, Typography, Button, Grid, Dialog
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import SettingsIcon from '@material-ui/icons/Settings';
import DoneIcon from '@material-ui/icons/Done';
import GamesSearch from "./GamesSearch";

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const useStyles = makeStyles((theme) => ({
   root: {
      position: "relative",
      fontSize: "0.9em",
      userSelect: "none",
      '&:hover table > tbody > tr:hover': {backgroundColor: `${theme.palette.action.selected}`},
   },
   movesTable: {
      // "& $td": {padding : 0},
      '& tbody > tr:nth-child(even)': {backgroundColor: `${theme.palette.background.default}`},
      "& $th": {backgroundColor: `${theme.palette.secondary.light}`},
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
      '& tbody > tr:nth-child(even)': {backgroundColor: `${theme.palette.background.default}`},
      "& thead > tr > th": {
         backgroundColor: `${theme.palette.secondary.light}`,
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
         // border: '0 solid #d9d9d9',
         border: `0 solid ${theme.palette.divider}`,
         borderWidth: '1px 0',
         verticalAlign: "middle",
         padding: "1px 0",
         textAlign: "center",
         display: "inline-block",
         fontSize: "0.9em",
      }
   },
   settingsBtn: {
      position: "absolute",
      top: 0,
      right: 4,
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
   settings:{
      backgroundColor: `${theme.palette.secondary.light}`,
   },
   active: {
      backgroundColor: `${theme.palette.primary.light}`,
      "&:hover": {
         backgroundColor: `${theme.palette.primary.main}`,
      },
   }
}));

const StyledTableCell = withStyles(theme => ({
   head: {
      backgroundColor: "#ebebeb",
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
   const [showSettings, setShowSettings] = useState(false)
   const [selectedDb, setSelectedDb] = useState(props.currentDB)

   const [oldGames, setOldGames] = useState([])
   const [oldMoves, setOldMoves] = useState([])
   const [opacity, setOpacity] = useState(1)

   useEffect(() => {
      if (!props.loading) {
         setOldGames(props.games)
         setOldMoves(props.explorerData)
         setOpacity(1)
      } else setOpacity(0.4)
   }, [props.loading, props.explorerData, props.games])

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
      let db = props.currentDB === DATABASES.UKR ? 'u' : 'lc'
      let link = `/chess/${db}/${url}`
      window.open(link, '_blank', 'noopener')
   }

   const handleClose = () => {
      props.toggleBook()
   }

   return <div className={classes.root}>
                <span onClick={() => setShowSettings(!showSettings)} className={classes.settingsBtn}>
         {!showSettings ? <SettingsIcon/> : <CloseIcon/>}
      </span>

      {showSettings ?
        <Grid container direction={"column"}>
           <div className={classes.settings}>Opening explorer</div>
           <br/>
           <div><b>Database</b></div>
           <Grid item container direction={'row'} justify={"center"}>
              {Object.entries(DATABASES).map(([key, value]) => {
                 return <Button key={value} className={value === selectedDb ? classes.active : null}
                                disableRipple
                                onClick={() => setSelectedDb(value)}>
                    {value}</Button>
              })}
           </Grid>
           <Grid item style={{padding: 16}}>
              {selectedDb === DATABASES.UKR &&
              <Typography align={"center"}>230k OTB games of ukrainian players from 1980 to 2020. Works <b>only</b> with
                 filter
                 (name,color). Use search.</Typography>}
              {selectedDb === DATABASES.MASTERS &&
              <Typography align={"center"}>Two million OTB games of 2200+ FIDE rated players from 1952 to
                 2019</Typography>}
              {selectedDb === DATABASES.LICHESS &&
              <Typography align={"center"}>Lichess filters coming soon...</Typography>}
           </Grid>
           <Grid item container style={{marginTop: "0 16px"}} justify={"center"}>
              <Button className={classes.active} disableRipple onClick={() => {
                 props.changeDB(selectedDb)
                 setShowSettings(false)
              }}><DoneIcon/></Button>
           </Grid>
        </Grid> :

        !oldGames || !oldGames.length ? <Grid style={{height: "250px"}} container justify={"center"}
                                              direction={"column"}
                                              alignItems={"center"}>
             <Typography variant={"h6"} align={"center"}> No games found ({props.currentDB} db)</Typography>
             <Typography align={"center"}>
                <Button disableRipple style={{color: "#1b78d0"}} onClick={handleClose}><CloseIcon/>Close</Button>
             </Typography>
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
                      <TableCell colSpan={4}
                                 align={"center"}>Games {!!props.games && props.games.length ? `(${props.games.length})` : ''}</TableCell>
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
      <Dialog transitionDuration={0} open={props.showSearch} onClose={props.closeSearch} >
         <GamesSearch
           name={props.name}
           color={props.color}
           onSubmit={props.onSubmit}
           onChangeColor={props.onChangeColor}
           onChangeName={props.onChangeName}
         />
      </Dialog>
   </div>
}

export default memo(ExplorerBox)

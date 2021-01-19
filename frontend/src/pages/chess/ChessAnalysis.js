import React, {useState, useEffect} from "react";
import GamesTable from "../../components/chess/analysis/GamesTable";
import GamesSearch from "../../components/chess/analysis/GamesSearch";
import MovesTree from "../../components/chess/analysis/MovesTree";
import Notation from "../../components/chess/analysis/Notation";
import NavButtons from "../../components/chess/analysis/NavButtons";

import ChessBoard from 'react-chessground'
// import "react-chessground/dist/assets/chessground.css"
import "react-chessground/dist/styles/chessground.css"
// import "react-chessground/dist/assets/theme.css"

import {Grid, Box, makeStyles, useTheme, useMediaQuery} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import StyledTabs from "../../components/StyledTabs";
import {Helmet} from "react-helmet";

const useStyles = makeStyles(theme => ({
   root: {},

   chessField: {
        }

}))

const ChessAnalysis = (props) => {
   const classes = useStyles();
   const theme = useTheme();
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));

   const {chessNotation: notation, chessOpeningExplorer: chess} = props.stores

   useEffect(() => {
      return () => {
         notation.chessGame.reset()
         notation.resetNode()
      }
   }, [])

   return (
     <>
        <Helmet
        title={"Ukrainian chess database"}
        />
     <Grid container justify={"space-evenly"}>
        <Grid item display={{xs: "none", lg: "block"}} lg={4} component={Box}>
           <GamesSearch
             name={chess.searchData.name}
             color={chess.searchData.color}
             onSubmit={chess.searchGames}
             onChangeColor={e => chess.setColor(e.target.value)}
             onChangeName={e => chess.setName(e.target.value)}
             onKeyPressed={e => e.keyCode === 13 ? chess.searchGames() : []}
           />
           <GamesTable
             games={chess.currentGames}
             onSelectGame={chess.getGameByUrl}
           />
        </Grid>

        <Grid item container xs={12} sm={12} md={7} lg={8} justify={"center"} >
           <Grid item lg={8} container direction={"column"}>

              <Grid item>
                 <div className={classes.chessField}
                      onWheel={e => e.deltaY < 0 ? notation.toPrev() : notation.toNext()}>
                    <ChessBoard
                      width={matchesSM ? "512px" : "90vmin"}
                      height={matchesSM ? "512px" : "90vmin"}
                      orientation={notation.boardOrientation}
                      viewOnly={false}
                      turnColor={notation.turnColor()}
                      movable={notation.calcMovable()}
                      // lastMove={notation.lastMove()}
                      fen={notation.currentFen}
                      // check={"false"}
                      style={{margin: "auto"}}
                      coordinates={false}
                      onMove={notation.onMove}
                    />
                 </div>
              </Grid>

              <Box display={{sm: "block", lg: "none"}}>
                 <Grid item container justify={"center"}>
                    <NavButtons
                      toFirst={notation.toFirst}
                      toLast={notation.toLast}
                      toNext={notation.toNext}
                      toPrev={notation.toPrev}
                      onFlip={notation.flipBoard}
                    />
                 </Grid>
              </Box>
           </Grid>

           <Grid item component={Box} display={{xs: "none", lg: "block"}} lg={4}>
              <Notation
                notation={notation.mainLineNodes}
                currentNode={notation.node}
                jumpTo={notation.jumpToMove}
              />
              <br/>
              <MovesTree explorerData={chess.currentMoves}/>
              <Grid component={Box} container justify={"center"} display={{sm: "none", lg: "block"}}>
                 <NavButtons
                   toFirst={notation.toFirst}
                   toLast={notation.toLast}
                   toNext={notation.toNext}
                   toPrev={notation.toPrev}
                   onFlip={notation.flipBoard}
                 />
              </Grid>
           </Grid>

        </Grid>

        <Grid item component={Box} display={{xs: "block", lg: "none"}} xs sm md={5}>
           <StyledTabs variant={"fullWidth"}
                       tabs={{
                          "Notation":
                            <>
                               <Notation
                                 notation={notation.mainLineNodes}
                                 currentNode={notation.node}
                                 jumpTo={notation.jumpToMove}
                               />
                            </>
                          ,
                          "Games":
                            <>
                               <GamesSearch
                                 name={chess.searchData.name}
                                 color={chess.searchData.color}
                                 onSubmit={chess.searchGames}
                                 onChangeColor={e => chess.setColor(e.target.value)}
                                 onChangeName={e => chess.setName(e.target.value)}
                                 onKeyPressed={e => e.keyCode === 13 ? chess.searchGames() : []}
                               />
                               <GamesTable
                                 games={chess.currentGames}
                                 onSelectGame={chess.getGameByUrl}
                               />
                            </>,
                          "Book":
                            <>
                               <MovesTree explorerData={chess.currentMoves}/>
                            </>
                       }}
           />
        </Grid>
     </Grid></>
   )
}

export default withStore(ChessAnalysis)
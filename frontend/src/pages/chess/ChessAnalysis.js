import React, {useState, useEffect} from "react";
import GamesTable from "../../components/chess/analysis/GamesTable";
import GamesSearch from "../../components/chess/analysis/GamesSearch";
import MovesTree from "../../components/chess/analysis/MovesTree";
import Notation from "../../components/chess/analysis/Notation";
import NavButtons from "../../components/chess/analysis/NavButtons";

import ChessBoard from 'react-chessground'
import "react-chessground/dist/styles/chessground.css"
import ChessBoardBlueTheme from './chessBoardBlue.svg'
import "./cburnett.css"
import wR from './pieces/wR.svg'
import wQ from './pieces/wQ.svg'
import wB from './pieces/wB.svg'
import wN from './pieces/wN.svg'
import bR from './pieces/bR.svg'
import bQ from './pieces/bQ.svg'
import bN from './pieces/bN.svg'
import bB from './pieces/bB.svg'

import {Grid, Box, makeStyles, useTheme, useMediaQuery, Dialog, DialogActions, Button} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import StyledTabs from "../../components/StyledTabs";
import {Helmet} from "react-helmet";
import logo from "../../public/photo5233438708856892657.jpg"

const pieceImages = {
   'white': {'q': wQ, 'n': wN, 'r': wR, 'b': wB,},
   'black': {'q': bQ, 'n': bN, 'r': bR, 'b': bB,},
}


const useStyles = makeStyles(theme => ({
   root: {},

   chessField: {
      "& .cg-wrap": {
         backgroundImage: `url(${ChessBoardBlueTheme})`
      },
      "& cg-board square.last-move": {
         backgroundColor: "lightgreen",
         opacity: "0.41"
      }
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
          title={"Ukrainian chess games database"}
        >
           <meta name={"description"} content={"Search and analyse."}/>
           <meta property={"og:title"} content={"Ukrainian chess games database"}/>
           <meta property={"og:description"} content={"Search and analyse."}/>
           <meta property={"og:type"} content={"website"}/>
           <meta name="twitter:card" content="summary"/>
           <meta name="twitter:title" content="Ukrainian chess games database"/>
           <meta name="twitter:description" content="Search and analyse."/>
           <meta name="twitter:image" content={logo}/>
           <meta name="twitter:site:id" content="741164490"/>
        </Helmet>
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

           <Grid item container xs={12} sm={12} md={7} lg={8} justify={"center"}>
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
                         movable={notation.calcMovable}
                         lastMove={notation.lastMove}
                         fen={notation.currentNode.fen}
                         check={notation.inCheck}
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
                   notation={notation.rootLine}
                   currentNode={notation.currentNode}
                   jumpTo={notation.jumpToMove}
                   promoteLine={notation.promoteLine}
                   deleteRemaining={notation.deleteRemaining}
                   deleteLine={notation.deleteLine}
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
                                    notation={notation.rootLine}
                                    currentNode={notation.currentNode}
                                    jumpTo={notation.jumpToMove}
                                    promoteLine={notation.promoteLine}
                                    deleteRemaining={notation.deleteRemaining}
                                    deleteLine={notation.deleteLine}
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
        </Grid>
        <Dialog open={notation.showPieceSelectMenu} onClose={() => {
           notation.showPieceSelectMenu = false;
           notation.pendingMove = null;
        }}>
           {['q', 'n', 'r', 'b'].map(piece =>
             <DialogActions key={piece}>
                <Button disableRipple onClick={() => notation.promotion(piece)}>
                   <img src={pieceImages[notation.turnColor()][piece]} alt={''}/>
                </Button>
             </DialogActions>
           )}
        </Dialog>
     </>
   )
}

export default withStore(ChessAnalysis)
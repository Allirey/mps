import React, {useState, useEffect} from "react";
import GamesSearch from "../../components/chess/analysis/GamesSearch";
import Notation from "../../components/chess/analysis/Notation";
import NavButtons from "../../components/chess/analysis/NavButtons";
import GameInfo from "../../components/chess/analysis/GameInfo";
import ExplorerBox from "../../components/chess/analysis/ExplorerBox";

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

import {
   Grid,
   makeStyles,
   useTheme,
   useMediaQuery,
   Dialog,
   DialogActions,
   Button,
   createMuiTheme
} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import {Helmet} from "react-helmet";

const breakpointValues = {
   xs: 0,
   lt: 650,
   sm: 720,
   md: 960,
   lg: 1280,
   xl: 1920,
};
const theme = createMuiTheme({breakpoints: {values: breakpointValues}});

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
      },
   }
}))

const ChessAnalysis = (props) => {
   const classes = useStyles();
   const theme = useTheme();
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'));
   let refEl = React.createRef();

   const [showBook, setShowBook] = useState(true);
   const [showSearch, setShowSearch] = useState(false);
   const boardSize = matchesLG ? "512px" : matchesOnlyXS ? "100vmin" : "448px"

   const {chessNotation: notation, chessOpeningExplorer: chess} = props.stores

   useEffect(() => {
      refEl.addEventListener('wheel', e => e.preventDefault(), {passive: false});
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
           <meta name="twitter:site:id" content="741164490"/>
        </Helmet>

        <Grid container direction={"row"}>

           <Grid item container direction={"column"} lg style={{padding: matchesSM ? "8px" : 0}}>
              {matchesLG && <Grid item style={{maxHeight: "17vh"}}>
                 <GameInfo data={notation.gameHeaders}/>
              </Grid>}
           </Grid>

           <Grid item container justify={"center"}
                 style={{padding: matchesSM ? "8px" : 0}}
                 sm md lg>
              {matchesMD && !matchesLG && <Grid item style={{maxHeight: "17vh", width: "90%"}}>
                 <GameInfo data={notation.gameHeaders}/>
              </Grid>}
              <Grid item>
                 <div ref={elem => refEl = elem} className={classes.chessField}
                      onWheel={e => e.deltaY < 0 ? notation.toPrev() : notation.toNext()}>
                    <ChessBoard
                      width={matchesLG ? "544px" : matchesOnlyXS ? "100vmin" : matchesMD ? "448px" : "384px"}
                      height={matchesLG ? "544px" : matchesOnlyXS ? "100vmin" : matchesMD ? "448px" : "384px"}
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

                 {!matchesLG && <Grid item>
                    <Grid container justify={"center"}>
                       <NavButtons
                         toFirst={notation.toFirst}
                         toLast={notation.toLast}
                         toNext={notation.toNext}
                         toPrev={notation.toPrev}
                         onFlip={notation.flipBoard}
                         onSearchClick={() => setShowSearch(!showSearch)}
                         onBookClick={() => setShowBook(!showBook)}
                         showBook={showBook}
                         showSearch={showSearch}
                       />
                    </Grid>
                 </Grid>}

                 {showSearch && <Grid item><GamesSearch
                   name={chess.searchData.name}
                   color={chess.searchData.color === 'w'}
                   onSubmit={() => {
                      setShowSearch(false);
                      chess.searchGames()
                   }}
                   onChangeColor={e => chess.setColor(e.target.checked ? 'b' : 'w')}
                   onChangeName={e => chess.setName(e.target.value)}
                   onKeyPressed={e =>
                     e.keyCode === 13 && (chess.searchGames() | setShowSearch(false))}

                 /></Grid>}
              </Grid>
           </Grid>

           <Grid container direction={"column"} sm md lg item style={{
              height: "90vh",
              // padding: matchesMD ? "8px" : 4,
              border: "1px solid #ccc",
              // maxWidth: "90%",
              // marginRight: "20px",
              padding: matchesSM ? "8px" : 0
           }}>
              <Grid sm md item style={{
                 // minHeight: showBook ? "35vh" : "75vh",
                 // maxHeight: showBook ? "35vh" : "75vh",
                 overflow: "auto"
              }}>
                 <Notation
                   notation={notation.rootLine}
                   currentNode={notation.currentNode}
                   jumpTo={notation.jumpToMove}
                   promoteLine={notation.promoteLine}
                   deleteRemaining={notation.deleteRemaining}
                   deleteLine={notation.deleteLine}
                 />
              </Grid>

              {showBook && <Grid item sm md style={{overflow: "auto"}}>
                 <ExplorerBox
                   explorerData={chess.currentMoves}
                   onMove={notation.makeSanMove}
                   loading={chess.inProgress}
                   currentGames={chess.currentGames}
                   games={chess.currentGames}
                   onSelectGame={(url) => {
                      chess.getGameByUrl(url);
                      setShowSearch(false)
                   }}
                   close={() => setShowBook(!showBook)}
                 />
              </Grid>}

              {matchesLG && <Grid item>
                 <Grid container justify={"center"}>
                    <NavButtons
                      toFirst={notation.toFirst}
                      toLast={notation.toLast}
                      toNext={notation.toNext}
                      toPrev={notation.toPrev}
                      onFlip={notation.flipBoard}
                      onSearchClick={() => setShowSearch(!showSearch)}
                      onBookClick={() => setShowBook(!showBook)}
                      showBook={showBook}
                      showSearch={showSearch}
                    />
                 </Grid>
              </Grid>}
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
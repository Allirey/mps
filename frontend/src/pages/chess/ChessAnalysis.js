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
import Colobki from './undraw_elements_cipa.svg'
import Error404 from "../../errors/error404";

import {
   Grid,
   makeStyles,
   useMediaQuery,
   Dialog,
   DialogActions,
   Button,
   createMuiTheme, Fade,
} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import {Helmet} from "react-helmet";
import {useParams} from 'react-router-dom'

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const breakpointValues = {
   xs: 0,
   sm: 700,
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
   root: {
      touchAction: "manipulation",
   },
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
   // const theme = useTheme();
   const {db, id} = useParams()
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'));
   const matchesOnlySM = useMediaQuery(theme.breakpoints.only('sm'));
   const matchesOnlyMD = useMediaQuery(theme.breakpoints.only('md'));
   let refEl = React.createRef();

   const [showBook, setShowBook] = useState(false);
   const [showSearch, setShowSearch] = useState(false);
   const [name, setName] = useState('')
   const [color, setColor] = useState('w')
   const [loading, setLoading] = useState(true)
   const [notFound, setNotFound] = useState(false)

   const {chessNotation: notation, chessOpeningExplorer: chess} = props.stores

   const keyHandler = e => {
      if (e.which > 36 && e.which < 41 && e.target.tagName !== "INPUT") {
         if (e.which === 37) notation.toPrev();
         else if (e.which === 38) notation.toFirst();
         else if (e.which === 39) notation.toNext();
         else notation.toLast();
         e.preventDefault();
      }
   }

   useEffect(() => {
      if (refEl.hasOwnProperty('addEventListener')) refEl.addEventListener('wheel', e => e.preventDefault(), {passive: false});
      document.addEventListener('keydown', keyHandler)
      if (db && id) {
         chess.getGame(db, id).catch(() => {
            setNotFound(true)
         }).finally(() => {
            setLoading(false)
         })
      }
      chess.getExplorerData()

      return () => {
         notation.chessGame.reset()
         notation.resetNode()
         document.removeEventListener('keydown', keyHandler)
      }
   }, [db, id])

   useEffect(() => {
      if (chess.currentDB !== DATABASES.UKR) {
         setShowSearch(false)
      }

   }, [chess.currentDB])

   const handleSearchSubmit = (name, color) => {
      notation.toFirst()
      setShowSearch(false)
      setShowBook(true)

      chess.setName(name)
      chess.setColor(color)
      chess.getExplorerData()
   }

   const download = (filename, text) => {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
   }

   const translateMap = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'jo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y',
      'ь': '', 'э': 'e', 'ю': 'ju', 'я': 'ja', 'і': 'i', 'є': 'e', 'ї': 'yi'
   }

   const slugify = str => {
      return str.toLowerCase().split('').map(x => translateMap[[x]] || x).join('')
        .normalize('NFKD').trim().replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
   }

   const createFileName = () => {
      let white = notation.gameHeaders.White.split(' ')[0]
      let black = notation.gameHeaders.Black.split(' ')[0]
      let year = notation.gameHeaders.Date.split('.')[0]

      return slugify(`${white} ${black} ${year}`)
   }
   if (id && loading) return <div/>
   if (id && notFound && !loading) return <Error404/>

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

        <Grid container direction={"row"} className={classes.root}>

           {matchesLG && <Grid item container direction={"column"} lg style={{padding: matchesSM ? "8px" : 0}}>
              <Grid item style={{maxHeight: "17vh"}}>
                 <GameInfo data={notation.gameHeaders}/>
              </Grid>
              <Grid item>
                 <img src={Colobki} alt={''} width={"100%"} height={"auto"}/>
              </Grid>
           </Grid>}

           <Grid item container justify={"center"}
                 style={{padding: matchesSM ? "8px" : 0}}
                 sm md lg>
              <Grid item>
                 {matchesSM && !matchesLG && <Grid item style={{maxHeight: "17vh"}}>
                    <GameInfo data={notation.gameHeaders}/>
                 </Grid>}
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
                         onCopy={() => navigator.clipboard.writeText(notation.gameToPgn())} //works only on localhost and HTTPS!!
                         onReset={() => notation.resetNode()}
                         onDownload={() => download(`${createFileName()}.pgn`, notation.gameToPgn())}
                         onSearchClick={() => setShowSearch(!showSearch)}
                         onBookClick={() => setShowBook(!showBook)}
                         showBook={showBook}
                         showSearch={showSearch}
                         currentDB={chess.currentDB}
                       />
                    </Grid>
                 </Grid>}

                 {showSearch &&
                 <Grid item>
                    <Fade in={showSearch}>
                       <GamesSearch
                         name={name}
                         color={color !== 'w'}
                         onSubmit={() => handleSearchSubmit(name, color)}
                         onChangeColor={setColor}
                         onChangeName={setName}
                       /></Fade>
                 </Grid>}
              </Grid>
           </Grid>

           <Grid container direction={"column"} sm md lg item style={{
              height: "92vh",
              padding: matchesSM ? "8px" : 0,
              maxHeight: matchesOnlyXS ? "calc(20vh + 100px)" : "none",
              minHeight: matchesOnlyXS ? "calc(20vh + 100px)" : "none",

           }}>
              {(matchesSM || !showBook) && <Grid sm md item style={{
                 overflow: "auto",
              }}>
                 <Notation
                   notation={notation.rootLine}
                   currentNode={notation.currentNode}
                   jumpTo={notation.jumpToMove}
                   promoteLine={notation.promoteLine}
                   deleteRemaining={notation.deleteRemaining}
                   deleteLine={notation.deleteLine}
                 />
              </Grid>}

              {showBook && <Grid item sm md style={{
                 overflowY: "scroll",
              }}>
                 <Fade in={showBook}>
                    <ExplorerBox
                      explorerData={chess.explorerData.moves}
                      onMove={notation.makeSanMove}
                      loading={chess.inProgress}
                      games={chess.explorerData.games}
                      setShowBook={setShowBook}
                      currentDB={chess.currentDB}
                      changeDB={chess.setDatabase}
                    />
                 </Fade>
              </Grid>}

              {matchesLG && <Grid item>
                 <Grid container justify={"center"}>
                    <NavButtons
                      toFirst={notation.toFirst}
                      toLast={notation.toLast}
                      toNext={notation.toNext}
                      toPrev={notation.toPrev}
                      onFlip={notation.flipBoard}
                      onCopy={() => navigator.clipboard.writeText(notation.gameToPgn())} //works only on localhost and HTTPS!!
                      onReset={() => notation.resetNode()}
                      onDownload={() => download(`${createFileName()}.pgn`, notation.gameToPgn())}
                      onSearchClick={() => setShowSearch(!showSearch)}
                      onBookClick={() => setShowBook(!showBook)}
                      showBook={showBook}
                      showSearch={showSearch}
                      currentDB={chess.currentDB}
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
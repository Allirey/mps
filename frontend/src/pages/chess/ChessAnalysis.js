import React, {useState, useEffect} from "react";
import GamesSearch from "../../components/chess/analysis/GamesSearch";
import Notation from "../../components/chess/analysis/Notation";
import NavButtons from "../../components/chess/analysis/NavButtons";
import GameInfo from "../../components/chess/analysis/GameInfo";
import ExplorerBox from "../../components/chess/analysis/ExplorerBox";

import ChessBoard from "../../components/chess/ChessBoard";

import Colobki from './undraw_elements_cipa.svg'
// import Error404 from "../../errors/error404";

import {Grid, makeStyles, useMediaQuery, createMuiTheme, Fade} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import {Helmet} from "react-helmet";
import {useParams} from 'react-router-dom'
import StudyChapters from "../../components/chess/analysis/OpeningChaptersTable";
import OpeningChapters from "./OpeningChapters";

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const breakpointValues = {xs: 0, sm: 700, md: 960, lg: 1280, xl: 1920,};
const theme = createMuiTheme({breakpoints: {values: breakpointValues}});

const useStyles = makeStyles(theme => ({
   root: {
      display: "flex",
      touchAction: "manipulation",
   },
   content: {
      // flexGrow: 1,
      [theme.breakpoints.up('md')]: {
         padding: theme.spacing(3),
      },
      [theme.breakpoints.only('sm')]: {
         paddingTop: theme.spacing(3),
      },
   },
}))

const ChessAnalysis = (props) => {
   const classes = useStyles();
   // const theme = useTheme();
   const {db, game_id, slug, chapter_id} = useParams()
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'));
   const matchesOnlySM = useMediaQuery(theme.breakpoints.only('sm'));
   const matchesOnlyMD = useMediaQuery(theme.breakpoints.only('md'));

   const [showBook, setShowBook] = useState(false);
   const [showSearch, setShowSearch] = useState(false);
   const [showChapters, setShowChapters] = useState(false);
   const [name, setName] = useState('')
   const [color, setColor] = useState('w')
   const [loading, setLoading] = useState(true)
   const [notFound, setNotFound] = useState(false)

   const {chessNotation: notation, chessOpeningExplorer: chess, openings} = props.stores

   const toggleBook = () => setShowBook(!showBook)
   const toggleSearch = () => setShowSearch(!showSearch)
   const toggleChapters = () => setShowChapters(!showChapters)

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
      document.addEventListener('keydown', keyHandler)
      return () => {
         notation.chessGame.reset()
         notation.resetNode()
         document.removeEventListener('keydown', keyHandler)
         openings.currentChapter = null
         openings.currentOpening = null
      }
   }, [])


   useEffect(() => {
      if (db && game_id) {
         chess.getGame(db, game_id).catch(() => {
            setNotFound(true)
         }).finally(() => {
            setLoading(false)
         })
      }
      chess.getExplorerData()

      return () => {
         notation.chessGame.reset()
         notation.resetNode()
      }
   }, [db, game_id])

   useEffect(() => {
      if (chess.currentDB !== DATABASES.UKR) {
         setShowSearch(false)
      }

   }, [chess.currentDB])

   useEffect(() => {
      slug && props.history.replace(`/chess/openings/${slug}/${slug && !chapter_id ? 1 : chapter_id}`)
      slug && openings.getOpening(slug, chapter_id)
      !slug && notation.resetNode()
      return () => setShowChapters(false)

   }, [slug, chapter_id])

   const handleSearchSubmit = () => {
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

   // if (id && loading) return <div/>
   // if (id && notFound && !loading) return <Error404/>

   return (
     <div className={classes.root}>
        <Helmet
          title={"Chess analysis board"}
        >
           <meta name={"description"} content={"Search and analyse with 3 databases: Ukraine, Masters, Lichess."}/>
           <meta property={"og:title"} content={"Chess analysis board"}/>
           <meta property={"og:description"} content={"Search and analyse."}/>
           <meta property={"og:type"} content={"website"}/>
           <meta name="twitter:card" content="summary"/>
           <meta name="twitter:title" content="Chess analysis board"/>
           <meta name="twitter:description" content="Search and analyse with 3 databases: Ukraine, Masters, Lichess."/>
           <meta name="twitter:site:id" content="741164490"/>
        </Helmet>

        {slug && <StudyChapters
          currentOpening={openings.currentOpening}
          currentChapter={openings.currentChapter}
          showChapters={showChapters}
          toggleChapters={toggleChapters}
        />}

        <Grid container direction={"row"} className={classes.content}>

           {/*{matchesLG && <Grid item container direction={"column"} lg>*/}

           {/*   {!slug && <Grid item xs style={{maxHeight: "17vh"}}>*/}
           {/*      <GameInfo data={notation.gameHeaders}/>*/}
           {/*   </Grid>}*/}
           {/*   <Grid item xs sm md lg style={{height: '73vh', overflowY: "auto"}}>*/}
           {/*      {!slug && <img src={Colobki} alt={''} width={"100%"} height={"auto"}/>}*/}
           {/*   </Grid>*/}
           {/*</Grid>}*/}


           <Grid item container justify={"center"}
                 style={{padding: matchesSM ? "8px" : 0}}
                 sm md lg>
              <Grid item>

                 {matchesSM && !matchesLG && <Grid item style={{maxHeight: "17vh"}}>
                    <GameInfo data={notation.gameHeaders}/>
                 </Grid>}

                 <ChessBoard/>

                 {!matchesLG && <Grid item>
                    <Grid container justify={"center"}>
                       <NavButtons
                         toFirst={notation.toFirst}
                         toLast={notation.toLast}
                         toNext={notation.toNext}
                         toPrev={notation.toPrev}
                         onFlip={notation.flipBoard}
                         onSearchClick={toggleSearch}
                         onBookClick={toggleBook}
                         onChaptersClick={toggleChapters}
                         showBook={showBook}
                         showSearch={showSearch}
                         showChapters={showChapters && slug}
                         currentDB={chess.currentDB}
                         showChaptersButton={slug}
                       />
                    </Grid>
                 </Grid>}

                 {showSearch &&
                 <Grid item>
                    <Fade in={showSearch}>
                       <GamesSearch
                         name={name}
                         color={color !== 'w'}
                         onSubmit={handleSearchSubmit}
                         onChangeColor={setColor}
                         onChangeName={setName}
                       /></Fade>
                 </Grid>}
              </Grid>

           </Grid>

           {matchesOnlyXS && !slug && <Grid item xs={12}>
              <Grid item><GameInfo data={notation.gameHeaders}/></Grid>
           </Grid>}

           <Grid container direction={"column"} sm md lg item>
              <>{(matchesSM || !showBook) && <Grid sm md item>
                 <Notation
                   notation={notation.rootLine}
                   currentNode={notation.currentNode}
                   jumpTo={notation.jumpToMove}
                   promoteLine={notation.promoteLine}
                   deleteRemaining={notation.deleteRemaining}
                   deleteLine={notation.deleteLine}
                 />
              </Grid>}

                 {showBook && <Grid item sm md>
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
              </>

              {matchesLG && <Grid item>
                 <Grid container justify={"center"}>
                    <NavButtons
                      toFirst={notation.toFirst}
                      toLast={notation.toLast}
                      toNext={notation.toNext}
                      toPrev={notation.toPrev}
                      onFlip={notation.flipBoard}
                      onSearchClick={toggleSearch}
                      onBookClick={toggleBook}
                      onChaptersClick={toggleChapters}
                      showBook={showBook}
                      showSearch={showSearch}
                      showChapters={showChapters && slug}
                      currentDB={chess.currentDB}
                      showChaptersButton={slug}
                    />
                 </Grid>
              </Grid>}
           </Grid>
        </Grid>

     </div>
   )
}

export default withStore(ChessAnalysis)
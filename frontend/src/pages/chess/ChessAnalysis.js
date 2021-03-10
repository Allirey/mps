import {useState, useEffect} from "react";
import {Grid, makeStyles} from "@material-ui/core";
import withStore from "../../hocs/withStore";
import {Helmet} from "react-helmet";
import {useParams} from 'react-router-dom'
import AnalyseControls from "../../components/chess/AnalyseControls";
import OpeningChapters from "../../components/chess/OpeningChapters";
import AnalyseTools from "../../components/chess/AnalyseTools";
import ChessBoard from "../../components/chess/ChessBoard";
import GameMeta from "../../components/chess/GameMeta";
// import Error404 from "../../errors/error404";

const DATABASES = {UKR: 'ukr', MASTERS: "masters", LICHESS: 'lichess'}

const useStyles = makeStyles(theme => ({
   root: {
      display: "flex",
      touchAction: "manipulation",
   },
   content: {
      [theme.breakpoints.up('md')]: {
         padding: theme.spacing(3),
      },
      [theme.breakpoints.only('sm')]: {
         paddingTop: theme.spacing(3),
         paddingLeft: theme.spacing(1),
      },
   },
   analyseTools: {order: 1},
   analyseControls: {
      order: 2,
      [theme.breakpoints.only('xs')]: {
         order: 0,
      },
   },
}))

const ChessAnalysis = (props) => {
   const classes = useStyles();

   const [showBook, setShowBook] = useState(false);
   const [showSearch, setShowSearch] = useState(false);
   const [showChapters, setShowChapters] = useState(false);
   const [name, setName] = useState('')
   const [color, setColor] = useState('w')
   const [loading, setLoading] = useState(true)
   const [notFound, setNotFound] = useState(false)

   const {chessNotation: notation, chessOpeningExplorer: chess, openings} = props.stores
   const {db, game_id, slug, chapter_id} = useParams()

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
         notation.resetNode()
         document.removeEventListener('keydown', keyHandler)
         openings.currentChapter = null
         openings.currentOpening = null
      }
   }, [])

   useEffect(() => {
      if (db && game_id) {
         chess.getGame(db, game_id)
           .catch(() => setNotFound(true))
           .finally(() => setLoading(false))
      }
      chess.getExplorerData()

      return () => notation.resetNode()
   }, [db, game_id])

   useEffect(() => {
      if (chess.currentDB !== DATABASES.UKR) setShowSearch(false)
   }, [chess.currentDB])

   useEffect(() => {
      slug && props.history.replace(`/chess/openings/${slug}/${slug && !chapter_id ? 1 : chapter_id}`)
      slug && chapter_id && openings.getOpening(slug, chapter_id)
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

        {slug && <OpeningChapters
          currentOpening={openings.currentOpening}
          currentChapter={openings.currentChapter}
          showChapters={showChapters}
          toggleChapters={toggleChapters}
        />}

        <Grid container direction={"row"} className={classes.content}>
           {!slug && <Grid item xs={12} lg><GameMeta/></Grid>}
           <Grid item><ChessBoard/></Grid>
           {/*{showSearch &&*/}
           {/*<Grid item>*/}
           {/*   <Fade in={showSearch}>*/}
           {/*      <GamesSearch*/}
           {/*        name={name}*/}
           {/*        color={color !== 'w'}*/}
           {/*        onSubmit={handleSearchSubmit}*/}
           {/*        onChangeColor={setColor}*/}
           {/*        onChangeName={setName}*/}
           {/*      /></Fade>*/}
           {/*</Grid>}*/}

           <Grid container direction={"column"} sm md lg item>
              <Grid item className={classes.analyseTools}>
                 <AnalyseTools showBook={showBook} setShowBook={setShowBook}/>
              </Grid>
              <Grid item className={classes.analyseControls}>
                 <AnalyseControls
                   onSearchClick={toggleSearch}
                   onBookClick={toggleBook}
                   onChaptersClick={toggleChapters}
                   showBook={showBook}
                   showSearch={showSearch}
                   showChapters={showChapters && slug}
                   showChaptersButton={slug}
                 />
              </Grid>
           </Grid>

        </Grid>
     </div>
   )
}

export default withStore(ChessAnalysis)
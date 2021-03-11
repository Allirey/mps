import {createRef, useEffect, useState} from 'react';
import Notation from "./Notation";
import ExplorerBox from "./ExplorerBox";
import withStore from "../../../hocs/withStore";
import {Grid, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
   root: {
      [theme.breakpoints.only('lg')]: {
         minHeight: "544px",
         maxHeight: "544px",
      },
      [theme.breakpoints.only('md')]: {
         minHeight: "512px",
         maxHeight: "512px",
      },
      [theme.breakpoints.only('sm')]: {
         minHeight: "384px",
         maxHeight: "384px",
      },
      [theme.breakpoints.only('xs')]: {
         minHeight: "calc(18vh + 100px)",
         maxHeight: "calc(18vh + 100px)",
      },
   },
}))

const AnalyseTools = ({stores, showBook, toggleBook, showSearch, closeSearch}) => {
   const classes = useStyles()
   const theme = useTheme()

   const [name, setName] = useState('')
   const [color, setColor] = useState('w')

   const {chessNotation: notation, chessOpeningExplorer: chess, openings} = stores
   let explorerBox = createRef()
   let notationBox = createRef()

   useEffect(() => {
      if (explorerBox.current) explorerBox.current.scrollTop = 0
   }, [chess.explorerData])

   useEffect(() => {
      if (notationBox.current) notationBox.current.scrollTop = 0
   }, [openings.currentChapter])

   const handleSearchSubmit = () => {
      notation.toFirst()
      closeSearch()
      console.log(1)
      !showBook && toggleBook()

      chess.setName(name)
      chess.setColor(color)
      chess.getExplorerData()
   }

   return <Grid component={Paper} container className={classes.root} direction={"column"}>
      {(useMediaQuery(theme.breakpoints.up("sm")) || !showBook) && <Grid item xs sm md lg
                                                                         style={{overflowY: "auto"}}
                                                                         ref={notationBox}>
         <Notation
           notation={notation.rootLine}
           currentNode={notation.currentNode}
           jumpTo={notation.jumpToMove}
           promoteLine={notation.promoteLine}
           deleteRemaining={notation.deleteRemaining}
           deleteLine={notation.deleteLine}
         />
      </Grid>}

      {showBook && <Grid item xs sm md lg style={{overflowY: "auto"}} ref={explorerBox}>
         <ExplorerBox
           explorerData={chess.explorerData.moves}
           onMove={notation.makeSanMove}
           loading={chess.inProgress}
           games={chess.explorerData.games}
           currentDB={chess.currentDB}
           changeDB={chess.setDatabase}
           showBook={showBook}
           toggleBook={toggleBook}
           showSearch={showSearch}
           closeSearch={closeSearch}

           name={name}
           color={color !== 'w'}
           onSubmit={handleSearchSubmit}
           onChangeColor={setColor}
           onChangeName={setName}
         />
      </Grid>}
   </Grid>
}

export default withStore(AnalyseTools)
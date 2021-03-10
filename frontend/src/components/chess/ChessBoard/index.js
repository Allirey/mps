import {createRef, useEffect} from 'react';
import withStore from "../../../hocs/withStore";
import ChessGround from "react-chessground";
import {Button, Dialog, DialogActions, Paper, useMediaQuery, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import ChessBoardBlueTheme from "./chessBoardBlue.svg";
import "react-chessground/dist/styles/chessground.css"
import "./cburnett.css"
import wQ from "./pieces/wQ.svg";
import wN from "./pieces/wN.svg";
import wR from "./pieces/wR.svg";
import wB from "./pieces/wB.svg";
import bQ from "./pieces/bQ.svg";
import bN from "./pieces/bN.svg";
import bR from "./pieces/bR.svg";
import bB from "./pieces/bB.svg";

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
      "& .cg-custom-svgs":{
        height: 0,
      },
      "& cg-board square.last-move": {
         backgroundColor: "lightgreen",
         opacity: "0.41"
      },
      [theme.breakpoints.up('sm')]: {
         marginRight: "24px",
      },
   },
}))

const ChessBoard = ({stores}) => {
   const classes = useStyles()
   const theme = useTheme()
   const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));
   const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
   const matchesOnlyXS = useMediaQuery(theme.breakpoints.only('xs'));

   let refEl = createRef();

   useEffect(() => {
      let el = refEl.current
      el && el.addEventListener('wheel', e => e.preventDefault(), {passive: false});
      return () => el && el.removeEventListener('wheel', e => e.preventDefault(), {passive: false});
   }, [refEl])

   const {chessNotation: notation} = stores
   const onBoardWheel = e => {
      return e.deltaY < 0 ? notation.toPrev() : notation.toNext()
   }

   return <><Paper elevation={2} ref={refEl} className={classes.chessField} onWheel={onBoardWheel}>
      <ChessGround
        width={matchesLG ? "544px" : matchesOnlyXS ? "100vmin" : matchesMD ? "512px" : "384px"}
        height={matchesLG ? "544px" : matchesOnlyXS ? "100vmin" : matchesMD ? "512px" : "384px"}
        orientation={notation.boardOrientation}
        viewOnly={false}
        turnColor={notation.turnColor()}
        movable={notation.calcMovable}
        lastMove={notation.lastMove}
        fen={notation.currentNode.fen}
        check={notation.inCheck}
        // style={{margin: "auto"}}
        coordinates={false}
        onMove={notation.onMove}
      />
   </Paper>
      <Dialog transitionDuration={0} open={notation.showPieceSelectMenu} onClose={() => {
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
}

export default withStore(ChessBoard)
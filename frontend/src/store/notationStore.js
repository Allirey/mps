import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'

class NotationStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
   }

   chessGame = new Chess();

   node = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      ply: 0,
      san: '',
      uci: {from: null, to: null},
   };

   mainLineNodes = [];
   boardOrientation = "white";

   initMainLineNodes = (pgn) => {
      this.resetNode();

      if (pgn === null) return

      this.chessGame.load_pgn(pgn, {sloppy: true});
      let tmp = this.chessGame.history();
      this.chessGame = new Chess();

      this.mainLineNodes = tmp.map((srcMove, i) => {
         let move = this.chessGame.move(srcMove, {sloppy: true});
         return {
            fen: this.chessGame.fen(),
            san: move.san,
            ply: i,
            uci: {from: move.from, to: move.to}
         }
      });
   };

   flipBoard = () => this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";

   jumpToNode(index) {
      let currentIndex = this.mainLineNodes.findIndex((obj) => obj === this.node, this.node);
      let newIndex = currentIndex + index;
      if (newIndex < 0 || this.mainLineNodes.length === 0) {
         this.node = {
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            ply: 0,
            san: '',
            uci: {from: null, to: null},
         };
      } else {
         this.node = this.mainLineNodes[Math.min(newIndex, this.mainLineNodes.length - 1)]
      }
      this.rootStore.chessOpeningExplorer.searchData.fen = this.node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   }

   get lastMove() {
      return typeof this.node === "undefined" || this.node.uci.from === null ? [] : [this.node.uci.from, this.node.uci.to];
   }

   get fen() {
      return typeof this.node === "undefined" ?
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' : this.node.fen;
   }

   jumpToMove = (index) => {
      this.node = this.mainLineNodes[index]
      this.rootStore.chessOpeningExplorer.searchData.fen = this.node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   toNext = () => {
      this.jumpToNode(1)
   };

   toPrev = () => {
      this.jumpToNode(-1)
   };

   toFirst = () => {
      this.jumpToNode(-1000)
   };

   toLast = () => {
      this.jumpToNode(this.mainLineNodes.length - this.mainLineNodes.findIndex((obj) => obj === this.node, this.node) - 1)
   };

   resetNode = () => {
      this.mainLineNodes = [];
      this.chessGame.reset();
      this.node = {
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
         ply: 0,
         san: '',
         uci: {from: null, to: null},
      };
      this.rootStore.chessOpeningExplorer.searchData.fen = this.node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   }

   nodes = []
   currentNode = {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      san: ''
   }
   currentFen = ''

   onMove = (from, to) => {
      console.log(from, to)

      let move = this.chessGame.move({from, to})
      if (move) {
         this.currentNode.san = this.chessGame.history()[this.chessGame.history().length - 1]
         this.nodes.push(this.currentNode)
         this.currentNode = {fen: this.chessGame.fen(), san:''}

         this.currentFen = this.chessGame.fen()
      }
      console.log(this.chessGame.history())

   }

   calcMovable() {
      const dests = new Map()
      this.chessGame.SQUARES.forEach(s => {
         const ms = this.chessGame.moves({square: s, verbose: true})
         if (ms.length) dests.set(s, ms.map(m => m.to))
      })
      return {
         free: false,
         dests,
         color: this.turnColor()
      }
   }

   turnColor() {
      return this.chessGame.turn() === "w" ? "white" : "black"
   }
}

decorate(NotationStore, {
     node: observable,
     mainLineNodes: observable,
     boardOrientation: observable,

     // chessGame: observable,



     nodes: observable,
     currentNode: observable,
     currentFen: observable,


     initMainLineNodes: action,
     flipBoard: action,
     jumpToMove: action,
     toNext: action,
     toPrev: action,
     toFirst: action,
     toLast: action,
     resetNode: action,
     onMove: action,

     lastMove: computed,
     fen: computed,
  }
);

export default NotationStore;
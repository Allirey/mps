import {observable, computed, action, decorate} from 'mobx';
import Chess from 'chess.js'


class ChessMoveLine {
   constructor(parentMove = null) {
      this.parentMove = parentMove
      this.first = null
      this.last = null
   }

   append(moveData, currentNode = null) {
      let move = new ChessMove(this, moveData.fen, moveData.san, moveData.from, moveData.to)

      if (!this.first) {
         this.first = move
         this.last = move
         return {line: this, node: move}
      }

      if (currentNode && currentNode.next) {
         if (currentNode.next.fen === move.fen && currentNode.next.san === move.san) {
            return {line: this, node: currentNode.next}
         }

         let filteredSubLines = currentNode.next.subLines.filter(x => x.first.fen === move.fen && x.first.san === move.san)

         if (!!filteredSubLines.length) {
            move.moveLine = filteredSubLines[0]
            return {line: filteredSubLines[0], node: filteredSubLines[0].first}
         }

         let newline = new ChessMoveLine(currentNode.next)
         move.moveLine = newline
         move.prev = currentNode

         newline.first = move
         newline.last = move
         currentNode.next.subLines.push(newline)
         return {line: newline, node: move}
      }

      this.last.next = move
      move.prev = this.last
      this.last = move

      return {line: this, node: move}
   }

   promoteLine(move) {
      let oldMainMove = move.moveLine.parentMove

      move.subLines = [...oldMainMove.subLines.filter(x => x.first.fen !== move.moveLine.first.fen),
         oldMainMove.moveLine]

      oldMainMove.prev.next = move // ?? wtf is this really work?
   }

   deleteNextMoves(move) {
      this.last = move
      move.next = null
   }

   deleteLine(move) {
      this.first = null
   }

   reset() {
      this.parentMove = null
      this.first = null
      this.last = null
   }

   toArr() {
      const nodes = [];

      let currentNode = this.first;
      while (currentNode) {
         nodes.push(currentNode);
         currentNode = currentNode.next;
      }
      return nodes;
   }
}

class ChessMove {
   constructor(moveLine, fen, san, from, to) {
      this.moveLine = moveLine
      this.fen = fen
      this.san = san
      this.from = from
      this.to = to

      this.prev = null
      this.next = null
      this.subLines = []
   }
}

class NotationStore {
   constructor(rootStore) {
      this.rootStore = rootStore;
      this.rootLine = new ChessMoveLine()

      const {line, node} = this.rootLine.append({
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: '', from: '', to: ''
      })

      this.currentNode = node
      this.currentLine = line
   }

   chessGame = new Chess();
   inCheck = false

   boardOrientation = "white";

   loadGame = (pgn) => {
      this.chessGame.load_pgn(pgn, {sloppy: true})
      let history = this.chessGame.history()

      this.resetNode()

      this.rootLine = history.reduce((line, m) => {
         let move = this.chessGame.move(m, {sloppy: true});
         line.append({fen: this.chessGame.fen(), san: move.san, from: move.from, to: move.to})

         return line
      }, this.rootLine)
   }

   flipBoard = () => this.boardOrientation = this.boardOrientation === "white" ? "black" : "white";

   jumpToMove = (node) => {
      this.currentNode = node
      this.currentLine = node.moveLine
      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   toNext = () => {
      let node = this.currentNode.next || this.currentNode

      this.currentNode = node
      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   toPrev = () => {
      let node = this.currentNode.prev || this.currentNode

      this.currentNode = node
      this.currentLine = node.moveLine

      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   toFirst = () => {
      let node = this.currentNode.moveLine.first
      this.currentNode = node
      this.chessGame.load(node.fen)

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   toLast = () => {
      this.currentNode = this.currentNode.moveLine.last

      this.rootStore.chessOpeningExplorer.searchData.fen = this.currentNode.moveLine.last.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   };

   resetNode = () => {
      this.chessGame.reset();

      this.rootLine = new ChessMoveLine()

      const {line, node} = this.rootLine.append({
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: '', from: '', to: ''
      })

      this.currentNode = node
      this.currentLine = line

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   }

   onMove = (from, to) => {
      this.chessGame = new Chess()
      this.chessGame.load(this.currentNode.fen)

      let m = this.chessGame.move({from, to})
      if (m) {
         let moveData = {fen: this.chessGame.fen(), san: m.san, from: m.from, to: m.to}

         const {line, node} = this.currentLine.append(moveData, this.currentNode)

         this.currentLine = line
         this.currentNode = node

         this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
         this.rootStore.chessOpeningExplorer.searchGames();
      }
   }

   get calcMovable() {
      this.chessGame.load(this.currentNode.fen)
      this.inCheck = this.chessGame.in_check()

      const dests = new Map()
      this.chessGame.SQUARES.forEach(s => {
         const ms = this.chessGame.moves({square: s, verbose: true})
         if (ms.length) dests.set(s, ms.map(m => m.to))
      })
      return {free: false, dests, color: this.turnColor()}
   }

   turnColor() {
      return this.chessGame.turn() === "w" ? "white" : "black"
   }

   get lastMove() {
      return this.currentNode.from ? [this.currentNode.from, this.currentNode.to] : [];
   }
}

decorate(NotationStore, {
     boardOrientation: observable,
     chessGame: observable,
     rootLine: observable,
     currentNode: observable,
     currentLine: observable,

     loadGame: action,
     flipBoard: action,
     jumpToMove: action,
     toNext: action,
     toPrev: action,
     toFirst: action,
     toLast: action,
     resetNode: action,
     onMove: action,

     calcMovable: computed,
     lastMove: computed,
  }
);

export default NotationStore;
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
      if (move.moveLine.parentMove === null || !move.moveLine.parentMove) return {line: move.moveLine, node: move}

      let toDemote = move.moveLine.parentMove
      let toPromote = move.moveLine.first
      let lineToDemote = new ChessMoveLine(toPromote)
      let lineToPromote = toDemote.moveLine

      toPromote.subLines = toDemote.subLines.filter(x => x.first.san !== toPromote.san).concat([lineToDemote])
      toDemote.subLines = []
      lineToDemote.first = toDemote
      lineToDemote.parentMove = toPromote

      let cur = toDemote
      while (cur) {
         cur.moveLine = lineToDemote
         if (!cur.next) {
            lineToDemote.last = cur;
            break
         } else cur = cur.next
      }

      cur = toPromote
      while (cur) {
         cur.moveLine = lineToPromote
         if (!cur.next) {
            lineToPromote.last = cur;
            break
         } else cur = cur.next
      }

      toDemote.prev.next = toPromote

      return {line: move.moveLine, node: move}
   }

   deleteNextMoves(move) {
      this.last = move
      move.next = null
   }

   deleteLine(move) {
      if (!move.moveLine.parentMove) {
         move.moveLine.first.next = null
         move.moveLine.last = move.moveLine.first

         return {line: move.moveLine, node: move.moveLine.first}
      } else {
         move.moveLine.parentMove.subLines = move.moveLine.parentMove.subLines.filter(line => line !== move.moveLine)

         return {line: move.prev.moveLine, node: move.moveLine.first.prev}
      }
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

      history.forEach(m => {
         let move = this.chessGame.move(m, {sloppy: true});
         this.rootLine.append({fen: this.chessGame.fen(), san: move.san, from: move.from, to: move.to})
      })

      this.currentNode = this.rootLine.first.next
      this.toPrev()
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

   resetNode() {
      this.chessGame = new Chess()

      const {line, node} = new ChessMoveLine().append({
         fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', san: '', from: '', to: ''
      })

      this.currentNode = node
      this.currentLine = line
      this.rootLine = line

      this.rootStore.chessOpeningExplorer.searchData.fen = node.fen
      this.rootStore.chessOpeningExplorer.searchGames();
   }

   showPieceSelectMenu = false
   pendingMove = null

   promotion(piece) {
      this.onMove(this.pendingMove.from, this.pendingMove.to, piece)
      this.showPieceSelectMenu = false
      this.pendingMove = null
   }

   onMove = (from, to, piece = 'x') => {
      this.chessGame = new Chess()
      this.chessGame.load(this.currentNode.fen)

      for (let move of this.chessGame.moves({verbose: true})) {
         if (!this.pendingMove && move.flags.indexOf("p") !== -1 && move.from === from) {
            this.pendingMove = {from, to}
            this.showPieceSelectMenu = true
            return
         }
      }

      let m = this.chessGame.move({from, to, promotion: piece})

      if (m) {
         const {line, node} = this.currentLine.append(
           {fen: this.chessGame.fen(), san: m.san, from: m.from, to: m.to}, this.currentNode)

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

   turnColor = () => {
      return this.chessGame.turn() === "w" ? "white" : "black"
   }

   get lastMove() {
      return this.currentNode.from ? [this.currentNode.from, this.currentNode.to] : [];
   }

   promoteLine = (move) => {
      const {line, node} = move.moveLine.promoteLine(move)

      this.currentNode = node
      this.currentLine = line
      this.chessGame.reset()
      this.chessGame.load(node.fen)
   }

   deleteLine = (move) => {
      const {line, node} = move.moveLine.deleteLine(move)

      this.currentNode = node
      this.currentLine = line

      this.chessGame.reset()
      this.chessGame.load(node.fen)
   }

   deleteRemaining = (move) => {
      this.currentNode = move
      move.moveLine.deleteNextMoves(move)

      this.chessGame.reset()
      this.chessGame.load(move.fen)
   }
}

decorate(NotationStore, {
     boardOrientation: observable,
     chessGame: observable,
     rootLine: observable,
     currentNode: observable,
     currentLine: observable,
     showPieceSelectMenu: observable,
     pendingMove: observable,

     promoteLine: action,
     deleteLine: action,
     deleteRemaining: action,
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